--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.5

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
-- Name: products; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    type text NOT NULL,
    price numeric(10,2) NOT NULL,
    return_type text DEFAULT 'consumed'::text NOT NULL,
    order_multiplier integer DEFAULT 1 NOT NULL,
    reorder_threshold integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.products OWNER TO neondb_owner;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO neondb_owner;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: restock_sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.restock_sessions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    venue_id integer NOT NULL,
    visit_date text NOT NULL,
    visit_time text NOT NULL,
    comments text,
    unleashed_order_id text,
    unleashed_invoice_id text,
    status text DEFAULT 'pending'::text NOT NULL,
    total_value numeric(10,2),
    items_data jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.restock_sessions OWNER TO neondb_owner;

--
-- Name: restock_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.restock_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.restock_sessions_id_seq OWNER TO neondb_owner;

--
-- Name: restock_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.restock_sessions_id_seq OWNED BY public.restock_sessions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    username text NOT NULL
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: venue_products; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.venue_products (
    id integer NOT NULL,
    venue_id integer NOT NULL,
    product_id integer NOT NULL,
    par_level integer NOT NULL
);


ALTER TABLE public.venue_products OWNER TO neondb_owner;

--
-- Name: venue_products_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.venue_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.venue_products_id_seq OWNER TO neondb_owner;

--
-- Name: venue_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.venue_products_id_seq OWNED BY public.venue_products.id;


--
-- Name: venues; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.venues (
    id integer NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    code text NOT NULL,
    unleashed_customer_guid text,
    unleashed_customer_code text,
    unleashed_customer_name text
);


ALTER TABLE public.venues OWNER TO neondb_owner;

--
-- Name: venues_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.venues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.venues_id_seq OWNER TO neondb_owner;

