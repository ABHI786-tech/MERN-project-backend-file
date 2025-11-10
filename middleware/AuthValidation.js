const jwt = require("jsonwebtoken")
const jwt_auth_screate = process.env.JWT_SECRECTKEY

function AuthValidation (req, res, next) {

    try {

     const auth_token = req.header("authorization") || "";
    // console.log(auth_token, "auth_token");
        if (!auth_token || !auth_token.startsWith("Bearer")) {
            throw new Error("Please Login First")
        }

    //       if (!token) {
    //   throw new Error("No token provided. Please login.");
    // }
        const token = auth_token.split(" ")[1]

        if (!token) {

            throw new Error("Enter Valid Token")

        }
        const payload = jwt.verify(token,jwt_auth_screate)

        req.user = payload.id
        next()
        // console.log("auth validation is runnn")

    } catch (error) {
    console.log(error, "autheriation");

        res.status(400).send({ error: error.message })

    }
}

module.exports = AuthValidation;
