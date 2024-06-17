
### Instructions to run the server
Clone this repository and follow the below instructions to run the server locally.

1. Create a .env file in the root directory and add the following variables:

```
MONGO_URL = '<Mongo-DB-Connection-URL>'
MONGO_TEST_URL = '<Mongo-DB-Connection-URL-(Test)>'
JWT_SECRET_KEY = '<JWT-private-or-secret-key>'
```

2. Run the following command to install all the dependencies. This assumes that NPM and NodeJs are installed in your system. If not, refer [here](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs).

```
npm i
```

3. Run the server using the following command on port 3000.

```
npm start
```


### Instructions to run the tests

1. To run the tests and create the coverage, run the following command

```
npm test
```
