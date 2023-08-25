PGDMP     1    9                {           postgres    15.3    15.3                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    5    postgres    DATABASE     j   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE postgres;
                postgres    false                       0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                   postgres    false    3603                        3079    16384 	   adminpack 	   EXTENSION     A   CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;
    DROP EXTENSION adminpack;
                   false                       0    0    EXTENSION adminpack    COMMENT     M   COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';
                        false    2            �            1259    129917    files    TABLE     5  CREATE TABLE public.files (
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
    DROP TABLE public.files;
       public         heap    postgres    false            �            1259    129924    files_id_seq    SEQUENCE     �   ALTER TABLE public.files ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    219            �            1259    16398    repo    TABLE     �   CREATE TABLE public.repo (
    id integer NOT NULL,
    repoid integer NOT NULL,
    reponame text NOT NULL,
    numlines integer NOT NULL,
    rate double precision NOT NULL,
    forks double precision[] NOT NULL,
    url text NOT NULL
);
    DROP TABLE public.repo;
       public         heap    postgres    false            �            1259    16405    repo_id_seq    SEQUENCE     �   ALTER TABLE public.repo ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.repo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    215            �            1259    25024    repocmp    TABLE     q   CREATE TABLE public.repocmp (
    id integer NOT NULL,
    reponame text NOT NULL,
    hashcode text NOT NULL
);
    DROP TABLE public.repocmp;
       public         heap    postgres    false            �            1259    25031    repocmp_id_seq    SEQUENCE     �   ALTER TABLE public.repocmp ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.repocmp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    217            {           2606    16404    repo RepoUrls_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.repo
    ADD CONSTRAINT "RepoUrls_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.repo DROP CONSTRAINT "RepoUrls_pkey";
       public            postgres    false    215                       2606    129923    files files_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.files DROP CONSTRAINT files_pkey;
       public            postgres    false    219            }           2606    25030    repocmp repocmp_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.repocmp
    ADD CONSTRAINT repocmp_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.repocmp DROP CONSTRAINT repocmp_pkey;
       public            postgres    false    217           