--
-- Name: venues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.venues_id_seq OWNED BY public.venues.id;


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: restock_sessions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.restock_sessions ALTER COLUMN id SET DEFAULT nextval('public.restock_sessions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: venue_products id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.venue_products ALTER COLUMN id SET DEFAULT nextval('public.venue_products_id_seq'::regclass);


--
-- Name: venues id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.venues ALTER COLUMN id SET DEFAULT nextval('public.venues_id_seq'::regclass);


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.products (id, name, code, type, price, return_type, order_multiplier, reorder_threshold) FROM stdin;
248	Matcha 100g	5916	merchandise	32.00	consumed	1	0
249	Cold Brew Concentrate - Individual	7081	coffee	48.00	consumed	1	1
250	Cold Brew Concentrate - 4 pack	7084	coffee	48.00	consumed	4	1
252	Instant Wolff	3739E	coffee	18.00	consumed	1	0
254	Big Dog 500g	200056	coffee	35.00	returned	1	0
255	Big Dog 250g	200050	coffee	22.00	returned	1	0
256	Zero	9493	coffee	28.50	returned	1	0
257	Low	9400	coffee	28.50	returned	1	0
258	Hero	9495	coffee	28.50	returned	1	0
259	Edelweiss 500g	100359	coffee	35.00	returned	1	0
260	Lil Red 500g	100469	coffee	35.00	returned	1	0
261	Hummingbird 250g	100421	coffee	22.00	returned	1	0
262	Zero Pods	CAP201	coffee	12.00	consumed	1	0
263	Medium Pods	CAP202	coffee	12.00	consumed	1	0
264	Dark Pods	CAP203	coffee	12.00	consumed	1	0
265	Drip Coffee 10 Pack	DRIP001	coffee	15.00	consumed	1	0
266	DRK 500g	DRK2-IND	coffee	28.50	returned	1	0
251	Seasonal Blend	DRK2-SEASONAL	coffee	28.50	returned	1	0
\.


--
-- Data for Name: restock_sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.restock_sessions (id, user_id, venue_id, visit_date, visit_time, comments, unleashed_order_id, unleashed_invoice_id, status, total_value, items_data, created_at) FROM stdin;
13	91	76	2025-06-20	21:00	Testing with proper Tax object structure	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:37:37.385724
4	91	76	2025-06-20	12:00	Final test for Unleashed order creation	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 1, "productId": 201, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 3, "reorderThreshold": 1, "productReturnType": "consumed"}]	2025-06-20 05:31:16.600531
2	91	76	2025-06-20	10:00	Test order creation for Bru Cru	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 1, "productId": 201, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 3, "reorderThreshold": 1, "productReturnType": "consumed"}]	2025-06-20 05:27:05.440764
7	91	76	2025-06-20	15:00	Testing Placed status with calculated tax fields	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:33:24.886284
3	91	76	2025-06-20	11:00	Test order creation with Retail Warehouse	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 1, "productId": 201, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 3, "reorderThreshold": 1, "productReturnType": "consumed"}]	2025-06-20 05:28:48.373244
5	91	76	2025-06-20	13:00	Testing with OrderStatus and Tax fields	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 1, "productId": 201, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 3, "reorderThreshold": 1, "productReturnType": "consumed"}]	2025-06-20 05:31:43.892316
6	91	76	2025-06-20	14:00	Testing Parked status with DEFAULT tax code	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:33:02.206944
10	91	76	2025-06-20	18:00	Testing minimal order structure	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:35:14.643298
8	91	76	2025-06-20	16:00	Testing complete order structure with calculated totals	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:34:29.835285
9	91	76	2025-06-20	17:00	Testing with proper Tax structure	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:34:53.012121
12	91	76	2025-06-20	20:00	Testing complete order structure with all fields	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:36:44.023904
11	91	76	2025-06-20	19:00	Final test with complete order structure	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:35:58.870604
14	91	76	2025-06-20	22:00	Testing with line-level tax calculations	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:38:14.399934
15	91	76	2025-06-20	23:00	Testing minimal order structure	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:38:46.6095
16	91	76	2025-06-20	23:30	Testing with required Tax field	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:39:24.746119
29	91	76	2025-06-20	12:00	Testing debug output for Tax field	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:48:10.928007
17	91	76	2025-06-20	00:00	Final test with debug logging	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:40:43.823477
23	91	76	2025-06-20	06:00	Testing with shorter order number format	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:44:56.871316
18	91	76	2025-06-20	01:00	Testing corrected order payload	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:41:35.099461
19	91	76	2025-06-20	02:00	Testing with auto-generated order number	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:41:55.584615
27	91	76	2025-06-20	10:00	Final test with complete order structure	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:47:01.016421
20	91	76	2025-06-20	03:00	Testing with generated order number	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:42:14.431024
24	91	76	2025-06-20	07:00	Testing with simplified TaxRate	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:45:32.336431
21	91	76	2025-06-20	04:00	Testing without OrderNumber field	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:42:56.253148
22	91	76	2025-06-20	05:00	Testing with RETAIL prefix and fixed formatting	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:44:38.447875
25	91	76	2025-06-20	08:00	Testing simplified order structure	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:45:53.901054
26	91	76	2025-06-20	09:00	Testing improved numeric formatting	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:46:40.694439
28	91	76	2025-06-20	11:00	Testing improved order structure	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:47:32.445268
31	91	76	2025-06-20	14:00	Testing minimal order without OrderNumber	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:48:56.419705
30	91	76	2025-06-20	13:00	Testing simplified order number format	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:48:29.511984
32	91	76	2025-06-20	15:00	Testing final order structure	\N	\N	failed	\N	[{"parLevel": 5, "quantity": 3, "productId": 200, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 05:49:31.823424
33	91	76	2025-06-20	06:00	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 05:58:25.381483
34	91	76	2025-06-20	06:00	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:00:07.007297
41	91	76	2025-06-20	06:04	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:03:35.720787
35	91	76	2025-06-20	06:00	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:00:47.659431
36	91	76	2025-06-20	06:01	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:01:20.177513
37	91	76	2025-06-20	06:02	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:01:43.687276
42	91	76	2025-06-20	06:04	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:04:08.130513
38	91	76	2025-06-20	06:02	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:02:13.571792
39	91	76	2025-06-20	06:03	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:02:31.090875
46	91	76	2025-06-20	06:11	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:10:57.355887
40	91	76	2025-06-20	06:03	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:02:56.064886
43	91	76	2025-06-20	06:05	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:04:49.088223
49	91	76	2025-06-20	06:12	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:12:23.077436
44	91	76	2025-06-20	06:05	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:05:07.175173
47	91	76	2025-06-20	06:11	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:11:20.627816
45	91	76	2025-06-20	06:10	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:10:31.415597
48	91	76	2025-06-20	06:12	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:11:58.322659
51	91	76	2025-06-20	06:13	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:13:19.781547
50	91	76	2025-06-20	06:13	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:12:58.37106
52	91	76	2025-06-20	06:14	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:14:25.077889
53	91	76	2025-06-20	06:15	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:14:47.549685
54	91	76	2025-06-20	06:15	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:15:10.741913
61	91	76	2025-06-20	06:20	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:19:49.003831
55	91	76	2025-06-20	06:16	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:15:50.531972
56	91	76	2025-06-20	06:16	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:16:20.876127
57	91	76	2025-06-20	06:17	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:17:40.983976
62	91	76	2025-06-20	06:20	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:20:25.755475
58	91	76	2025-06-20	06:18	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:18:00.979987
59	91	76	2025-06-20	06:18	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:18:31.121048
66	91	76	2025-06-20	06:23	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:22:56.094347
60	91	76	2025-06-20	06:19	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:19:19.47772
63	91	76	2025-06-20	06:21	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:21:27.519411
69	91	76	2025-06-20	09:10	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 09:10:06.327495
64	91	76	2025-06-20	06:22	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:21:47.602162
67	91	76	2025-06-20	06:23	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:23:19.915706
65	91	76	2025-06-20	06:22	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:22:34.643885
68	91	76	2025-06-20	06:24	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 06:23:39.329757
71	91	76	2025-06-20	09:12	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 09:11:37.185331
70	91	76	2025-06-20	09:11	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 09:11:16.714167
72	91	76	2025-06-20	09:12	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 09:12:03.451106
73	91	76	2025-06-20	09:12	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 09:12:22.548019
74	91	76	2025-06-20	09:13	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 09:13:07.282088
75	91	76	2025-06-20	09:13	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 09:13:27.799335
80	92	76	2025-06-20	19:33	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 2, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 10, "quantity": 5, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 5, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 2, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 09:34:26.97959
76	91	76	2025-06-20	09:14	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 09:14:34.904673
77	91	76	2025-06-20	09:15	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 09:15:16.589102
81	92	76	2025-06-20	19:33	\N	\N	\N	processing	\N	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 2, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 10, "quantity": 5, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 5, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 2, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 09:36:07.937125
78	91	76	2025-06-20	09:15	\N	\N	\N	failed	\N	[{"parLevel": 8, "quantity": 2, "productId": 123, "productCode": "DRK2", "productName": "DRK2 Seasonal Blend", "productType": "consumed", "productPrice": "19.50", "soldQuantity": 6, "reorderThreshold": 3, "productReturnType": "consumed"}]	2025-06-20 09:15:35.328223
79	92	76	2025-06-20	19:22	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 2, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 1, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 253, "productCode": "DRK2-500G", "productName": "DRK 500g", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 10, "quantity": 6, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 4, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 2, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 1, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}]	2025-06-20 09:23:25.890567
82	91	76	2025-06-20	19:36	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 0, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 10, "quantity": 5, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 5, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 0, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 09:37:05.610645
83	92	76	2025-06-20	19:44	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 2, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 10, "quantity": 6, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 4, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 1, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 3, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 09:45:18.208247
84	91	76	2025-06-20	19:49	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 2, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 10, "quantity": 0, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 2, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 09:50:21.190613
85	91	76	2025-06-20	19:56	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 2, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 10, "quantity": 5, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 5, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 0, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 09:56:39.452795
86	91	76	2025-06-20	20:03	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 2, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 10, "quantity": 5, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 5, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 0, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 10:03:49.150535
87	91	76	2025-06-20	20:08	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 2, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 10, "quantity": 4, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 6, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 1, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 3, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 10:08:30.932703
88	91	76	2025-06-20	20:08	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 2, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 10, "quantity": 4, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 6, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 1, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 3, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 10:08:43.770917
89	91	76	2025-06-20	20:14	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 2, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 10, "quantity": 1, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 9, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 1, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 3, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 10:14:54.25106
90	91	76	2025-06-20	20:14	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 2, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 10, "quantity": 1, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 9, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 1, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 3, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 10:15:10.908067
91	91	76	2025-06-20	20:14	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 2, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 10, "quantity": 1, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 9, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 1, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 3, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 10:15:48.524222
92	91	76	2025-06-20	20:29	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 2, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 10, "quantity": 5, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 5, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 0, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 10:29:32.084435
93	91	76	2025-06-20	20:29	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 2, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 10, "quantity": 5, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 5, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 0, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 10:29:46.873896
94	91	76	2025-06-20	20:33	\N	c7f347c0-f468-4778-9bde-5061c535882f	\N	submitted	187.00	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 2, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 10, "quantity": 3, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 7, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 4, "quantity": 1, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 3, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 10:34:09.538449
95	92	78	2025-06-20	20:33	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 4, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 0, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 1, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 3, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 6, "quantity": 2, "productId": 266, "productCode": "DRK2-IND", "productName": "DRK 500g", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 4, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 10:52:20.233171
96	92	78	2025-06-20	20:33	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 4, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 0, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 1, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 3, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 6, "quantity": 2, "productId": 266, "productCode": "DRK2-IND", "productName": "DRK 500g", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 4, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 10:52:32.186581
97	91	78	2025-06-20	21:02	\N	d7a72ef9-b9fb-425a-9d65-7517e6fb9991	\N	submitted	169.50	[{"parLevel": 2, "quantity": 1, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 2, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 0, "productId": 252, "productCode": "3739E", "productName": "Instant Wolff", "productType": "coffee", "productPrice": "18.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 1, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 6, "quantity": 1, "productId": 266, "productCode": "DRK2-IND", "productName": "DRK 500g", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 5, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}]	2025-06-20 11:03:11.932066
98	93	79	2025-06-20	21:02	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 0, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 0, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 6, "quantity": 4, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 3, "quantity": 2, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 1, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 3, "reorderThreshold": 0, "productReturnType": "consumed"}]	2025-06-20 11:05:11.380229
99	91	79	2025-06-20	21:06	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 0, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 0, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 6, "quantity": 0, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 3, "quantity": 0, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 1, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 1, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 1, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 3, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}]	2025-06-20 11:06:31.877085
100	91	79	2025-06-20	21:06	\N	\N	\N	failed	\N	[{"parLevel": 2, "quantity": 0, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 0, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 6, "quantity": 0, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 3, "quantity": 0, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 1, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 1, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 1, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 3, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}]	2025-06-20 11:13:10.452683
101	91	79	2025-06-20	21:14	\N	5585b522-2501-42a2-be26-73e813adbb41	\N	submitted	209.00	[{"parLevel": 2, "quantity": 0, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 1, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 3, "reorderThreshold": 1, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 1, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 6, "quantity": 0, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 3, "quantity": 1, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 2, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 1, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 0, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 1, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 1, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 0, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "reorderThreshold": 0, "productReturnType": "consumed"}]	2025-06-20 11:14:59.348236
102	91	79	2025-06-25	19:08:07	\N	\N	\N	pending	\N	[{"parLevel": 2, "quantity": 0, "productId": 248, "productCode": "5916", "productName": "Matcha 100g", "productType": "merchandise", "productPrice": "32.00", "soldQuantity": 2, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 2, "productId": 249, "productCode": "7081", "productName": "Cold Brew Concentrate - Individual", "productType": "coffee", "productPrice": "48.00", "soldQuantity": 2, "productReturnType": "consumed"}, {"parLevel": 2, "quantity": 2, "productId": 251, "productCode": "DRK2-SEASONAL", "productName": "Seasonal Blend", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "productReturnType": "returned"}, {"parLevel": 6, "quantity": 6, "productId": 254, "productCode": "200056", "productName": "Big Dog 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "productReturnType": "returned"}, {"parLevel": 3, "quantity": 3, "productId": 255, "productCode": "200050", "productName": "Big Dog 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 2, "productId": 256, "productCode": "9493", "productName": "Zero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 0, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 257, "productCode": "9400", "productName": "Low", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "productReturnType": "returned"}, {"parLevel": 1, "quantity": 0, "productId": 258, "productCode": "9495", "productName": "Hero", "productType": "coffee", "productPrice": "28.50", "soldQuantity": 1, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 2, "productId": 259, "productCode": "100359", "productName": "Edelweiss 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 2, "productId": 260, "productCode": "100469", "productName": "Lil Red 500g", "productType": "coffee", "productPrice": "35.00", "soldQuantity": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 2, "productId": 261, "productCode": "100421", "productName": "Hummingbird 250g", "productType": "coffee", "productPrice": "22.00", "soldQuantity": 0, "productReturnType": "returned"}, {"parLevel": 2, "quantity": 2, "productId": 262, "productCode": "CAP201", "productName": "Zero Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 4, "productId": 263, "productCode": "CAP202", "productName": "Medium Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "productReturnType": "consumed"}, {"parLevel": 4, "quantity": 4, "productId": 264, "productCode": "CAP203", "productName": "Dark Pods", "productType": "coffee", "productPrice": "12.00", "soldQuantity": 0, "productReturnType": "consumed"}]	2025-06-25 09:08:08.097725
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, name, username) FROM stdin;
91	Keenan Curran	keenan-curran
92	Abbie Moore	abbie-moore
93	Aaron Leck	aaron-leck
94	James Thai	james-thai
95	Hayden Bryant	hayden-bryant
96	Hannah Butkus	hannah-butkus
\.


