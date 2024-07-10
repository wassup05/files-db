# Files-DB (CC task 3)

This is a simple program written in javascript to create an api using `express.js` and `busboy` with 3 endpoints 

  1. `/files/upload` for uploading small binary files
  2. `/files/retrieve/:filename` for retrieving the content of a file
  3. `/files/delete/:filename` for deleting all the occurences of `filename` from the database if they exist

sending a `message` in case everything's okay and an `error` if someting goes wrong (in json format)

The database used is a local docker containerised instance of [`postgres`](https://hub.docker.com/_/postgres) image.

## Usage

  1. clone the repo
  2. run `npm i`
  3. build a custom docker image using the [`Dockerfile`](./Dockerfile) using the command `docker build -t <name> .` or pulling the image from dockerhub and copying the [`init.sql`](./init.sql) in `docker-entrypoint-initdb.d/` directory of the container using the docker cp command
  4. create a container or start an existing container containg the `init.sql` with the required environment variables (see Description for more)
  5. start the server using either `npm run start` for using the sample.env with the test environment variables or `node --env-file=<name> app/app.js` for using custom environment variables
  6. you're all set to go for making requests to `localhost:PORT/files`

## Description

upon creating a container postgres automatically executes any *.sql *.sh etc files in the `docker-entrypoint-initdb.d/` directory hence it was necessary to copy the `init.sql` into that directory and hence the requirement 
of the `Dockerfile` which just contains two lines for accomplishing the above. `bytea` datatype is used for storing the content of a file as it is good enough for storing small amount of data. 
[`busboy`](https://www.npmjs.com/package/busboy) was necessary for parsing html form data in a very easy manner, other alternatives were [`multer`](https://www.npmjs.com/package/multer) etc

[`sample.env`](./sample.env) contains the required environment variables for making a connection to the postgres database (using the `pg` package) 
  1. PORT is the port you want the server to run on (default 8000)
  2. PGPORT is the port the databse is connected to
  3. POSTGRES_USER username of the user
  4. POSTGRES_PASSWORD password of the user
  5. POSTGRES_DB the databse to connect to

these are the exact same env variables used by the postgres containerised database as well.

after building the image you can run the container using the command

    docker run -d -p <host-port>:5432 -e POSTGRES_PASSWORD=<password> -e POSTGRES_USER=<username> -e PGDATABASE=<db> --name <container-name> <image-name> 

Technically `POSTGRES_PASSWORD` is the only required env variable. if `PGDATABASE` is not mentioned `POSTGRES_USER` is used for the same which defaults to `postgres`

once everything related to the database and the connection was set up, it was only a matter setting up routes using `express` and writing queries to the database 
which has been simplified very much by `pg` package
