DROP TABLE IF EXISTS files;

CREATE TABLE IF NOT EXISTS files (
  name VARCHAR(50) NOT NULL,
  content bytea
);
