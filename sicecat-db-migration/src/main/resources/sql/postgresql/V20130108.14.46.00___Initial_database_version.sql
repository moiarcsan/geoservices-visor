--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: persistence_geo; Type: SCHEMA; Schema: -; Owner: persistence_geo
--

--CREATE SCHEMA persistence_geo;


ALTER SCHEMA persistence_geo OWNER TO persistence_geo;


SET search_path = persistence_geo, pg_catalog;

--
-- Name: folder_seq; Type: SEQUENCE; Schema: persistence_geo; Owner: persistence_geo
--

CREATE SEQUENCE folder_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persistence_geo.folder_seq OWNER TO persistence_geo;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: gis_authority; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_authority (
    id bigint NOT NULL,
    createdate timestamp without time zone,
    name character varying(255) NOT NULL,
    updatedate timestamp without time zone,
    workspace_name character varying(255),
    auth_type_id bigint,
    auth_parent_id bigint,
    zone_id bigint
);


ALTER TABLE persistence_geo.gis_authority OWNER TO persistence_geo;

--
-- Name: gis_authority_gis_layer; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_authority_gis_layer (
    gis_authority_id bigint NOT NULL,
    layerlist_id bigint NOT NULL
);


ALTER TABLE persistence_geo.gis_authority_gis_layer OWNER TO persistence_geo;

--
-- Name: gis_authority_seq; Type: SEQUENCE; Schema: persistence_geo; Owner: persistence_geo
--

CREATE SEQUENCE gis_authority_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persistence_geo.gis_authority_seq OWNER TO persistence_geo;

--
-- Name: gis_authority_type; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_authority_type (
    id bigint NOT NULL,
    createdate timestamp without time zone,
    name_auth_type character varying(255),
    updatedate timestamp without time zone
);


ALTER TABLE persistence_geo.gis_authority_type OWNER TO persistence_geo;

--
-- Name: gis_authority_type_seq; Type: SEQUENCE; Schema: persistence_geo; Owner: persistence_geo
--

CREATE SEQUENCE gis_authority_type_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persistence_geo.gis_authority_type_seq OWNER TO persistence_geo;

--
-- Name: gis_folder; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_folder (
    id bigint NOT NULL,
    create_date timestamp without time zone,
    enabled boolean,
    folderorder integer,
    is_channel boolean,
    is_plain boolean,
    name character varying(255),
    update_date timestamp without time zone,
    folder_auth_id bigint,
    folder_parent_id bigint,
    folder_user_id bigint,
    folder_zone_id bigint
);


ALTER TABLE persistence_geo.gis_folder OWNER TO persistence_geo;

--
-- Name: gis_folder_seq; Type: SEQUENCE; Schema: persistence_geo; Owner: persistence_geo
--

CREATE SEQUENCE gis_folder_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persistence_geo.gis_folder_seq OWNER TO persistence_geo;

--
-- Name: gis_layer; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_layer (
    id bigint NOT NULL,
    creat_date timestamp without time zone,
    data oid,
    enabled boolean,
    is_channel boolean,
    name_layer character varying(255),
    order_layer character varying(255),
    publicized boolean,
    server_resource character varying(255),
    update_date timestamp without time zone,
    layer_auth_id bigint,
    layer_folder_id bigint,
    layer_layer_type_id bigint,
    layer_user_id bigint
);


ALTER TABLE persistence_geo.gis_layer OWNER TO persistence_geo;

--
-- Name: gis_layer_gis_layer_property; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_layer_gis_layer_property (
    gis_layer_id bigint NOT NULL,
    properties_id bigint NOT NULL
);


ALTER TABLE persistence_geo.gis_layer_gis_layer_property OWNER TO persistence_geo;

--
-- Name: gis_layer_gis_style; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_layer_gis_style (
    gis_layer_id bigint NOT NULL,
    stylelist_id bigint NOT NULL
);


ALTER TABLE persistence_geo.gis_layer_gis_style OWNER TO persistence_geo;

--
-- Name: gis_layer_property; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_layer_property (
    id bigint NOT NULL,
    name character varying(255),
    value character varying(255)
);


ALTER TABLE persistence_geo.gis_layer_property OWNER TO persistence_geo;

