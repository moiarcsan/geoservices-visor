--------------------------------------------------------
-- Archivo creado  - miércoles-diciembre-19-2012   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Table GIS_AUTHORITY
--------------------------------------------------------

  CREATE TABLE "GIS_AUTHORITY" 
   (	"ID" NUMBER(19,0), 
	"CREATEDATE" TIMESTAMP (6), 
	"NAME" VARCHAR2(255 CHAR), 
	"UPDATEDATE" TIMESTAMP (6), 
	"AUTH_TYPE_ID" NUMBER(19,0), 
	"AUTH_PARENT_ID" NUMBER(19,0), 
	"ZONE_ID" NUMBER(19,0)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_AUTHORITY_GIS_LAYER
--------------------------------------------------------

  CREATE TABLE "GIS_AUTHORITY_GIS_LAYER" 
   (	"GIS_AUTHORITY_ID" NUMBER(19,0), 
	"LAYERLIST_ID" NUMBER(19,0)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_AUTHORITY_TYPE
--------------------------------------------------------

  CREATE TABLE "GIS_AUTHORITY_TYPE" 
   (	"ID" NUMBER(19,0), 
	"CREATEDATE" TIMESTAMP (6), 
	"NAME_AUTH_TYPE" VARCHAR2(255 CHAR), 
	"UPDATEDATE" TIMESTAMP (6)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_FOLDER
--------------------------------------------------------

  CREATE TABLE "GIS_FOLDER" 
   (	"ID" NUMBER(19,0), 
	"CREATE_DATE" TIMESTAMP (6), 
	"ENABLED" NUMBER(1,0), 
	"FOLDERORDER" NUMBER(10,0), 
	"IS_CHANNEL" NUMBER(1,0), 
	"IS_PLAIN" NUMBER(1,0), 
	"NAME" VARCHAR2(255 CHAR), 
	"UPDATE_DATE" TIMESTAMP (6), 
	"FOLDER_AUTH_ID" NUMBER(19,0), 
	"FOLDER_PARENT_ID" NUMBER(19,0), 
	"FOLDER_USER_ID" NUMBER(19,0), 
	"FOLDER_ZONE_ID" NUMBER(19,0)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_FOLDER_IN_ZONE
--------------------------------------------------------

  CREATE TABLE "GIS_FOLDER_IN_ZONE" 
   (	"FOLDER_ID" NUMBER(19,0), 
	"ZONE_ID" NUMBER(19,0)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_LAYER
--------------------------------------------------------

  CREATE TABLE "GIS_LAYER" 
   (	"ID" NUMBER(19,0), 
	"CREAT_DATE" TIMESTAMP (6), 
	"DATA" BLOB, 
	"ENABLED" NUMBER(1,0), 
	"IS_CHANNEL" NUMBER(1,0), 
	"NAME_LAYER" VARCHAR2(255 CHAR), 
	"ORDER_LAYER" VARCHAR2(255 CHAR), 
	"PUBLICIZED" NUMBER(1,0), 
	"SERVER_RESOURCE" VARCHAR2(255 CHAR), 
	"UPDATE_DATE" TIMESTAMP (6), 
	"LAYER_AUTH_ID" NUMBER(19,0), 
	"LAYER_FOLDER_ID" NUMBER(19,0), 
	"LAYER_LAYER_TYPE_ID" NUMBER(19,0), 
	"LAYER_USER_ID" NUMBER(19,0)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_LAYER_GIS_LAYER_PROPERTY
--------------------------------------------------------

  CREATE TABLE "GIS_LAYER_GIS_LAYER_PROPERTY" 
   (	"GIS_LAYER_ID" NUMBER(19,0), 
	"PROPERTIES_ID" NUMBER(19,0)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_LAYER_GIS_STYLE
--------------------------------------------------------

  CREATE TABLE "GIS_LAYER_GIS_STYLE" 
   (	"GIS_LAYER_ID" NUMBER(19,0), 
	"STYLELIST_ID" NUMBER(19,0)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_LAYER_PROPERTY
--------------------------------------------------------

  CREATE TABLE "GIS_LAYER_PROPERTY" 
   (	"ID" NUMBER(19,0), 
	"NAME" VARCHAR2(255 CHAR), 
	"VALUE" VARCHAR2(255 CHAR)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_LAYER_TYPE
--------------------------------------------------------

  CREATE TABLE "GIS_LAYER_TYPE" 
   (	"ID" NUMBER(19,0), 
	"NAME" VARCHAR2(255 CHAR)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_LAYER_TYPE_PROPERTY
--------------------------------------------------------

  CREATE TABLE "GIS_LAYER_TYPE_PROPERTY" 
   (	"ID" NUMBER(19,0), 
	"NAME" VARCHAR2(255 CHAR)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_MAP_CONF
--------------------------------------------------------

  CREATE TABLE "GIS_MAP_CONF" 
   (	"ID" NUMBER(19,0), 
	"PDFSERVER" VARCHAR2(255 CHAR), 
	"BBOX" VARCHAR2(255 CHAR), 
	"DEFAULTIDIOMA" VARCHAR2(255 CHAR), 
	"DEFAULTUSERLOGO" VARCHAR2(255 CHAR), 
	"DEFAULTWMSSERVER" VARCHAR2(255 CHAR), 
	"DISPLAYPROJECTION" VARCHAR2(255 CHAR), 
	"DOWNLOADSERVLETURL" VARCHAR2(255 CHAR), 
	"INITIALBBOX" VARCHAR2(255 CHAR), 
	"MAXRESOLUTION" VARCHAR2(255 CHAR), 
	"MAXSCALE" VARCHAR2(255 CHAR), 
	"MINRESOLUTION" VARCHAR2(255 CHAR), 
	"MINSCALE" VARCHAR2(255 CHAR), 
	"NUMZOOMLEVELS" VARCHAR2(255 CHAR), 
	"OPENLAYERSPROXYHOST" VARCHAR2(255 CHAR), 
	"PROJECTION" VARCHAR2(255 CHAR), 
	"RESOLUTIONS" VARCHAR2(255 CHAR), 
	"UPLOADSERVLETURL" VARCHAR2(255 CHAR), 
	"VERSION" VARCHAR2(255 CHAR)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_PERMISSION
--------------------------------------------------------

  CREATE TABLE "GIS_PERMISSION" 
   (	"ID" NUMBER(19,0), 
	"CREATE_DATE" TIMESTAMP (6), 
	"NAME_PERMISSION" VARCHAR2(255 CHAR), 
	"UPDATE_DATE" TIMESTAMP (6)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_PERMISSION_BY_AUTHTYPE
--------------------------------------------------------

  CREATE TABLE "GIS_PERMISSION_BY_AUTHTYPE" 
   (	"AUTH_TYPE_ID" NUMBER(19,0), 
	"PERMISSION_ID" NUMBER(19,0)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_PROPERTY_IN_LAYER_TYPE
--------------------------------------------------------

  CREATE TABLE "GIS_PROPERTY_IN_LAYER_TYPE" 
   (	"GIS_LAYER_TYPE_ID" NUMBER(19,0), 
	"DEFAULTPROPERTIES_ID" NUMBER(19,0)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_RULE
--------------------------------------------------------

  CREATE TABLE "GIS_RULE" 
   (	"ID" NUMBER(19,0), 
	"CREATE_DATE" TIMESTAMP (6), 
	"FILTER" VARCHAR2(255 CHAR), 
	"SYMBOLIZER" VARCHAR2(255 CHAR), 
	"UPDATE_DATE" TIMESTAMP (6)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_RULE_GIS_RULE_PROPERTY
--------------------------------------------------------

  CREATE TABLE "GIS_RULE_GIS_RULE_PROPERTY" 
   (	"GIS_RULE_ID" NUMBER(19,0), 
	"PROPERTIES_ID" NUMBER(19,0)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_RULE_PROPERTY
--------------------------------------------------------

  CREATE TABLE "GIS_RULE_PROPERTY" 
   (	"ID" NUMBER(19,0), 
	"NAME" VARCHAR2(255 CHAR), 
	"VALUE" VARCHAR2(255 CHAR)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_STYLE
--------------------------------------------------------

  CREATE TABLE "GIS_STYLE" 
   (	"ID" NUMBER(19,0), 
	"CREATE_DATE" TIMESTAMP (6), 
	"NAME_STYLE" VARCHAR2(255 CHAR), 
	"UPDATE_DATE" TIMESTAMP (6)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_STYLE_GIS_LAYER
--------------------------------------------------------

  CREATE TABLE "GIS_STYLE_GIS_LAYER" 
   (	"GIS_STYLE_ID" NUMBER(19,0), 
	"LAYERLIST_ID" NUMBER(19,0)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_STYLE_GIS_RULE
--------------------------------------------------------

  CREATE TABLE "GIS_STYLE_GIS_RULE" 
   (	"GIS_STYLE_ID" NUMBER(19,0), 
	"RULELIST_ID" NUMBER(19,0)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_USER
--------------------------------------------------------

  CREATE TABLE "GIS_USER" 
   (	"ID" NUMBER(19,0), 
	"ADMIN_USER" NUMBER(1,0), 
	"APELLIDOS" VARCHAR2(255 CHAR), 
	"CREATE_DATE" TIMESTAMP (6), 
	"EMAIL" VARCHAR2(255 CHAR), 
	"NOMBRECOMPLETO" VARCHAR2(255 CHAR), 
	"PASSWORD" VARCHAR2(255 CHAR), 
	"TELEFONO" VARCHAR2(255 CHAR), 
	"UPDATE_DATE" TIMESTAMP (6), 
	"USERNAME" VARCHAR2(255 CHAR), 
	"VALID_USER" NUMBER(1,0), 
	"USER_AUTHORITY_ID" NUMBER(19,0)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_ZONE
--------------------------------------------------------

  CREATE TABLE "GIS_ZONE" 
   (	"ID" NUMBER(19,0), 
	"CODE" VARCHAR2(255 CHAR), 
	"CREATE_DATE" TIMESTAMP (6), 
	"ENABLED" NUMBER(1,0), 
	"EXTENSION" VARCHAR2(255 CHAR), 
	"NAME" VARCHAR2(255 CHAR), 
	"TYPE" VARCHAR2(255 CHAR), 
	"UPDATE_DATE" TIMESTAMP (6)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Table GIS_ZONE_IN_ZONE
--------------------------------------------------------

  CREATE TABLE "GIS_ZONE_IN_ZONE" 
   (	"ZONE_ID" NUMBER(19,0), 
	"SUBZONE_ID" NUMBER(19,0)
   ) 
TABLESPACE SICECAT2DAT
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

--------------------------------------------------------
--  DDL for Index SYS_C0011099
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011099" ON "GIS_AUTHORITY" ("ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011102
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011102" ON "GIS_AUTHORITY_GIS_LAYER" ("LAYERLIST_ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011104
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011104" ON "GIS_AUTHORITY_TYPE" ("ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011106
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011106" ON "GIS_FOLDER" ("ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011108
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011108" ON "GIS_LAYER" ("ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011111
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011111" ON "GIS_LAYER_GIS_LAYER_PROPERTY" ("PROPERTIES_ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011114
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011114" ON "GIS_LAYER_GIS_STYLE" ("STYLELIST_ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011116
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011116" ON "GIS_LAYER_PROPERTY" ("ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011118
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011118" ON "GIS_LAYER_TYPE" ("ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011120
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011120" ON "GIS_LAYER_TYPE_PROPERTY" ("ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011122
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011122" ON "GIS_MAP_CONF" ("ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011124
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011124" ON "GIS_PERMISSION" ("ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011130
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011130" ON "GIS_RULE" ("ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011133
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011133" ON "GIS_RULE_GIS_RULE_PROPERTY" ("PROPERTIES_ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011135
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011135" ON "GIS_RULE_PROPERTY" ("ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011137
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011137" ON "GIS_STYLE" ("ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C006090
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C006090" ON "GIS_STYLE_GIS_LAYER" ("LAYERLIST_ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011140
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011140" ON "GIS_STYLE_GIS_RULE" ("RULELIST_ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011144
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011144" ON "GIS_USER" ("ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011146
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011146" ON "GIS_ZONE" ("ID") 
  ;

--------------------------------------------------------
--  DDL for Index SYS_C0011149
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYS_C0011149" ON "GIS_ZONE_IN_ZONE" ("SUBZONE_ID") 
  ;

--------------------------------------------------------
--  Constraints for Table GIS_AUTHORITY
--------------------------------------------------------

  ALTER TABLE "GIS_AUTHORITY" MODIFY ("ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_AUTHORITY" MODIFY ("NAME" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_AUTHORITY" ADD PRIMARY KEY ("ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_AUTHORITY_GIS_LAYER
--------------------------------------------------------

  ALTER TABLE "GIS_AUTHORITY_GIS_LAYER" MODIFY ("GIS_AUTHORITY_ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_AUTHORITY_GIS_LAYER" MODIFY ("LAYERLIST_ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_AUTHORITY_GIS_LAYER" ADD UNIQUE ("LAYERLIST_ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_AUTHORITY_TYPE
--------------------------------------------------------

  ALTER TABLE "GIS_AUTHORITY_TYPE" MODIFY ("ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_AUTHORITY_TYPE" ADD PRIMARY KEY ("ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_FOLDER
--------------------------------------------------------

  ALTER TABLE "GIS_FOLDER" MODIFY ("ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_FOLDER" ADD PRIMARY KEY ("ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_FOLDER_IN_ZONE
--------------------------------------------------------

  ALTER TABLE "GIS_FOLDER_IN_ZONE" MODIFY ("FOLDER_ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_FOLDER_IN_ZONE" MODIFY ("ZONE_ID" NOT NULL ENABLE);

--------------------------------------------------------
--  Constraints for Table GIS_LAYER
--------------------------------------------------------

  ALTER TABLE "GIS_LAYER" MODIFY ("ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_LAYER" ADD PRIMARY KEY ("ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_LAYER_GIS_LAYER_PROPERTY
--------------------------------------------------------

  ALTER TABLE "GIS_LAYER_GIS_LAYER_PROPERTY" MODIFY ("GIS_LAYER_ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_LAYER_GIS_LAYER_PROPERTY" MODIFY ("PROPERTIES_ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_LAYER_GIS_LAYER_PROPERTY" ADD UNIQUE ("PROPERTIES_ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_LAYER_GIS_STYLE
--------------------------------------------------------

  ALTER TABLE "GIS_LAYER_GIS_STYLE" MODIFY ("GIS_LAYER_ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_LAYER_GIS_STYLE" MODIFY ("STYLELIST_ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_LAYER_GIS_STYLE" ADD UNIQUE ("STYLELIST_ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_LAYER_PROPERTY
--------------------------------------------------------

  ALTER TABLE "GIS_LAYER_PROPERTY" MODIFY ("ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_LAYER_PROPERTY" ADD PRIMARY KEY ("ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_LAYER_TYPE
--------------------------------------------------------

  ALTER TABLE "GIS_LAYER_TYPE" MODIFY ("ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_LAYER_TYPE" ADD PRIMARY KEY ("ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_LAYER_TYPE_PROPERTY
--------------------------------------------------------

  ALTER TABLE "GIS_LAYER_TYPE_PROPERTY" MODIFY ("ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_LAYER_TYPE_PROPERTY" ADD PRIMARY KEY ("ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_MAP_CONF
--------------------------------------------------------

  ALTER TABLE "GIS_MAP_CONF" MODIFY ("ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_MAP_CONF" ADD PRIMARY KEY ("ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_PERMISSION
--------------------------------------------------------

  ALTER TABLE "GIS_PERMISSION" MODIFY ("ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_PERMISSION" ADD PRIMARY KEY ("ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_PERMISSION_BY_AUTHTYPE
--------------------------------------------------------

  ALTER TABLE "GIS_PERMISSION_BY_AUTHTYPE" MODIFY ("AUTH_TYPE_ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_PERMISSION_BY_AUTHTYPE" MODIFY ("PERMISSION_ID" NOT NULL ENABLE);

--------------------------------------------------------
--  Constraints for Table GIS_PROPERTY_IN_LAYER_TYPE
--------------------------------------------------------

  ALTER TABLE "GIS_PROPERTY_IN_LAYER_TYPE" MODIFY ("GIS_LAYER_TYPE_ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_PROPERTY_IN_LAYER_TYPE" MODIFY ("DEFAULTPROPERTIES_ID" NOT NULL ENABLE);

--------------------------------------------------------
--  Constraints for Table GIS_RULE
--------------------------------------------------------

  ALTER TABLE "GIS_RULE" MODIFY ("ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_RULE" ADD PRIMARY KEY ("ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_RULE_GIS_RULE_PROPERTY
--------------------------------------------------------

  ALTER TABLE "GIS_RULE_GIS_RULE_PROPERTY" MODIFY ("GIS_RULE_ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_RULE_GIS_RULE_PROPERTY" MODIFY ("PROPERTIES_ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_RULE_GIS_RULE_PROPERTY" ADD UNIQUE ("PROPERTIES_ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_RULE_PROPERTY
--------------------------------------------------------

  ALTER TABLE "GIS_RULE_PROPERTY" MODIFY ("ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_RULE_PROPERTY" ADD PRIMARY KEY ("ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_STYLE
--------------------------------------------------------

  ALTER TABLE "GIS_STYLE" MODIFY ("ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_STYLE" ADD PRIMARY KEY ("ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_STYLE_GIS_LAYER
--------------------------------------------------------

  ALTER TABLE "GIS_STYLE_GIS_LAYER" MODIFY ("GIS_STYLE_ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_STYLE_GIS_LAYER" MODIFY ("LAYERLIST_ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_STYLE_GIS_LAYER" ADD UNIQUE ("LAYERLIST_ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_STYLE_GIS_RULE
--------------------------------------------------------

  ALTER TABLE "GIS_STYLE_GIS_RULE" MODIFY ("GIS_STYLE_ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_STYLE_GIS_RULE" MODIFY ("RULELIST_ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_STYLE_GIS_RULE" ADD UNIQUE ("RULELIST_ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_USER
--------------------------------------------------------

  ALTER TABLE "GIS_USER" MODIFY ("ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_USER" MODIFY ("PASSWORD" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_USER" MODIFY ("USERNAME" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_USER" ADD PRIMARY KEY ("ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_ZONE
--------------------------------------------------------

  ALTER TABLE "GIS_ZONE" MODIFY ("ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_ZONE" ADD PRIMARY KEY ("ID") ENABLE;

--------------------------------------------------------
--  Constraints for Table GIS_ZONE_IN_ZONE
--------------------------------------------------------

  ALTER TABLE "GIS_ZONE_IN_ZONE" MODIFY ("ZONE_ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_ZONE_IN_ZONE" MODIFY ("SUBZONE_ID" NOT NULL ENABLE);
 
  ALTER TABLE "GIS_ZONE_IN_ZONE" ADD UNIQUE ("SUBZONE_ID") ENABLE;

--------------------------------------------------------
--  Ref Constraints for Table GIS_AUTHORITY
--------------------------------------------------------

  ALTER TABLE "GIS_AUTHORITY" ADD CONSTRAINT "FK85C0552AE81CE9" FOREIGN KEY ("AUTH_TYPE_ID")
	  REFERENCES "GIS_AUTHORITY_TYPE" ("ID") ENABLE;
 
  ALTER TABLE "GIS_AUTHORITY" ADD CONSTRAINT "FK85C0552E793C5D" FOREIGN KEY ("ZONE_ID")
	  REFERENCES "GIS_ZONE" ("ID") ENABLE;
 
  ALTER TABLE "GIS_AUTHORITY" ADD CONSTRAINT "FK85C0554EF188DF" FOREIGN KEY ("AUTH_PARENT_ID")
	  REFERENCES "GIS_AUTHORITY" ("ID") ENABLE;

--------------------------------------------------------
--  Ref Constraints for Table GIS_AUTHORITY_GIS_LAYER
--------------------------------------------------------

  ALTER TABLE "GIS_AUTHORITY_GIS_LAYER" ADD CONSTRAINT "FK2A12FBF93F253F5F" FOREIGN KEY ("LAYERLIST_ID")
	  REFERENCES "GIS_LAYER" ("ID") ENABLE;
 
  ALTER TABLE "GIS_AUTHORITY_GIS_LAYER" ADD CONSTRAINT "FK2A12FBF968C1472B" FOREIGN KEY ("GIS_AUTHORITY_ID")
	  REFERENCES "GIS_AUTHORITY" ("ID") ENABLE;

--------------------------------------------------------
--  Ref Constraints for Table GIS_FOLDER
--------------------------------------------------------

  ALTER TABLE "GIS_FOLDER" ADD CONSTRAINT "FK19924C9C3AE63A27" FOREIGN KEY ("FOLDER_AUTH_ID")
	  REFERENCES "GIS_AUTHORITY" ("ID") ENABLE;
 
  ALTER TABLE "GIS_FOLDER" ADD CONSTRAINT "FK19924C9C82D8CB50" FOREIGN KEY ("FOLDER_PARENT_ID")
	  REFERENCES "GIS_FOLDER" ("ID") ENABLE;
 
  ALTER TABLE "GIS_FOLDER" ADD CONSTRAINT "FK19924C9C8635F5EC" FOREIGN KEY ("FOLDER_USER_ID")
	  REFERENCES "GIS_USER" ("ID") ENABLE;
 
  ALTER TABLE "GIS_FOLDER" ADD CONSTRAINT "FK19924C9CF3F1B18C" FOREIGN KEY ("FOLDER_ZONE_ID")
	  REFERENCES "GIS_ZONE" ("ID") ENABLE;

--------------------------------------------------------
--  Ref Constraints for Table GIS_LAYER
--------------------------------------------------------

  ALTER TABLE "GIS_LAYER" ADD CONSTRAINT "FKAE8CE763156A2A2F" FOREIGN KEY ("LAYER_FOLDER_ID")
	  REFERENCES "GIS_FOLDER" ("ID") ENABLE;
 
  ALTER TABLE "GIS_LAYER" ADD CONSTRAINT "FKAE8CE763531F600A" FOREIGN KEY ("LAYER_AUTH_ID")
	  REFERENCES "GIS_AUTHORITY" ("ID") ENABLE;
 
  ALTER TABLE "GIS_LAYER" ADD CONSTRAINT "FKAE8CE7639E6F1BCF" FOREIGN KEY ("LAYER_USER_ID")
	  REFERENCES "GIS_USER" ("ID") ENABLE;
 
  ALTER TABLE "GIS_LAYER" ADD CONSTRAINT "FKAE8CE763E33D65B2" FOREIGN KEY ("LAYER_LAYER_TYPE_ID")
	  REFERENCES "GIS_LAYER_TYPE" ("ID") ENABLE;

--------------------------------------------------------
--  Ref Constraints for Table GIS_LAYER_GIS_LAYER_PROPERTY
--------------------------------------------------------

  ALTER TABLE "GIS_LAYER_GIS_LAYER_PROPERTY" ADD CONSTRAINT "FK32D4AD8DF1DB18EB" FOREIGN KEY ("GIS_LAYER_ID")
	  REFERENCES "GIS_LAYER" ("ID") ENABLE;
 
  ALTER TABLE "GIS_LAYER_GIS_LAYER_PROPERTY" ADD CONSTRAINT "FK32D4AD8DF9CD1650" FOREIGN KEY ("PROPERTIES_ID")
	  REFERENCES "GIS_LAYER_PROPERTY" ("ID") ENABLE;

--------------------------------------------------------
--  Ref Constraints for Table GIS_LAYER_GIS_STYLE
--------------------------------------------------------

  ALTER TABLE "GIS_LAYER_GIS_STYLE" ADD CONSTRAINT "FK378271E7A4954B5F" FOREIGN KEY ("STYLELIST_ID")
	  REFERENCES "GIS_STYLE" ("ID") ENABLE;
 
  ALTER TABLE "GIS_LAYER_GIS_STYLE" ADD CONSTRAINT "FK378271E7F1DB18EB" FOREIGN KEY ("GIS_LAYER_ID")
	  REFERENCES "GIS_LAYER" ("ID") ENABLE;

--------------------------------------------------------
--  Ref Constraints for Table GIS_PERMISSION_BY_AUTHTYPE
--------------------------------------------------------

  ALTER TABLE "GIS_PERMISSION_BY_AUTHTYPE" ADD CONSTRAINT "FK60E6DDA82AE81CE9" FOREIGN KEY ("AUTH_TYPE_ID")
	  REFERENCES "GIS_AUTHORITY_TYPE" ("ID") ENABLE;
 
  ALTER TABLE "GIS_PERMISSION_BY_AUTHTYPE" ADD CONSTRAINT "FK60E6DDA8C2ADA73D" FOREIGN KEY ("PERMISSION_ID")
	  REFERENCES "GIS_PERMISSION" ("ID") ENABLE;

--------------------------------------------------------
--  Ref Constraints for Table GIS_PROPERTY_IN_LAYER_TYPE
--------------------------------------------------------

  ALTER TABLE "GIS_PROPERTY_IN_LAYER_TYPE" ADD CONSTRAINT "FKED179806AC9AF09" FOREIGN KEY ("DEFAULTPROPERTIES_ID")
	  REFERENCES "GIS_LAYER_TYPE_PROPERTY" ("ID") ENABLE;
 
  ALTER TABLE "GIS_PROPERTY_IN_LAYER_TYPE" ADD CONSTRAINT "FKED179806D846C032" FOREIGN KEY ("GIS_LAYER_TYPE_ID")
	  REFERENCES "GIS_LAYER_TYPE" ("ID") ENABLE;

--------------------------------------------------------
--  Ref Constraints for Table GIS_RULE_GIS_RULE_PROPERTY
--------------------------------------------------------

  ALTER TABLE "GIS_RULE_GIS_RULE_PROPERTY" ADD CONSTRAINT "FK9AEC175171BA2FB" FOREIGN KEY ("PROPERTIES_ID")
	  REFERENCES "GIS_RULE_PROPERTY" ("ID") ENABLE;
 
  ALTER TABLE "GIS_RULE_GIS_RULE_PROPERTY" ADD CONSTRAINT "FK9AEC175DA65D3EF" FOREIGN KEY ("GIS_RULE_ID")
	  REFERENCES "GIS_RULE" ("ID") ENABLE;

--------------------------------------------------------
--  Ref Constraints for Table GIS_STYLE_GIS_RULE
--------------------------------------------------------

  ALTER TABLE "GIS_STYLE_GIS_RULE" ADD CONSTRAINT "FK84D807A611A1F4EB" FOREIGN KEY ("GIS_STYLE_ID")
	  REFERENCES "GIS_STYLE" ("ID") ENABLE;
 
  ALTER TABLE "GIS_STYLE_GIS_RULE" ADD CONSTRAINT "FK84D807A6C39CBEFF" FOREIGN KEY ("RULELIST_ID")
	  REFERENCES "GIS_RULE" ("ID") ENABLE;

--------------------------------------------------------
--  Ref Constraints for Table GIS_USER
--------------------------------------------------------

  ALTER TABLE "GIS_USER" ADD CONSTRAINT "FK47B64F798FEEB171" FOREIGN KEY ("USER_AUTHORITY_ID")
	  REFERENCES "GIS_AUTHORITY" ("ID") ENABLE;

--------------------------------------------------------
--  Ref Constraints for Table GIS_ZONE_IN_ZONE
--------------------------------------------------------

  ALTER TABLE "GIS_ZONE_IN_ZONE" ADD CONSTRAINT "FK467772A12E793C5D" FOREIGN KEY ("ZONE_ID")
	  REFERENCES "GIS_ZONE" ("ID") ENABLE;
 
  ALTER TABLE "GIS_ZONE_IN_ZONE" ADD CONSTRAINT "FK467772A172F0F61D" FOREIGN KEY ("SUBZONE_ID")
	  REFERENCES "GIS_ZONE" ("ID") ENABLE;