--
-- Data for Name: venue_products; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.venue_products (id, venue_id, product_id, par_level) FROM stdin;
834	76	248	2
835	76	249	4
837	76	252	2
839	76	254	10
840	76	255	4
841	76	256	2
842	76	257	1
843	76	258	1
844	76	259	2
845	76	260	2
846	76	261	2
847	76	262	2
848	76	263	4
849	76	264	4
850	77	248	2
851	77	249	4
852	77	251	2
853	77	252	2
854	77	254	6
855	77	255	3
856	77	256	2
857	77	257	1
858	77	258	1
859	77	259	2
860	77	260	2
861	77	261	2
862	77	262	2
863	77	263	4
864	77	264	4
865	78	248	2
866	78	249	4
868	78	252	2
870	78	254	4
871	78	255	2
872	78	256	2
873	78	257	1
874	78	258	1
875	78	259	2
876	78	260	2
877	78	261	2
878	78	262	2
879	78	263	4
880	78	264	4
881	79	248	2
882	79	249	4
883	79	251	2
884	79	254	6
885	79	255	3
886	79	256	2
887	79	257	1
888	79	258	1
889	79	259	2
890	79	260	2
891	79	261	2
892	79	262	2
893	79	263	4
894	79	264	4
895	80	248	2
896	80	249	4
897	80	251	2
898	80	252	2
899	80	254	4
900	80	255	2
901	80	256	2
902	80	262	2
903	80	263	4
904	80	264	4
838	76	251	2
905	78	266	6
869	78	251	2
\.


