
CREATE TABLE IF NOT EXISTS userType (
  id int(11) NOT NULL,
  name text NOT NULL,
  permissions text NOT NULL
);


CREATE TABLE IF NOT EXISTS user (
  id int(11) NOT NULL PRIMARY KEY,
  username text NOT NULL,
  password text NOT NULL,
  userType int(11) NOT NULL,
  FOREIGN KEY (userType) REFERENCES userType(id)
);


CREATE TABLE IF NOT EXISTS paymentType (
  id int(11) NOT NULL PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE IF NOT EXISTS transaction (
  id int(11) NOT NULL,
  description text NOT NULL,
  amount float NOT NULL,
  paymentType int(11) NOT NULL,
  transactionDate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user int(11) NOT NULL,
  FOREIGN KEY (paymentType) REFERENCES paymentType (id),
  FOREIGN KEY (user) REFERENCES user (id)
);
