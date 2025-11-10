const express = require("express");
const employeeController = require("../controller/employeeControl")
const router = express.Router();
const { AddEmployeeValidation } = require("../validation/main.validation")
const AuthValidation = require("../middleware/AuthValidation")


// console.log("🧠 AddEmployeeValidation:", AddEmployeeValidation);
// console.log("🧠 employeeController.createEmployee:", employeeController.createEmployee);

// create employee
router.post("/addemployee", AddEmployeeValidation, AuthValidation,employeeController.createEmployee)

// all employee
router.get("/allemployee",AuthValidation,employeeController.getEmployee)

// delete employee
router.delete("/employee/:id",AuthValidation, employeeController.deleteEmployee)

// update get single employee and update employee
router.put("/updateemployee/:id",AuthValidation, employeeController.updateEmployee)
router.get("/updateemployee/:id",AuthValidation, employeeController.getSingleEmployee)





module.exports = router;