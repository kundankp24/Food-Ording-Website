import express, {Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import myUserRoute from './routes/MyUserRoute';
import myRestaurantRoute from './routes/MyRestaurantRoutes';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import restaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";

const app= express();

//database connection
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=> console.log('Connected to database'));

//Cloudinary setup
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Middileware
app.use(cors());

//middileware for webhook
app.use("/api/order/checkout/webhook", express.raw({type: "*/*"}));
app.use(express.json());

//starting endpoint for User
app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/order",orderRoute);

app.listen(7000, () => {
    console.log("server started on localhost:7000");
});