--
-- Data for Name: venues; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.venues (id, name, address, code, unleashed_customer_guid, unleashed_customer_code, unleashed_customer_name) FROM stdin;
79	Kenrose Bakery	4/18 Kenrose St, Carina QLD 4152	kenrose-bakery	99c858ca-a376-4ae9-8b3f-d78017cb7cf8	KENROSE BAKERY	Kenrose Bakery
78	Golly Gosh	92 Hyde Rd, Yeronga QLD 4104	golly-gosh	c9b1be16-fb36-4004-a75f-b436bc8c54b5	GOLLYGOSH	Golly Gosh Grange Pty Ltd
76	Bru Cru	2069 Moggill Rd, Kenmore QLD 4069	bru-cru	c6ff90d5-dd6f-442f-9d6d-f31ebc5619a8	BruCru1	Dzig 7 Pty Ltd
77	All Sew	7/41 Graham Rd, Carseldine QLD 4034	all-sew	3c26945f-8f32-463b-8efd-d3921fa76b4f	ALLSEWCOF	All Sew Coffee
80	Boiler Room	3/193 South Pine Rd, Brendale QLD 4500	boiler-room	ee9099df-3690-4c7c-9332-d9dbb2833582	THEBOILER2	The Boiler Room Cafe
\.


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.products_id_seq', 266, true);