--
-- Name: gis_layer_property_seq; Type: SEQUENCE; Schema: persistence_geo; Owner: persistence_geo
--

CREATE SEQUENCE gis_layer_property_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persistence_geo.gis_layer_property_seq OWNER TO persistence_geo;

--
-- Name: gis_layer_seq; Type: SEQUENCE; Schema: persistence_geo; Owner: persistence_geo
--

CREATE SEQUENCE gis_layer_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persistence_geo.gis_layer_seq OWNER TO persistence_geo;

--
-- Name: gis_layer_type; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_layer_type (
    id bigint NOT NULL,
    name character varying(255)
);


ALTER TABLE persistence_geo.gis_layer_type OWNER TO persistence_geo;

--
-- Name: gis_layer_type_property; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_layer_type_property (
    id bigint NOT NULL,
    name character varying(255)
);


ALTER TABLE persistence_geo.gis_layer_type_property OWNER TO persistence_geo;

--
-- Name: gis_layer_type_property_seq; Type: SEQUENCE; Schema: persistence_geo; Owner: persistence_geo
--

CREATE SEQUENCE gis_layer_type_property_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persistence_geo.gis_layer_type_property_seq OWNER TO persistence_geo;

--
-- Name: gis_layer_type_seq; Type: SEQUENCE; Schema: persistence_geo; Owner: persistence_geo
--

CREATE SEQUENCE gis_layer_type_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persistence_geo.gis_layer_type_seq OWNER TO persistence_geo;

--
-- Name: gis_map_conf; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_map_conf (
    id bigint NOT NULL,
    pdfserver character varying(255),
    bbox character varying(255),
    defaultidioma character varying(255),
    defaultuserlogo character varying(255),
    defaultwmsserver character varying(255),
    displayprojection character varying(255),
    downloadservleturl character varying(255),
    initialbbox character varying(255),
    maxresolution character varying(255),
    maxscale character varying(255),
    minresolution character varying(255),
    minscale character varying(255),
    numzoomlevels character varying(255),
    openlayersproxyhost character varying(255),
    projection character varying(255),
    resolutions character varying(255),
    uploadservleturl character varying(255),
    version character varying(255)
);


ALTER TABLE persistence_geo.gis_map_conf OWNER TO persistence_geo;

--
-- Name: gis_map_conf_seq; Type: SEQUENCE; Schema: persistence_geo; Owner: persistence_geo
--

CREATE SEQUENCE gis_map_conf_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persistence_geo.gis_map_conf_seq OWNER TO persistence_geo;

--
-- Name: gis_permission; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_permission (
    id bigint NOT NULL,
    create_date timestamp without time zone,
    name_permission character varying(255),
    update_date timestamp without time zone
);


ALTER TABLE persistence_geo.gis_permission OWNER TO persistence_geo;

--
-- Name: gis_permission_by_authtype; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_permission_by_authtype (
    auth_type_id bigint NOT NULL,
    permission_id bigint NOT NULL
);


ALTER TABLE persistence_geo.gis_permission_by_authtype OWNER TO persistence_geo;

--
-- Name: gis_permission_seq; Type: SEQUENCE; Schema: persistence_geo; Owner: persistence_geo
--

CREATE SEQUENCE gis_permission_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persistence_geo.gis_permission_seq OWNER TO persistence_geo;

--
-- Name: gis_property_in_layer_type; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_property_in_layer_type (
    gis_layer_type_id bigint NOT NULL,
    defaultproperties_id bigint NOT NULL
);


ALTER TABLE persistence_geo.gis_property_in_layer_type OWNER TO persistence_geo;

--
-- Name: gis_rule; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_rule (
    id bigint NOT NULL,
    create_date timestamp without time zone,
    filter character varying(255),
    symbolizer character varying(255),
    update_date timestamp without time zone
);


ALTER TABLE persistence_geo.gis_rule OWNER TO persistence_geo;

--
-- Name: gis_rule_gis_rule_property; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_rule_gis_rule_property (
    gis_rule_id bigint NOT NULL,
    properties_id bigint NOT NULL
);


ALTER TABLE persistence_geo.gis_rule_gis_rule_property OWNER TO persistence_geo;

--
-- Name: gis_rule_property; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_rule_property (
    id bigint NOT NULL,
    name character varying(255),
    value character varying(255)
);


