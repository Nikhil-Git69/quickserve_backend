import createHttpError from "http-errors";

const isAdminUser = async (req, res, next) => {
    try {
        if (!req.user) {
            const error = createHttpError(401, "User not authenticated!");
            return next(error);
        }

        if (!req.user.isAdmin) {
            const error = createHttpError(403, "Access denied! Admin privileges required.");
            return next(error);
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default isAdminUser;
