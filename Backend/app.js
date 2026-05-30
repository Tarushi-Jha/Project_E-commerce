import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";
import cookieParser from "cookie-parser";
// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down due to uncaught expection");
  process.exit(1);
});

//Connecting to DataBase
connectDatabase();

app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use(cookieParser());

//Import all routes
const productRoutes = await import("./routes/products.js");
const authRoutes = await import("./routes/auth.js");
const orderRoutes = await import("./routes/order.js");
const paymentRoutes = await import("./routes/payment.js");

app.use("/api/v1", productRoutes.default);
app.use("/api/v1", authRoutes.default);
app.use("/api/v1", orderRoutes.default);
app.use("/api", paymentRoutes.default);

// Using error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

//Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