--
-- Name: restock_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.restock_sessions_id_seq', 102, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 96, true);


--
-- Name: venue_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.venue_products_id_seq', 905, true);


--
-- Name: venues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.venues_id_seq', 80, true);


--
-- Name: products products_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_code_unique UNIQUE (code);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: restock_sessions restock_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.restock_sessions
    ADD CONSTRAINT restock_sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: venue_products venue_products_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.venue_products
    ADD CONSTRAINT venue_products_pkey PRIMARY KEY (id);


--
-- Name: venues venues_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venues_code_unique UNIQUE (code);


--
-- Name: venues venues_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venues_pkey PRIMARY KEY (id);


--
-- Name: restock_sessions restock_sessions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.restock_sessions
    ADD CONSTRAINT restock_sessions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: restock_sessions restock_sessions_venue_id_venues_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.restock_sessions
    ADD CONSTRAINT restock_sessions_venue_id_venues_id_fk FOREIGN KEY (venue_id) REFERENCES public.venues(id);


--
-- Name: venue_products venue_products_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.venue_products
    ADD CONSTRAINT venue_products_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: venue_products venue_products_venue_id_venues_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.venue_products
    ADD CONSTRAINT venue_products_venue_id_venues_id_fk FOREIGN KEY (venue_id) REFERENCES public.venues(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

