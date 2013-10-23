#! /bin/bash
# SCRIPT PARA GENERACIÓN DE DOCUMENTACIÓN CON NATURAL DOCS
#
# *************************************************************************
# This script is used to run NaturalDocs.
# 
# It's need to initialize the following variables:
# 
# NATURAL_DOCS_HOME
# NATURAL_DOCS_IN
# NATURAL_DOCS_OUT
# NATURAL_DOCS_PROJ
# 
# For additional information, refer to "Running Natural Docs"
#  (http://www.naturaldocs.org/running.html).
# 
# 


# Parametros de entrada
NATURAL_DOCS_HOME="/var/jenkins/NaturalDocs"
#NATURAL_DOCS_HOME="/home/adiaz/apps/NaturalDocs"
NATURAL_DOCS_IN="src/main/javascript"
NATURAL_DOCS_OUT="target/docs"
NATURAL_DOCS_PROJ="target/doc"

mkdir ${NATURAL_DOCS_OUT}
mkdir ${NATURAL_DOCS_PROJ}
echo "Generating doc from ${NATURAL_DOCS_IN}"
${NATURAL_DOCS_HOME}/NaturalDocs -i ${NATURAL_DOCS_IN} -o FramedHTML ${NATURAL_DOCS_OUT} -p ${NATURAL_DOCS_PROJ}
echo "OK!"

