#! /bin/bash
# SCRIPT PARA despliegue en Weblogic
#
# *************************************************************************
# This script is used to start WebLogic Server for this domain.
# 
# To create your own start script for your domain, you can initialize the
# environment by calling @USERDOMAINHOME/setDomainEnv.
# 
# setDomainEnv initializes or calls commEnv to initialize the following variables:
# 
# WEBLOGIC_SERVER server for deploy
# WEBLOGIC_USER user to use in ${WEBLOGIC_SERVER}
# WEBLOGIC_HOME home for Weblogic instalation
# DOMAIN domain for deploy
# SERVICE_NAME name of the service
# FILE_TO_DEPLOY war/ear/jar to update
# STOP_SCRIPT script to stop
# START_SCRIPT script to start
# 
# For additional information, refer to "Managing Server Startup and Shutdown for Oracle WebLogic Server"
#  (http://download.oracle.com/docs/cd/E17904_01/web.1111/e13708/overview.htm).
# 
# 


# Parametros de entrada
WEBLOGIC_SERVER="sicecat-apps"
WEBLOGIC_USER="soporte"
WEBLOGIC_HOME="/home/soporte/Oracle/Middleware/user_projects/domains"
DOMAIN="base_domain"
DIR_FILE_TO_DEPLOY="target"
FILE_TO_DEPLOY="Visor.war"
WEBLOGIC_JAR="/home/soporte/Oracle/Middleware/wlserver_10.3/server/lib/weblogic.jar"
ADM_USER="weblogic"
ADM_PASSW="weblogic1234"
NAME_TO_DEPLOY="Visor"
#SERVICE_NAME="java"
#STOP_SCRIPT="bin/stopWebLogic.sh"
#START_SCRIPT="startWebLogic.sh"

#   1. Stop the app
echo "-------------------------------------------> Stopping ${NAME_TO_DEPLOY} on ${WEBLOGIC_USER}@${WEBLOGIC_SERVER}"
rsh ${WEBLOGIC_USER}@${WEBLOGIC_SERVER} java -cp ${WEBLOGIC_JAR} weblogic.Deployer -username ${ADM_USER} -password ${ADM_PASSW} -stop -name ${NAME_TO_DEPLOY}
echo "-------------------------------------------> ${NAME_TO_DEPLOY} stopped"

#   2. Undeploy
echo "-------------------------------------------> Undeploy ${NAME_TO_DEPLOY} on ${WEBLOGIC_USER}@${WEBLOGIC_SERVER}"
rsh ${WEBLOGIC_USER}@${WEBLOGIC_SERVER} java -cp ${WEBLOGIC_JAR} weblogic.Deployer -username ${ADM_USER} -password ${ADM_PASSW} -name ${NAME_TO_DEPLOY} -undeploy
echo "-------------------------------------------> ${NAME_TO_DEPLOY} undeployed"

#   3. Copy file to deploy
echo "------------------------------------------->Copping ${DIR_FILE_TO_DEPLOY}/${FILE_TO_DEPLOY} to ${WEBLOGIC_USER}@${WEBLOGIC_SERVER}:${WEBLOGIC_HOME}/${DOMAIN}"
scp  ${DIR_FILE_TO_DEPLOY}/${FILE_TO_DEPLOY} ${WEBLOGIC_USER}@${WEBLOGIC_SERVER}:${WEBLOGIC_HOME}/${DOMAIN}

#   4. Deploy
echo "-------------------------------------------> Deploying ${NAME_TO_DEPLOY} on ${WEBLOGIC_USER}@${WEBLOGIC_SERVER}"
rsh ${WEBLOGIC_USER}@${WEBLOGIC_SERVER} java -cp ${WEBLOGIC_JAR} weblogic.Deployer -username ${ADM_USER} -password ${ADM_PASSW} -deploy -name ${NAME_TO_DEPLOY} -source ${WEBLOGIC_HOME}/${DOMAIN}/${FILE_TO_DEPLOY}
echo "-------------------------------------------> ${NAME_TO_DEPLOY} deployed"
