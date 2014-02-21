/**
 * Copyright (C) 2011
 * 
 * This file is part of Proyecto SiceCAT
 * 
 * This software is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * As a special exception, if you link this library with other files to
 * produce an executable, this library does not by itself cause the
 * resulting executable to be covered by the GNU General Public License.
 * This exception does not however invalidate any other reasons why the
 * executable file might be covered by the GNU General Public License.
 * 
 */
package interior.cat.visor.servlet;

import java.awt.HeadlessException;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.awt.image.RenderedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.imageio.IIOException;
import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageTypeSpecifier;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.metadata.IIOInvalidTreeException;
import javax.imageio.metadata.IIOMetadata;
import javax.imageio.metadata.IIOMetadataNode;
import javax.imageio.stream.ImageOutputStream;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.util.PDFImageWriter;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.json.JSONWriter;
import org.mapfish.print.MapPrinter;
import org.pvalsecc.misc.FileUtilities;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.lowagie.text.pdf.PdfReader;

/**
 * @author María Arias de Reyna Domínguez marias@emergya.com
 * 
 */
public class MapPrinterImageServlet extends MapPrinterServletMod {

	private static final String DEFAULT_IMAGE_TYPE = "PNG";
	protected static final String TEMP_FILE_PREFIX = "map-image";
	protected static final Logger LOGGER = Logger
			.getLogger(MapPrinterImageServlet.class);
	private static final long serialVersionUID = -6354472492052856179L;

	/**
	 * Map of temporary files.
	 */
	private final Map<Long, File> temporalFiles = new HashMap<Long, File>();

	@Override
	protected void doPost(HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse) throws ServletException,
			IOException {
		final String additionalPath = httpServletRequest.getPathInfo();
		final String idFile = httpServletRequest.getParameter("id");
		if (additionalPath != null && additionalPath.equals(CREATE_URL)) {
			createImage(httpServletRequest, httpServletResponse,
					getBaseUrl(httpServletRequest));
		}else if(idFile != null){
        	getImage(httpServletRequest, httpServletResponse, idFile);
        } else {
			error(httpServletResponse, "Unknown method: " + additionalPath, 404);
		}
	}

	@Override
	protected void doGet(HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse) throws ServletException,
			IOException {
		final String additionalPath = httpServletRequest.getPathInfo();
		LOGGER.trace("doGet(" + additionalPath + ")");
		//LOGGER.trace(getServletContext().getRealPath("."));
		if (additionalPath.equals(INFO_URL)) {
			getInfo(httpServletRequest, httpServletResponse,
					getBaseUrl(httpServletRequest));
		} else if (additionalPath.startsWith("/")) {
			getImage(httpServletRequest, httpServletResponse,
					additionalPath.substring(1, additionalPath.length()));
		} else {
			error(httpServletResponse, "Unknown method: " + additionalPath, 404);
		}
	}

	/**
	 * To get the image created previously.
	 * 
	 * @param httpServletRequest
	 */
	protected void getImage(HttpServletRequest req,
			HttpServletResponse httpServletResponse, String id)
			throws IOException {

		LOGGER.trace("getImage(" + id + ")");
		final File file = getTempFile(id);
		if (file == null) {
			error(httpServletResponse, "File with id=" + id + " unknown", 404);
			return;
		}

		String imageFormat = null;
		try {
			imageFormat = id.substring(id.lastIndexOf(".") + 1);
		} catch (Throwable e) {
			LOGGER.trace("getScreenResolution() failed", e);
			imageFormat = DEFAULT_IMAGE_TYPE;
		}

		sendImageFile(httpServletResponse, file,
				Boolean.parseBoolean(req.getParameter("inline")), imageFormat);
	}

