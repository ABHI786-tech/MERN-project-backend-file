const mongoose = require("mongoose");

const url = process.env.MONGO_URL;

async function server(){
    try{
    await mongoose.connect(url)
    console.log("✅ Connected to MongoDB successfully")
}
catch(err){
    console.log({error: err, message:"❌ Failed to connect to MongoDB"})
}
}

module.exports = server;
