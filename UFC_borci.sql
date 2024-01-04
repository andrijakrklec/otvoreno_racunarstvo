--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

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
    ime character varying(512) NOT NULL,
    prezime character varying(512) NOT NULL,
    protivnik_ime character varying(512),
    protivnik_prezime character varying(512),
    datum_borbe date NOT NULL,
    rezultat character varying(512)
);


ALTER TABLE public.borbe OWNER TO postgres;

--
-- Name: borci; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.borci (
    ime character varying(512) NOT NULL,
    prezime character varying(512) NOT NULL,
    rekord character varying(512),
    "datum_rođenja" date,
    "preciznost_značajnih_udaraca" character varying(512),
    "broj_značajnih_udaraca_po_minuti" numeric(5,2),
    "preciznost_rušenja" character varying(512),
    "broj_rušenja_po_minuti" numeric(5,2),
    datum_prethodne_borbe date NOT NULL
);


ALTER TABLE public.borci OWNER TO postgres;

--
-- Data for Name: borbe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.borbe (ime, prezime, protivnik_ime, protivnik_prezime, datum_borbe, rezultat) FROM stdin;
Jon	Jones	Ciryl	Gane	2023-03-04	pobjeda
Jon	Jones	Dominick	Reyes	2020-02-08	pobjeda
Stipe	Miocic	Francis	Ngannou	2021-03-27	poraz
Stipe	Miocic	Daniel	Cormier	2020-08-15	pobjeda
Tai	Tuivasa	Alexander	Volkov	2023-09-09	poraz
Tai	Tuivasa	Sergei	Pavlovich	2022-12-03	poraz
Israel	Adesanya	Sean	Strickland	2023-09-09	poraz
Israel	Adesanya	Alex	Pereira	2023-04-08	pobjeda
Alex	Pereira	Jan	Blachowicz	2023-07-29	pobjeda
Alex	Pereira	Israel	Adesanya	2023-04-08	poraz
Jan	Blachowicz	Alex	Pereira	2023-07-29	poraz
Jan	Blachowicz	Magomed	Ankalaev	2022-12-10	neriješeno
Magomed	Ankalaev	Jan	Blachowicz	2022-12-10	neriješeno
Magomed	Ankalaev	Anthony	Smith	2022-07-30	pobjeda
Alexander	Volkanovski	Yair	Rodriguez	2023-07-08	pobjeda
Alexander	Volkanovski	Islam	Makhachev	2023-02-11	poraz
Islam	Makhachev	Alexander	Volkanovski	2023-02-11	pobjeda
Islam	Makhachev	Charles	Oliveira	2022-02-26	pobjeda
Charles	Oliveira	Beneil	Dariush	2023-06-10	pobjeda
Charles	Oliveira	Islam	Makhachev	2022-10-22	poraz
\.


--
-- Data for Name: borci; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.borci (ime, prezime, rekord, "datum_rođenja", "preciznost_značajnih_udaraca", "broj_značajnih_udaraca_po_minuti", "preciznost_rušenja", "broj_rušenja_po_minuti", datum_prethodne_borbe) FROM stdin;
Jon	Jones	27-1-0	1987-07-19	57%	4.29	45%	1.93	2023-03-04
Jon	Jones	27-1-0	1987-07-19	57%	4.29	45%	1.93	2020-02-08
Stipe	Miocic	20-4-0	1982-08-19	53%	4.82	34%	1.86	2021-03-27
Stipe	Miocic	20-4-0	1982-08-19	53%	4.82	34%	1.86	2020-08-15
Tai	Tuivasa	24-3-0	1989-07-22	48%	3.93	14%	0.05	2023-09-09
Tai	Tuivasa	24-3-0	1989-07-22	48%	3.93	14%	0.05	2022-12-03
Israel	Adesanya	15-6-0	1993-03-16	49%	3.98	0%	0.00	2023-09-09
Israel	Adesanya	15-6-0	1993-03-16	49%	3.98	0%	0.00	2023-04-08
Alex	Pereira	8-2-0	1987-07-07	62%	5.11	100%	0.22	2023-07-29
Alex	Pereira	8-2-0	1987-07-07	62%	5.11	100%	0.22	2023-04-08
Jan	Blachowicz	29-10-1	1983-02-24	50%	3.41	50%	1.09	2023-07-29
Jan	Blachowicz	29-10-1	1983-02-24	50%	3.41	50%	1.09	2022-12-10
Magomed	Ankalaev	18-1-1	1992-06-02	52%	3.55	29%	0.99	2022-12-10
Magomed	Ankalaev	18-1-1	1992-06-02	52%	3.55	29%	0.99	2022-07-30
Alexander	Volkanovski	26-2-0	1988-09-29	56%	6.25	37%	1.86	2023-07-08
Alexander	Volkanovski	26-2-0	1988-09-29	56%	6.25	37%	1.86	2023-02-11
Islam	Makhachev	24-1-0	1991-10-27	59%	2.35	62%	3.24	2023-02-11
Islam	Makhachev	24-1-0	1991-10-27	59%	2.35	62%	3.24	2022-02-26
Charles	Oliveira	34-9-0	1989-10-17	53%	3.54	40%	2.32	2023-06-10
Charles	Oliveira	34-9-0	1989-10-17	53%	3.54	40%	2.32	2022-10-22
\.


--
-- Name: borbe borbe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borbe
    ADD CONSTRAINT borbe_pkey PRIMARY KEY (ime, prezime, datum_borbe);


--
-- Name: borci borci_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borci
    ADD CONSTRAINT borci_pkey PRIMARY KEY (ime, prezime, datum_prethodne_borbe);


--
-- Name: borci borci_ime_prezime_datum_prethodne_borbe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borci
    ADD CONSTRAINT borci_ime_prezime_datum_prethodne_borbe_fkey FOREIGN KEY (ime, prezime, datum_prethodne_borbe) REFERENCES public.borbe(ime, prezime, datum_borbe);


--
-- PostgreSQL database dump complete
--