	private void sendImageFile(HttpServletResponse httpServletResponse,
			File tempFile, boolean inline, String imagetype) throws IOException {
		LOGGER.debug("Sending " + imagetype + " " + tempFile.getAbsolutePath());
		FileInputStream image = new FileInputStream(tempFile);
		final OutputStream response = httpServletResponse.getOutputStream();
		httpServletResponse.setContentType("image/" + imagetype);
		if (inline != true) {
			String name = tempFile.getName();
			httpServletResponse.setHeader("Content-disposition",
					"attachment;filename=" + name + ".png");
		}
		FileUtilities.copyStream(image, response);
		image.close();
		response.close();
	}

	protected void createImage(HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse, String basePath)
			throws ServletException {
		LOGGER.debug("createImage(basePath={" + basePath + "})");
		File tempFile = null;
		String spec = "";

		try {
			spec = getSpecFromPostBody(httpServletRequest);
			LOGGER.trace("spec = " + spec);

			tempFile = File.createTempFile("temp", "pdf",
					new File(System.getProperty("java.io.tmpdir")));

			String referer = httpServletRequest.getHeader("Referer");
			FileOutputStream out = new FileOutputStream(tempFile);
			String configPath = getInitParameter("config");
			if (configPath.endsWith(".yaml"))
				configPath = configPath.substring(0, configPath.length() - 5);

			LOGGER.trace("config path: " + configPath);
			MapPrinter printer = super.getMapPrinter(configPath);

			printer.print(MapPrinter.parseSpec(spec), out, referer);
			out.close();

			if (LOGGER.isTraceEnabled()) {
				LOGGER.trace("Temporal PDF File: " + tempFile);
				FileReader fr = new FileReader(tempFile);
				BufferedReader br = new BufferedReader(fr);
				String s;
				LOGGER.trace("Contenido del fichero:");
				while ((s = br.readLine()) != null) {
					LOGGER.trace(s);
				}
				fr.close();
				br.close();
			}
			tempFile = convertPDFtoImage(getImageType(spec), tempFile);
			if (LOGGER.isTraceEnabled()) {
				LOGGER.trace("Temporal image File: " + tempFile);
				FileReader fr = new FileReader(tempFile);
				BufferedReader br = new BufferedReader(fr);
				String s;
				LOGGER.trace("Contenido del fichero:");
				while ((s = br.readLine()) != null) {
					LOGGER.trace(s);
				}
				fr.close();
				br.close();
			}

			if (tempFile == null) {
				error(httpServletResponse,
						"Error generating image: There is no tempFile", 500);
				return;
			}
		} catch (Throwable e) {
			LOGGER.error("Error generating image", e);
			deleteFile(tempFile);
			error(httpServletResponse, e);
			return;
		}

		Long id = addTempFile(tempFile);
		httpServletResponse.setContentType("application/json; charset=utf-8");

		try {
			final PrintWriter writer = httpServletResponse.getWriter();
			JSONWriter json = new JSONWriter(writer);
			json.object();
			{
				json.key("getURL").value(
						basePath + "/" + id + "." + getImageType(spec));
			}
			json.endObject();
		} catch (Throwable e) {
			deleteFile(tempFile);
			throw new ServletException(e);
		}
	}

	private String getImageType(String spec) {
		String imageFormat = DEFAULT_IMAGE_TYPE;
		try {
			JSONTokener tokener = new JSONTokener(spec);
			JSONObject arguments = new JSONObject(tokener);
			imageFormat = arguments.getString("outputFormat");
		} catch (Throwable e) {
			LOGGER.trace("getScreenResolution() failed", e);
			imageFormat = DEFAULT_IMAGE_TYPE;
		}
		return imageFormat;
	}

