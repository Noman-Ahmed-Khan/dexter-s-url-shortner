const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
require("dotenv").config();



const createtoken = (userID,userRole) => jwt.sign({ id: userID,role:userRole  }, process.env.JWT_SECRET, { expiresIn: '1d' });

register = async (req, res) => {
    const { first_name,last_name,email,password,gender,job } = req.body;
    
    if (!first_name || !last_name || !email || !gender || !password || !job) {
        return res.status(400).json({ status: "error", message: "Missing required fields" });
    }

    const newUser = new UserModel({
        first_name:first_name,
        last_name:last_name,
        email:email,
        password:await bcrypt.hash(password, 10),
        gender:gender,
        job:job
    }) 
    newUser.save();
    const token = createtoken(newUser._id,newUser.role);
    res.cookie('token', token, {
        httpOnly :true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    }).status(201).json({
        status: 'success'
    });
};

login=async(req,res)=>{
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({status: "error", message: "Missing required fields"})
    }   
    
    const user=await UserModel.findOne({email: email});
    
    if(!user || !(await bcrypt.compare(password, user.password))){
        return res.status(401).json({ status:'error', message: 'Invalid credentials'})
    }
    const token = createtoken(user._id,user.role);
    // res.json({token});
    res.cookie('token', token,{
        httpOnly :true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    }).status(200).json({
        status: 'success' 
    });
};


logout = (req, res) => {
    // not strickly necessary for bearer token auth
    res.clearCookie('token');
    res.clearCookie('csrfToken');
    res.status(200).json({ message: 'Logged out' });
};

get_all_users = async (req,res)=>{
    const allusers = await UserModel.find({}).select('-password -__v');
    return res.json(allusers)
}

get_user_by_id = async (req,res)=>{
    const user = await UserModel.findById(req.params.id).select('-password -__v');
    if(!user) return res.status(400).json({ status: "error", message: "Missing required fields" }); 
    return res.json(user);
}

patch_user_by_id= async (req,res)=>{
    // edit a user
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updated_data = {
        ...(req.body.first_name && { first_name: req.body.first_name }),
        ...(req.body.last_name && { last_name: req.body.last_name }),
        ...(req.body.email && { email: req.body.email }),
        ...(req.body.password && { password: await bcrypt.hash(req.body.password, 10) }),
        ...(req.body.gender && { gender: req.body.gender }),
        ...(req.body.job && { job: req.body.job }),
        ...(req.body.role && { role: req.body.role }),
    };

    const updated_user=await UserModel.findByIdAndUpdate(req.params.id, updated_data, { new: true })
    return res.status(200).json({status: "updated",...updated_user.toJSON()});
}

delete_user_by_id = async (req,res)=>{
    const user= await UserModel.findByIdAndDelete(req.params.id,{new: true})
    return res.status(200).json({status:"deleted", ...user.toJSON()});
}

promote_user_by_id = async (req,res)=>{
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = 'admin';
    await user.save();
    
    return res.status(200).json({status: "success", message: "User promoted to admin", user});
}

module.exports={
    get_all_users,
    get_user_by_id,
    patch_user_by_id,
    delete_user_by_id,
    promote_user_by_id,
    register,
    login,
    logout,
}