ALTER TABLE persistence_geo.gis_rule_property OWNER TO persistence_geo;

--
-- Name: gis_rule_property_seq; Type: SEQUENCE; Schema: persistence_geo; Owner: persistence_geo
--

CREATE SEQUENCE gis_rule_property_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persistence_geo.gis_rule_property_seq OWNER TO persistence_geo;

--
-- Name: gis_rule_seq; Type: SEQUENCE; Schema: persistence_geo; Owner: persistence_geo
--

CREATE SEQUENCE gis_rule_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persistence_geo.gis_rule_seq OWNER TO persistence_geo;

--
-- Name: gis_style; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_style (
    id bigint NOT NULL,
    create_date timestamp without time zone,
    name_style character varying(255),
    update_date timestamp without time zone
);


ALTER TABLE persistence_geo.gis_style OWNER TO persistence_geo;

--
-- Name: gis_style_gis_rule; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_style_gis_rule (
    gis_style_id bigint NOT NULL,
    rulelist_id bigint NOT NULL
);


ALTER TABLE persistence_geo.gis_style_gis_rule OWNER TO persistence_geo;

--
-- Name: gis_style_seq; Type: SEQUENCE; Schema: persistence_geo; Owner: persistence_geo
--

CREATE SEQUENCE gis_style_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persistence_geo.gis_style_seq OWNER TO persistence_geo;

--
-- Name: gis_user; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_user (
    id bigint NOT NULL,
    admin_user boolean,
    apellidos character varying(255),
    create_date timestamp without time zone,
    email character varying(255),
    nombrecompleto character varying(255),
    password character varying(255) NOT NULL,
    telefono character varying(255),
    update_date timestamp without time zone,
    username character varying(255) NOT NULL,
    valid_user boolean,
    user_authority_id bigint
);


ALTER TABLE persistence_geo.gis_user OWNER TO persistence_geo;

--
-- Name: gis_user_seq; Type: SEQUENCE; Schema: persistence_geo; Owner: persistence_geo
--

CREATE SEQUENCE gis_user_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persistence_geo.gis_user_seq OWNER TO persistence_geo;

--
-- Name: gis_zone; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_zone (
    id bigint NOT NULL,
    code character varying(255),
    create_date timestamp without time zone,
    enabled boolean,
    extension character varying(255),
    name character varying(255),
    type character varying(255),
    update_date timestamp without time zone
);


ALTER TABLE persistence_geo.gis_zone OWNER TO persistence_geo;

--
-- Name: gis_zone_in_zone; Type: TABLE; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

CREATE TABLE gis_zone_in_zone (
    zone_id bigint NOT NULL,
    subzone_id bigint NOT NULL
);


ALTER TABLE persistence_geo.gis_zone_in_zone OWNER TO persistence_geo;

--
-- Name: gis_zone_seq; Type: SEQUENCE; Schema: persistence_geo; Owner: persistence_geo
--

CREATE SEQUENCE gis_zone_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persistence_geo.gis_zone_seq OWNER TO persistence_geo;

--
-- Name: gis_authority_gis_layer_layerlist_id_key; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_authority_gis_layer
    ADD CONSTRAINT gis_authority_gis_layer_layerlist_id_key UNIQUE (layerlist_id);


--
-- Name: gis_authority_pkey; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_authority
    ADD CONSTRAINT gis_authority_pkey PRIMARY KEY (id);


--
-- Name: gis_authority_type_pkey; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_authority_type
    ADD CONSTRAINT gis_authority_type_pkey PRIMARY KEY (id);


--
-- Name: gis_folder_pkey; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_folder
    ADD CONSTRAINT gis_folder_pkey PRIMARY KEY (id);


--
-- Name: gis_layer_gis_layer_property_properties_id_key; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_layer_gis_layer_property
    ADD CONSTRAINT gis_layer_gis_layer_property_properties_id_key UNIQUE (properties_id);


--
-- Name: gis_layer_gis_style_stylelist_id_key; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_layer_gis_style
    ADD CONSTRAINT gis_layer_gis_style_stylelist_id_key UNIQUE (stylelist_id);


--
-- Name: gis_layer_pkey; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_layer
    ADD CONSTRAINT gis_layer_pkey PRIMARY KEY (id);


