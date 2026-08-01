import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import config from "../utils/config.js";




const register = async (req, res, next) => {
    try {
        const { name, phone, email, password, role } = req.body;

        if (!name || !phone || !email || !password || !role) {
            return next(createHttpError(400, "All fields are required!"));
        }

        const isUserPresent = await User.findOne({ email });

        if (isUserPresent) {
            return next(createHttpError(400, "User already exists!"));
        }

        const newUser = new User({
            name,
            phone,
            email,
            password,
            role,
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "New User created!",
            data: newUser,
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {

    try{
        const {email, password } = req.body;

        if(!email || !password) {
            const error = createHttpError(400, "All fields are required!");
            return next(error);
        }

        const isUserPresent = await User.findOne({email});

        if(!isUserPresent){
            const error = createHttpError(401, "Invalid Credentials ");
            return next(error);
        }
        const isMatch = await bcrypt.compare(password,isUserPresent.password);

        if(!isMatch){
            const error = createHttpError(401, "Invalid Credentials!");
            return next(error);
        }
        
        const accessToken = jwt.sign({_id: isUserPresent._id}, config.accessTokenSecret, {
            expiresIn: '1d'
        });

        res.cookie('accessToken', accessToken, {
            maxAge:1000 * 60 * 60 *24 * 30, 
            httpOnly:true,
            sameSite: 'none' ,
            secure: true
        })

        res.status(200).json({ success: true, message:"User login successfully!", data: isUserPresent})
        

    }
    catch(e)
    {
        next(e);
    }

}



const getUserData = async (req,res, next) => {
    try{
        const user = await User.findById(req.user._id);
        res.status(200).json({success: true, data: user  });


    }
    catch(error){
        next(error)
    }
}


const logout = async (req, res, next) => {
    try{
        res.clearCookie('accessToken')
        res.status(200).json({success: true, message: "User LoggedOut!"})
    }
    catch(error){
        next(error);
    }
}



export {register, login, getUserData, logout};
