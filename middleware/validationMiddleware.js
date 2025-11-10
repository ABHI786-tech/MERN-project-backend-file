const { validationResult } = require("express-validator");


function validationMiddleware(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
     
      return res.status(400).send({ error: errors.array()[0].msg });
    }

    next(); 
  } catch (err) {
    console.log("error will shown in validation")
    next(err);
  }
}

module.exports = validationMiddleware;