--
-- Name: gis_layer_property_pkey; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_layer_property
    ADD CONSTRAINT gis_layer_property_pkey PRIMARY KEY (id);


--
-- Name: gis_layer_type_pkey; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_layer_type
    ADD CONSTRAINT gis_layer_type_pkey PRIMARY KEY (id);


--
-- Name: gis_layer_type_property_pkey; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_layer_type_property
    ADD CONSTRAINT gis_layer_type_property_pkey PRIMARY KEY (id);


--
-- Name: gis_map_conf_pkey; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_map_conf
    ADD CONSTRAINT gis_map_conf_pkey PRIMARY KEY (id);


--
-- Name: gis_permission_pkey; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_permission
    ADD CONSTRAINT gis_permission_pkey PRIMARY KEY (id);


--
-- Name: gis_rule_gis_rule_property_properties_id_key; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_rule_gis_rule_property
    ADD CONSTRAINT gis_rule_gis_rule_property_properties_id_key UNIQUE (properties_id);


--
-- Name: gis_rule_pkey; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_rule
    ADD CONSTRAINT gis_rule_pkey PRIMARY KEY (id);


--
-- Name: gis_rule_property_pkey; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_rule_property
    ADD CONSTRAINT gis_rule_property_pkey PRIMARY KEY (id);


--
-- Name: gis_style_gis_rule_rulelist_id_key; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_style_gis_rule
    ADD CONSTRAINT gis_style_gis_rule_rulelist_id_key UNIQUE (rulelist_id);


--
-- Name: gis_style_pkey; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_style
    ADD CONSTRAINT gis_style_pkey PRIMARY KEY (id);


--
-- Name: gis_user_pkey; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_user
    ADD CONSTRAINT gis_user_pkey PRIMARY KEY (id);


--
-- Name: gis_zone_in_zone_subzone_id_key; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_zone_in_zone
    ADD CONSTRAINT gis_zone_in_zone_subzone_id_key UNIQUE (subzone_id);


--
-- Name: gis_zone_pkey; Type: CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo; Tablespace: 
--

ALTER TABLE ONLY gis_zone
    ADD CONSTRAINT gis_zone_pkey PRIMARY KEY (id);


--
-- Name: fk19924c9c3ae63a27; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_folder
    ADD CONSTRAINT fk19924c9c3ae63a27 FOREIGN KEY (folder_auth_id) REFERENCES gis_authority(id);


--
-- Name: fk19924c9c82d8cb50; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_folder
    ADD CONSTRAINT fk19924c9c82d8cb50 FOREIGN KEY (folder_parent_id) REFERENCES gis_folder(id);


--
-- Name: fk19924c9c8635f5ec; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_folder
    ADD CONSTRAINT fk19924c9c8635f5ec FOREIGN KEY (folder_user_id) REFERENCES gis_user(id);


--
-- Name: fk19924c9cf3f1b18c; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_folder
    ADD CONSTRAINT fk19924c9cf3f1b18c FOREIGN KEY (folder_zone_id) REFERENCES gis_zone(id);


--
-- Name: fk2a12fbf93f253f5f; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_authority_gis_layer
    ADD CONSTRAINT fk2a12fbf93f253f5f FOREIGN KEY (layerlist_id) REFERENCES gis_layer(id);


--
-- Name: fk2a12fbf968c1472b; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_authority_gis_layer
    ADD CONSTRAINT fk2a12fbf968c1472b FOREIGN KEY (gis_authority_id) REFERENCES gis_authority(id);


--
-- Name: fk32d4ad8df1db18eb; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_layer_gis_layer_property
    ADD CONSTRAINT fk32d4ad8df1db18eb FOREIGN KEY (gis_layer_id) REFERENCES gis_layer(id);


--
-- Name: fk32d4ad8df9cd1650; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_layer_gis_layer_property
    ADD CONSTRAINT fk32d4ad8df9cd1650 FOREIGN KEY (properties_id) REFERENCES gis_layer_property(id);


--
-- Name: fk378271e7a4954b5f; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_layer_gis_style
    ADD CONSTRAINT fk378271e7a4954b5f FOREIGN KEY (stylelist_id) REFERENCES gis_style(id);


