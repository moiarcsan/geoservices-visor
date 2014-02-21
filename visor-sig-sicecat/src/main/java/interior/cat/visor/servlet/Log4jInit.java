package interior.cat.visor.servlet;

import interior.cat.visor.utils.EnvironmentUtils;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author Moisés Arcos Santiago marcos@emergya.com
 * 
 */
public class Log4jInit extends HttpServlet {

  /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

public
  void init() {
    String platform = System.getProperty(EnvironmentUtils.PLATFORM_PARAMETER);
	String environment = System.getProperty(EnvironmentUtils.ENV_PARAMETER);
    EnvironmentUtils.doLog4jConfiguration(platform, environment);
  }

  public
  void doGet(HttpServletRequest req, HttpServletResponse res) {
  }
}
