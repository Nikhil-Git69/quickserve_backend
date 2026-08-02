import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import config from "./utils/config.js";
import errorHandler from "./middleware/errorHandler.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import orderRoute from "./routes/orderRoute.js"
import tableRoute from "./routes/tableRoute.js"
import checkoutRoute from "./routes/checkoutRoute.js"
import categoryRoute from "./routes/categoryRoutes.js"
import menuRoute from "./routes/menuRoutes.js"
import cors from "cors";


dotenv.config();
const app = express();

connectDB();

//middlewares
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const PORT = config.port;

app.get("/",(req, res) =>
{
    res.send({message: "POS system is online!"})
})

app.use("/api/user", userRoute);
app.use("/api/order", orderRoute);
app.use("/api/table", tableRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/category", categoryRoute);
app.use("/api/menu", menuRoute);

console.log(config.nodeEnv);

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`POS System is up and running! at ${PORT} `)
})