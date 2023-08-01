DROP DATABASE IF EXISTS biztime;

CREATE DATABASE biztime;

\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industry (
  id serial PRIMARY KEY,
  code text NOT NULL UNIQUE,
  name text NOT NULL UNIQUE
);

CREATE TABLE connections (
  comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
  code text NOT NULL REFERENCES industry ON DELETE CASCADE,
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industry (code, name)
  VALUES ('acct', 'Accounting'),
         ('bus', 'Business'),
         ('agr', 'Agriculture'),
         ('tech', 'Technology'),
         ('comm', 'Communication');

INSERT INTO connections (comp_code, code)
  VALUES ('apple', 'tech'),
         ('apple', 'comm'),
         ('apple', 'bus'),
         ('ibm', 'tech'),
         ('ibm', 'bus');

