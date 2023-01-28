const fs=require("fs");
const express=require("express");
const app=express();
const {UserModel}=require("./Model/User.model")
const {bmiModel} =require("./Model/Bmi.model")
const {connection}=require("./config/db")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()
const cors = require('cors')
app.use(express.json())
app.use(cors())
app.use(cors({
    origin : "*"
}))



app.get("/",async(req,res)=>{
    const user=await UserModel.find()
    res.send(user)
})
app.get("/getprofile",async(req,res)=>{
    const {user_id}=req.body
    const user=await UserModel.findOne({_id:user_id})
    const {name,email}=user
    res.send({name,email})
})

app.post("/signup", async (req, res) => {
    const {name,email, password} = req.body;
    const userPresent = await UserModel.findOne({email})
    if(userPresent){
        res.send("Try loggin in, already exist")
    }
    try{
        bcrypt.hash(password, 4, async function(err, hash) {
            const user = new UserModel({name,email,password:hash})
            await user.save()
            res.send("Sign up successfull")
        });
       
    }
   catch(err){
        console.log(err)
        res.send("Something went wrong, pls try again later")
   }
})




app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await UserModel.find({email})
         
      if(user.length > 0){
        const hashed_password = user[0].password;
        bcrypt.compare(password, hashed_password, function(err, result) {
            if(result){
                const token = jwt.sign({"userID":user[0]._id}, 'hush');
                res.send({"msg":"Login Successfull","token" : token})
            }
            else{
                res.send("Login failed")
            }
      })} 
      else{
        res.send("Login failed")
      }
    }
    catch{
        res.send("Something went wrong, please try again later")
    }
})





app.post("/calbmi",async(req,res)=>{
    const {height,weight}=req.body
    const height_mtr=Number(height)*0.3048
    const BMI=Number(weight)/(height_mtr)**2
    const new_bmi=new bmiModel({

    })
    await new_bmi.save()
    res.send({BMI})

})
app.get("/getbmi",async(req,res)=>{
    const {user_id}=req.body
    const all_bmi=await bmiModel.find({user_id})
    res.send({all_bmi})

})

app.listen(process.env.Port,async()=>{
    try{
        await connection;
        console.log('connected DB')
    }catch(err){
        console.log(err);
        console.log('something went wrong')
    }
    console.log(`listening on port ${process.env.Port}`)
})