	private File convertPDFtoImage(String imageFormat, File tmpPDF) {
		String pdfFile = tmpPDF.getAbsolutePath();
		LOGGER.debug("convertPDFToImage(tmpPDF={" + tmpPDF.getAbsolutePath() + "})");
		String outputPrefix = TEMP_FILE_PREFIX;

		int endPage = Integer.MAX_VALUE;
		try {
			PdfReader document = new PdfReader(tmpPDF.getAbsolutePath());
			endPage = document.getNumberOfPages();
		} catch (Throwable t) {
			LOGGER.warn("Unknown number of pages", t);
		}
		LOGGER.trace("Printing page " + endPage + " from PDF");

		String color = "rgb";
		int resolution = 96;
		try {
			resolution = Toolkit.getDefaultToolkit().getScreenResolution();
		} catch (HeadlessException e) {
			LOGGER.trace("No screen", e);
		}

		if (pdfFile == null)
			throw new NullPointerException("There was no PDF");

		PDDocument document = null;
		int imageType = 24;
		try {
			document = PDDocument.load(pdfFile);
			if ("bilevel".equalsIgnoreCase(color)) {
				imageType = BufferedImage.TYPE_BYTE_BINARY;
			} else if ("indexed".equalsIgnoreCase(color)) {
				imageType = BufferedImage.TYPE_BYTE_INDEXED;
			} else if ("gray".equalsIgnoreCase(color)) {
				imageType = BufferedImage.TYPE_BYTE_GRAY;
			} else if ("rgb".equalsIgnoreCase(color)) {
				imageType = BufferedImage.TYPE_INT_RGB;
			} else if ("rgba".equalsIgnoreCase(color)) {
				imageType = BufferedImage.TYPE_INT_ARGB;
			} else
				throw new Exception(
						"Error: the number of bits per pixel must be 1, 8 or 24.");

		} catch (Throwable e) {
			LOGGER.error("load(pdfFile) failed", e);
		}

		try {
			// Make the call
			CustomImageWriter imageWriter = new CustomImageWriter();
			File f = imageWriter.writeImageToFile(document, imageFormat, "",
					endPage, endPage, outputPrefix, imageType, resolution);
			LOGGER.trace("File created: " + f.getAbsolutePath());
			return f;
		} catch (Throwable e) {
			LOGGER.error("Error generating " + imageFormat, e);
			return null;
		} finally {

		}
	}

	/**
	 * Will purge all the known temporary files older than 200 seconds.
	 */
	private void purgeOldTemporalFiles() {
		final long minTime = System.currentTimeMillis() - 200 * 1000L;
		LinkedList<File> toRemove = new LinkedList<File>();
		synchronized (temporalFiles) {
			for (Long key : temporalFiles.keySet()) {
				if (key < minTime) {
					toRemove.add(temporalFiles.get(key));
				}
			}
			for (File f : toRemove)
				deleteFile(f);
		}
	}

	private File getTempFile(String id) {
		if (id.indexOf(".") >= 0)
			id = id.substring(0, id.indexOf("."));

		return getTempFile(new Long(id));
	}

	private File getTempFile(Long id) {
		final File file;
		synchronized (temporalFiles) {
			file = temporalFiles.get(id);
		}
		return file;
	}

	private Long addTempFile(File tempFile) {
		purgeOldTemporalFiles();
		synchronized (temporalFiles) {
			long currentTimeMillis = System.currentTimeMillis();
			LOGGER.trace("Adding file " + tempFile.getAbsolutePath() + " as "
					+ currentTimeMillis);
			temporalFiles.put(currentTimeMillis, tempFile);
			return currentTimeMillis;
		}
	}
}

