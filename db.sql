--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

-- Started on 2023-08-25 20:00:19 EDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16384)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 3603 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 129917)
-- Name: files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.files (
    id integer NOT NULL,
    file_name text NOT NULL,
    subset integer NOT NULL,
    hashcode text NOT NULL,
    p4c boolean NOT NULL,
    tree_sitter boolean NOT NULL,
    error text NOT NULL,
    num_similar integer NOT NULL,
    number_constant integer NOT NULL,
    number_parser integer NOT NULL,
    number_declaration integer NOT NULL,
    number_control integer NOT NULL,
    number_if integer NOT NULL,
    url text NOT NULL,
    error_p4c text NOT NULL,
    intel_lexar boolean NOT NULL,
    intel_parser boolean NOT NULL
);


ALTER TABLE public.files OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 129924)
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.files ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 215 (class 1259 OID 16398)
-- Name: repo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.repo (
    id integer NOT NULL,
    repoid integer NOT NULL,
    reponame text NOT NULL,
    numlines integer NOT NULL,
    rate double precision NOT NULL,
    forks double precision[] NOT NULL,
    url text NOT NULL
);


ALTER TABLE public.repo OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16405)
-- Name: repo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.repo ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.repo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 217 (class 1259 OID 25024)
-- Name: repocmp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.repocmp (
    id integer NOT NULL,
    reponame text NOT NULL,
    hashcode text NOT NULL
);


ALTER TABLE public.repocmp OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 25031)
-- Name: repocmp_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.repocmp ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.repocmp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3451 (class 2606 OID 16404)
-- Name: repo RepoUrls_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.repo
    ADD CONSTRAINT "RepoUrls_pkey" PRIMARY KEY (id);


--
-- TOC entry 3455 (class 2606 OID 129923)
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- TOC entry 3453 (class 2606 OID 25030)
-- Name: repocmp repocmp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.repocmp
    ADD CONSTRAINT repocmp_pkey PRIMARY KEY (id);


-- Completed on 2023-08-25 20:00:19 EDT

--
-- PostgreSQL database dump complete
--