--
-- Name: fk378271e7f1db18eb; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_layer_gis_style
    ADD CONSTRAINT fk378271e7f1db18eb FOREIGN KEY (gis_layer_id) REFERENCES gis_layer(id);


--
-- Name: fk467772a12e793c5d; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_zone_in_zone
    ADD CONSTRAINT fk467772a12e793c5d FOREIGN KEY (zone_id) REFERENCES gis_zone(id);


--
-- Name: fk467772a172f0f61d; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_zone_in_zone
    ADD CONSTRAINT fk467772a172f0f61d FOREIGN KEY (subzone_id) REFERENCES gis_zone(id);


--
-- Name: fk47b64f798feeb171; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_user
    ADD CONSTRAINT fk47b64f798feeb171 FOREIGN KEY (user_authority_id) REFERENCES gis_authority(id);


--
-- Name: fk60e6dda82ae81ce9; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_permission_by_authtype
    ADD CONSTRAINT fk60e6dda82ae81ce9 FOREIGN KEY (auth_type_id) REFERENCES gis_authority_type(id);


--
-- Name: fk60e6dda8c2ada73d; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_permission_by_authtype
    ADD CONSTRAINT fk60e6dda8c2ada73d FOREIGN KEY (permission_id) REFERENCES gis_permission(id);


--
-- Name: fk84d807a611a1f4eb; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_style_gis_rule
    ADD CONSTRAINT fk84d807a611a1f4eb FOREIGN KEY (gis_style_id) REFERENCES gis_style(id);


--
-- Name: fk84d807a6c39cbeff; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_style_gis_rule
    ADD CONSTRAINT fk84d807a6c39cbeff FOREIGN KEY (rulelist_id) REFERENCES gis_rule(id);


--
-- Name: fk85c0552ae81ce9; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_authority
    ADD CONSTRAINT fk85c0552ae81ce9 FOREIGN KEY (auth_type_id) REFERENCES gis_authority_type(id);


--
-- Name: fk85c0552e793c5d; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_authority
    ADD CONSTRAINT fk85c0552e793c5d FOREIGN KEY (zone_id) REFERENCES gis_zone(id);


--
-- Name: fk85c0554ef188df; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_authority
    ADD CONSTRAINT fk85c0554ef188df FOREIGN KEY (auth_parent_id) REFERENCES gis_authority(id);


--
-- Name: fk9aec175171ba2fb; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_rule_gis_rule_property
    ADD CONSTRAINT fk9aec175171ba2fb FOREIGN KEY (properties_id) REFERENCES gis_rule_property(id);


--
-- Name: fk9aec175da65d3ef; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_rule_gis_rule_property
    ADD CONSTRAINT fk9aec175da65d3ef FOREIGN KEY (gis_rule_id) REFERENCES gis_rule(id);


--
-- Name: fkae8ce763156a2a2f; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_layer
    ADD CONSTRAINT fkae8ce763156a2a2f FOREIGN KEY (layer_folder_id) REFERENCES gis_folder(id);


--
-- Name: fkae8ce763531f600a; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_layer
    ADD CONSTRAINT fkae8ce763531f600a FOREIGN KEY (layer_auth_id) REFERENCES gis_authority(id);


--
-- Name: fkae8ce7639e6f1bcf; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_layer
    ADD CONSTRAINT fkae8ce7639e6f1bcf FOREIGN KEY (layer_user_id) REFERENCES gis_user(id);


--
-- Name: fkae8ce763e33d65b2; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_layer
    ADD CONSTRAINT fkae8ce763e33d65b2 FOREIGN KEY (layer_layer_type_id) REFERENCES gis_layer_type(id);


--
-- Name: fked179806ac9af09; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_property_in_layer_type
    ADD CONSTRAINT fked179806ac9af09 FOREIGN KEY (defaultproperties_id) REFERENCES gis_layer_type_property(id);


--
-- Name: fked179806d846c032; Type: FK CONSTRAINT; Schema: persistence_geo; Owner: persistence_geo
--

ALTER TABLE ONLY gis_property_in_layer_type
    ADD CONSTRAINT fked179806d846c032 FOREIGN KEY (gis_layer_type_id) REFERENCES gis_layer_type(id);

--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

