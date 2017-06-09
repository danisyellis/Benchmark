CREATE TABLE contacts (
  id serial,
  name varchar(255) NOT NULL,
  email varchar(255),
  phone varchar(30),
  street varchar(255),
  city varchar(40),
  state varchar(20),
  country varchar(40),
  zip varchar(10),
  birthday varchar(20),
  website varchar(255)
);
