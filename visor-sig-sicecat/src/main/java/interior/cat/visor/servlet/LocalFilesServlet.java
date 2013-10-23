package interior.cat.visor.servlet;

import interior.cat.visor.utils.EnvironmentUtils;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Servlet para leer ficheros locales y enviarlos al navegador. Necesita recibir
 * un parámetro en web.xml, rutaDirectorioConfigVisor, que indique el directorio
 * en el que estarán los archivos a servir.
 * 
 * @author jlrodriguez
 * 
 */
public class LocalFilesServlet extends HttpServlet {
	private static final long serialVersionUID = 2992922017154725204L;
	private static Log logger = LogFactory.getLog(LocalFilesServlet.class);
	private String basePath;

	@Override
	public void init() throws ServletException { 
		String platform = System.getProperty(EnvironmentUtils.PLATFORM_PARAMETER);
		String environment = System.getProperty(EnvironmentUtils.ENV_PARAMETER);
		
		basePath = 
//				getServletConfig().getInitParameter("rutaDirectorioConfigVisor")
				EnvironmentUtils.getConfigPath(platform, environment);
		if (basePath == null) {
			throw new ServletException(
//					"No se ha configurado el directorio de configuración del visor. "
//							+ "Compruebe el valor del parámetro rutaDirectorioConfigVisor en el fichero web.xml."
					"No existe ruta asociada al entorn " + environment + " of the platform " + platform		
							);
		}

		File path = new File(basePath);
		if (!(path.exists() && path.canRead())) {
			throw new ServletException(
					"El directorio "
							+ basePath
							+ " con la configuración del visor no existe o no se puede leer. "
//							+ "Compruebe el valor del parámetro rutaDirectorioConfigVisor en el fichero web.xml"
							+ "Compruebe laa variablea de entorno -Dentorn -Dplatform"
							);
		}

	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		processRequest(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		super.doPost(req, resp);
	}

	private void processRequest(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String pathInfo = req.getPathInfo();
		if(pathInfo != null 
			&& pathInfo.endsWith(".do")){
			pathInfo = pathInfo.substring(0, pathInfo.length() - 3);
		}
		logger.debug("Buscando el archivo " + pathInfo);

		if (pathInfo != null) {
			String filePath = basePath + pathInfo;
			String directoryCanonicalPath = new File(basePath)
					.getCanonicalPath();
			File originalFile = new File(filePath);
			String originalCanonicalPath = originalFile.getCanonicalPath();
			
			System.out.println("El archivo debe estar en '" + originalCanonicalPath + "'");

			// Check that requested file is in the correct directory
			if (!originalCanonicalPath.startsWith(directoryCanonicalPath)) {
				logger.info("Fichero " + originalCanonicalPath
						+ " fuera del directorio esperado (" + basePath + ")");
				resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
				return;
			}

			// Check that file exists and we can read it
			if (!(originalFile.exists() && originalFile.canRead())) {
				logger.warn(originalCanonicalPath
						+ " no existe o no se puede leer");
				resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
				return;
			}

			try {
				
				resp.setCharacterEncoding("UTF8");
				resp.setContentType("application/json");
				BufferedReader reader = new BufferedReader(new FileReader(
						originalFile));
				// BufferedWriter writer = new BufferedWriter(
				// new OutputStreamWriter (resp.getOutputStream(), "UTF8"));
				BufferedWriter writer = new BufferedWriter(resp.getWriter());

				String line = null;
				while ((line = reader.readLine()) != null) {
					writer.write(line);
					writer.newLine();

				}
				reader.close();
				writer.close();
			} catch (Exception e) {
				logger.error("Error enviado fichero de configuración al navegador", e);
			}

		}

		System.out.println(req.getPathInfo());

	}

}
