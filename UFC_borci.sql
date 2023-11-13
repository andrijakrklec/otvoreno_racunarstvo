--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: borbe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.borbe (
    id integer NOT NULL,
    protivnik_id integer NOT NULL,
    datum_borbe date NOT NULL,
    rezultat character varying(512) NOT NULL
);


ALTER TABLE public.borbe OWNER TO postgres;

--
-- Name: borci; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.borci (
    ime character varying(512) NOT NULL,
    prezime character varying(512) NOT NULL,
    rekord character varying(512) NOT NULL,
    "datum_rođenja" date NOT NULL,
    "preciznost_značajnih_udaraca" character varying(512),
    "broj_značajnih_udaraca_po_minuti" real,
    "preciznost_rušenja" character varying(512),
    "broj_rušenja_po_minuti" real,
    id integer NOT NULL
);


ALTER TABLE public.borci OWNER TO postgres;

--
-- Name: borci_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.borci ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.borci_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: borbe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.borbe (id, protivnik_id, datum_borbe, rezultat) FROM stdin;
1	2	2023-03-04	pobjeda
1	3	2020-02-08	pobjeda
11	4	2021-03-27	poraz
11	5	2020-08-15	pobjeda
12	6	2023-09-09	poraz
12	7	2022-12-03	poraz
13	20	2023-09-09	poraz
13	14	2023-04-08	pobjeda
14	15	2023-07-29	pobjeda
14	13	2023-04-08	poraz
15	14	2023-07-29	poraz
15	16	2022-12-10	neriješeno
16	15	2022-12-10	neriješeno
16	8	2022-07-30	pobjeda
17	9	2023-07-08	pobjeda
17	18	2023-02-11	poraz
18	17	2023-02-11	pobjeda
18	19	2022-02-26	pobjeda
19	10	2023-06-10	pobjeda
19	18	2022-10-22	poraz
\.


--
-- Data for Name: borci; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.borci (ime, prezime, rekord, "datum_rođenja", "preciznost_značajnih_udaraca", "broj_značajnih_udaraca_po_minuti", "preciznost_rušenja", "broj_rušenja_po_minuti", id) FROM stdin;
Jon	Jones	27-1-0	1987-07-19	57%	4.29	45%	1.93	1
Ciryl	Gane	12-2-0	1990-04-12	60%	5.49	21%	0.58	2
Dominick	Reyes	12-4-0	1989-12-26	50%	4.75	28%	0.36	3
Francis	Ngannou	17-3-0	1986-09-05	41%	2.33	62%	0.76	4
Daniel	Cormier	22-3-0	1979-04-20	52%	4.25	44%	1.83	5
Alexander	Volkov	37-10-0	1988-10-24	57%	5.1	63%	0.49	6
Sergei	Pavlovich	18-1-0	1992-05-13	49%	8.72	0%	0	7
Anthony	Smith	37-18-0	1988-07-26	48%	3.16	28%	0.52	8
Yair	Rodriguez	16-4-0	1992-10-06	46%	4.63	28%	0.73	9
Beneil	Dariush	22-5-1	1989-05-06	49%	3.79	34%	1.91	10
Stipe	Miocic	20-4-0	1982-08-19	53%	4.82	34%	1.86	11
Tai	Tuivasa	24-3-0	1989-07-22	48%	3.93	14%	0.05	12
Israel	Adesanya	15-6-0	1993-03-16	49%	3.98	0%	0	13
Alex	Pereira	8-2-0	1987-07-07	62%	5.11	100%	0.22	14
Jan	Blachowicz	29-10-1	1983-02-24	50%	3.41	50%	1.09	15
Magomed	Ankalaev	18-1-1	1992-06-02	52%	3.55	29%	0.99	16
Alexander	Volkanovski	26-2-0	1988-09-29	56%	6.25	37%	1.86	17
Islam	Makhachev	24-1-0	1991-10-27	59%	2.35	62%	3.24	18
Charles	Oliveira	34-9-0	1989-10-17	53%	3.54	40%	2.32	19
Sean	Strickland	28-5-0	1991-02-27	41%	5.82	63%	0.92	20
\.


--
-- Name: borci_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.borci_id_seq', 20, true);


--
-- Name: borbe borbe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borbe
    ADD CONSTRAINT borbe_pkey PRIMARY KEY (id, datum_borbe);


--
-- Name: borbe borbe_protivnik_id_datum_borbe_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borbe
    ADD CONSTRAINT borbe_protivnik_id_datum_borbe_key UNIQUE (protivnik_id, datum_borbe);


--
-- Name: borci borci_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borci
    ADD CONSTRAINT borci_pkey PRIMARY KEY (id);


--
-- Name: borbe borbe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borbe
    ADD CONSTRAINT borbe_id_fkey FOREIGN KEY (id) REFERENCES public.borci(id);


--
-- Name: borbe borbe_protivnik_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borbe
    ADD CONSTRAINT borbe_protivnik_id_fkey FOREIGN KEY (protivnik_id) REFERENCES public.borci(id);


--
-- PostgreSQL database dump complete
--

