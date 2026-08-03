import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import config from "../utils/config.js";
import mongoose from "mongoose";




const register = async (req, res, next) => {
    try {
        const { name, phone, email, password, role } = req.body;

        if (!name || !phone || !email || !password || !role) {
            return next(createHttpError(400, "All fields are required!"));
        }

        const isAdmin = role === 'Admin';

        const isUserPresent = await User.findOne({ email });

        if (isUserPresent) {
            return next(createHttpError(400, "User already exists!"));
        }

        const newUser = new User({
            name,
            phone,
            email,
            password,
            isAdmin,
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

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = createHttpError(400, "All fields are required!");
            return next(error);
        }

        const isUserPresent = await User.findOne({ email });

        if (!isUserPresent) {
            const error = createHttpError(401, "Invalid Credentials ");
            return next(error);
        }
        const isMatch = await bcrypt.compare(password, isUserPresent.password);

        if (!isMatch) {
            const error = createHttpError(401, "Invalid Credentials!");
            return next(error);
        }

        const accessToken = jwt.sign({ _id: isUserPresent._id }, config.accessTokenSecret, {
            expiresIn: '1d'
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 1,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })

        res.status(200).json({ success: true, message: "User login successfully!", data: isUserPresent })


    }
    catch (e) {
        next(e);
    }

}



const setUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { role } = req.body;

        if (id === userId) {
            const error = createHttpError(400, "You cannot change your own role!");
            return next(error);
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = createHttpError(400, "Invalid User Id!");
            return next(error);
        }

        if (!role) {
            const error = createHttpError(400, "Role is required!");
            return next(error);
        }

        const isAdmin = role === 'Admin';

        const user = await User.findByIdAndUpdate(id, { isAdmin }, { new: true });

        if (!user) {
            const error = createHttpError(404, "User not found!");
            return next(error);
        }

        res.status(200).json({ success: true, message: "User role updated successfully!", data: user });
    }
    catch (error) {
        next(error);
    }
}

const getUserData = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({ success: true, data: user });


    }
    catch (error) {
        next(error)
    }
}

const getAllUserData = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, message: "Fetched all users data", data: users });

    }
    catch (error) {
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(req.user)
        const userId = req.user.id;

        if (id === userId) {
            const error = createHttpError(404, "You cannot delete your own account!");
            return next(error);
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = createHttpError(404, "Invalid Category Id!");
            return next(error);
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            const error = createHttpError(404, "User not found!");
            return next(error);
        }

        res.status(200).json({ success: true, message: "User successfully deleted!" });
    }
    catch (error) {
        next(error);
    }
}


const logout = async (req, res, next) => {
    try {
        res.clearCookie('accessToken')
        res.status(200).json({ success: true, message: "User LoggedOut!" })
    }
    catch (error) {
        next(error);
    }
}



export { register, login, getUserData, logout, getAllUserData, deleteUser, setUserRole };
