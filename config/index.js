module.exports = {
    jwt: {
        secretKey: process.env.JWT_SECRET_KEY
    },
    mongoose: {
        url: process.env.MONGO_URL,
        test_url: process.env.MONGO_TEST_URL,
    }
}
