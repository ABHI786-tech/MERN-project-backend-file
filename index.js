const app = require('express')();
const dotenv = require("dotenv").config();
const server = require("./config/config");
const port = process.env.PORT;
const bodyParser = require("body-parser")
const employeeRouter = require("./router/employeesRouter")
const userRouter = require("./router/authRouter")
const cors = require("cors")

app.use(bodyParser.json())
app.use(cors());       


app.use("/", employeeRouter )
app.use("/", userRouter)



app.get("/",(req, res)=>{
    res.status(200).send("hello world")
})



server().then(()=>{
    app.listen(port,()=>{
        console.log("server is running")
    })
})


