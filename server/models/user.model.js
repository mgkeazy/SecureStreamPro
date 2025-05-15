import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
config();
import jwt from 'jsonwebtoken';

const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required: [true, "Please enter your email"],
        validate:{
            validator: (value) =>{
                return emailRegexPattern.test(value)
            },
            message: "Please enter a valid email address"
        },
        unique:true
    },
    password:{
        type:String,
        minlength : [6, "Password must be atleast 6 characters"],
        select: false
    },
    avatar:{
        public_id:String,
        url:String,
    },
    role:{
        type:String,
        default : "user"
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    courses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course", // This should match the name of the model you exported
        }
      ]
      
},{timestamps:true});


// sign access token
userSchema.methods.SignAccessToken = function () {
    return jwt.sign(
        {id:this._id},
        process.env.ACCESS_TOKEN || '',
    )
}

//sign refresh token
userSchema.methods.SignRefreshToken = function () {
    return jwt.sign(
        {id:this._id},
        process.env.REFRESH_TOKEN || '',
    )
}

//Hash Password
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

const userModel = mongoose.model("user",userSchema);
export default userModel;


