const express = require("express")
const userController = require("../controller/authController")
const router = express.Router();
const { RegisterUserValidation } = require("../validation/main.validation")
const validationMiddleware = require("../middleware/validationMiddleware")
const AuthValidation = require("../middleware/AuthValidation")
const { LoginUserValidation } = require("../validation/main.validation")




// console.log("🧠 RegisterUserValidation:", RegisterUserValidation);
// console.log("🧠 LoginUserValidation:", LoginUserValidation);
// console.log("🧠 AuthValidation:", AuthValidation);
// console.log("🧠 validationMiddleware:", validationMiddleware);
// console.log("🧠 userController.userRegister:", userController.userRegister);
// console.log("🧠userController.userLogin::", userController.userLogin);
//  console.log("🧠 AuthValidation:", AuthValidation);


// register page
router.post("/register", RegisterUserValidation, validationMiddleware, userController.userRegister)

// profile page
router.get("/profile",AuthValidation,userController.userProfile)

// login page 
router.post("/login", LoginUserValidation,validationMiddleware,userController.userLogin)

// forget page
router.post("/forgetpassword", userController.Forgetpassword)

// reset password page
router.post('/resetpassword', userController.resetpassword)



module.exports = router;