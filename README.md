# Blog Backend
This repo is the backend for a blog API. It supports CRUD operations for blog objects with a Title, Date, and Body,
under the assumption that one User is going to use it to build a front end and contribute articles.

# How To Use
This repository expects three environment variables to be setup:
## PORT
An environment variable of PORT must be set to indicate what port the server should be running on. When running locally,
3000 or 8080 is recommended.
## MONGO_URI
An environment variable of MONG_URI should be specified that indicates what the URL of the Mongo database should be. When
developing locally, it's advised to use the default mongodb://localhost:27017/<db-name>, where <db-name> is whatever you want
to call your test database.
## ORIGINS
The app will not accept any requests from an origin not specified in the environment variable ORIGINS, using space-separated
names. As an example, "localhost 127.0.0.1" will mean the app will recognize the origins "localhost" and "127.0.0.1". Any
requests made from any other domains will be rejected with a 401 status code.

## Running tests
Make sure MongoDB has been installed on your computer, you are running an instance of Mongo in a shell, and you have specified
the URI to the Mongo instance in your MONGO_URI environment variable, as specified above.
After that, make sure you have installed all Node modules by running `npm i`, then run the command `npm test`. If all code
passes the linter and has 100% code coverage, tests will pass. Otherwise, the process will exit with a code of 1, indicating
a failure.
