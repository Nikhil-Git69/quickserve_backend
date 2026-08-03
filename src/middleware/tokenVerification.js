import User from "../model/User.js";
import config from "../utils/config.js";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";


const isVerifiedUser = async (req, res, next) => {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            const error = createHttpError(401, "Access token not found!");
            return next(error);
        }

        const decodeToken = jwt.verify(accessToken, config.accessTokenSecret);

        const user = await User.findById(decodeToken._id);
        if (!user) {
            const error = createHttpError(401, "User does not exist!");
            return next(error);
        }

        req.user = user;
        next();

    }
    catch (error) {
        const err = createHttpError(401, "Invalid Token!")
        next(err);
    }
}


export default isVerifiedUser 
