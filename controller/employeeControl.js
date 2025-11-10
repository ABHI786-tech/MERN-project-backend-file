const mongoose = require("mongoose")
const employeeSchema = require("../models/employeesModel")
const randomInteger = require("random-int")

/// getting all employees data 
async function getEmployee(req, res) {
    try {
        const employees = await employeeSchema.find().lean()
        return res.status(200).send({ employees, message: "get employee data sucessfuly" })
    }
    catch (err) {
        res.status(404).send({ error: err, message: "Failed to fetch employee data" })
    }
}


///  creating an employee data
async function createEmployee(req, res) {
    try {
        const employee = await employeeSchema.create({...req.body, user:req.user,EmpID:'EMP'+ "000" +'ID' })
        await employee.save();
        // return res.status(200).send({ employee, message: "Employee created successfully" })
         return res.status(201).json({
      message: "Employee created successfully",
      user: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        
      },})
    }
    catch (err) {
        console.log(err)
        res.status(404).send({ error: err, message: "Failed to create employee" })

    }
}

/// delete an employee data 
async function deleteEmployee(req, res) {
    try {
        const { id } = req.params;
        const employees = await employeeSchema.findByIdAndDelete(id)
        return res.status(200).send({ employees, message: "Employee deleted successfully" })
    }
    catch (err) {
        res.status(404).send({ error: err, message: "Failed to delete employee" })
    }
}

//// update an employee data
async function updateEmployee(req, res) {
    try {
        const { id } = req.params;
        const employees = await employeeSchema.findByIdAndUpdate(id, req.body,{ new: true })
        return res.status(200).send({ employees, message: " employee updated sucessfuly" })
    }
    catch (err) {
        res.status(404).send({ error: err, message: "Failed to update employee" })
    }
}

///// get single Employee dagta 
async function getSingleEmployee(req, res) {
  try {
    const { id } = req.params;
    // console.log(id)
    const employee = await employeeSchema.findById(id);

    if (!employee) {
      return res.status(404).send({ message: "Employee not found" });
    }

    return res.status(200).send({ employee, message: "Employee fetched successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err, message: "Failed to fetch employee" });
  }
}





module.exports = {
    getEmployee, createEmployee, deleteEmployee, updateEmployee, getSingleEmployee
}