class CustomImageWriter extends PDFImageWriter {
	/**
	 * Converts a given page range of a PDF document to bitmap images.
	 * 
	 * @param document
	 *            the PDF document
	 * @param imageFormat
	 *            the target image format
	 * @param password
	 *            the password (needed if the PDF is encrypted)
	 * @param startPage
	 *            the start page (1 is the first page)
	 * @param endPage
	 *            the end page (set to Integer.MAX_VALUE for all pages)
	 * @param outputPrefix
	 *            used to construct the filename for the individual images
	 * @param imageType
	 *            the image type (see {@link BufferedImage}.TYPE_*)
	 * @param resolution
	 *            the resolution in dpi (dots per inch)
	 * @return true if the images were produced, false if there was an error
	 * @throws IOException
	 *             if an I/O error occurs
	 */
	public File writeImageToFile(PDDocument document, String imageFormat,
			String password, int startPage, int endPage, String outputPrefix,
			int imageType, int resolution) throws IOException {
		@SuppressWarnings("unchecked")
		List<PDPage> pages = document.getDocumentCatalog().getAllPages();
		File file = null;
		for (int i = startPage - 1; i < endPage && i < pages.size(); i++) {
			ImageOutputStream output = null;
			ImageWriter imageWriter = null;
			try {
				PDPage page = (PDPage) pages.get(i);
				BufferedImage image = page
						.convertToImage(imageType, resolution);

				file = File.createTempFile(outputPrefix + (i + 1) + ".",
						imageFormat,
						new File(System.getProperty("java.io.tmpdir")));

				output = ImageIO.createImageOutputStream(file);

				boolean foundWriter = false;
				Iterator<ImageWriter> writerIter = ImageIO
						.getImageWritersByFormatName(imageFormat);
				while (writerIter.hasNext() && !foundWriter) {
					try {
						imageWriter = (ImageWriter) writerIter.next();
						ImageWriteParam writerParams = imageWriter
								.getDefaultWriteParam();
						if (writerParams.canWriteCompressed()) {
							writerParams
									.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
							writerParams.setCompressionQuality(1.0f);
						}
						IIOMetadata meta = createMetadata(image, imageWriter,
								writerParams, resolution);
						imageWriter.setOutput(output);
						imageWriter.write(null,
								new IIOImage(image, null, meta), writerParams);
						foundWriter = true;
					} catch (IIOException io) {
						throw new IOException(io.getMessage());
					} finally {
						if (imageWriter != null) {
							imageWriter.dispose();
						}
					}
				}
			} finally {
				if (output != null) {
					output.flush();
					output.close();
					return file;
				}
			}
		}
		return null;
	}

	private IIOMetadata createMetadata(RenderedImage image,
			ImageWriter imageWriter, ImageWriteParam writerParams,
			int resolution) {
		ImageTypeSpecifier type;
		if (writerParams.getDestinationType() != null) {
			type = writerParams.getDestinationType();
		} else {
			type = ImageTypeSpecifier.createFromRenderedImage(image);
		}
		IIOMetadata meta = imageWriter.getDefaultImageMetadata(type,
				writerParams);
		return (addResolution(meta, resolution) ? meta : null);
	}

	private static final String STANDARD_METADATA_FORMAT = "javax_imageio_1.0";

	private boolean addResolution(IIOMetadata meta, int resolution) {
		if (meta.isStandardMetadataFormatSupported()) {
			IIOMetadataNode root = (IIOMetadataNode) meta
					.getAsTree(STANDARD_METADATA_FORMAT);
			IIOMetadataNode dim = getChildNode(root, "Dimension");
			IIOMetadataNode child;
			child = getChildNode(dim, "HorizontalPixelSize");
			if (child == null) {
				child = new IIOMetadataNode("HorizontalPixelSize");
				dim.appendChild(child);
			}
			child.setAttribute("value", Double.toString(resolution / 25.4));
			child = getChildNode(dim, "VerticalPixelSize");
			if (child == null) {
				child = new IIOMetadataNode("VerticalPixelSize");
				dim.appendChild(child);
			}
			child.setAttribute("value", Double.toString(resolution / 25.4));
			try {
				meta.mergeTree(STANDARD_METADATA_FORMAT, root);
			} catch (IIOInvalidTreeException e) {
				throw new RuntimeException("Cannot update image metadata: "
						+ e.getMessage());
			}
			return true;
		}
		return false;
	}

	private static IIOMetadataNode getChildNode(Node n, String name) {
		NodeList nodes = n.getChildNodes();
		for (int i = 0; i < nodes.getLength(); i++) {
			Node child = nodes.item(i);
			if (name.equals(child.getNodeName())) {
				return (IIOMetadataNode) child;
			}
		}
		return null;
	}
}
