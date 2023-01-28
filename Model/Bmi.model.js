const mongoose=require("mongoose")


const bmiSchema=new mongoose.Schema({
    BMI:Number,
    height:String,
    weight:String,
    userId:String

}
,{
    timestamps:true
})
const bmiModel=mongoose.model("bmi",bmiSchema)

module.exports={
    bmiModel
}