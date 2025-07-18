import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectMongoDB from "./config/mongodb.js"; 
import { helperRoutes } from "./routes/helper.route.js";
import fetch, { Headers, Request, Response } from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// Make fetch API components available globally
global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(helperRoutes);

// Connect to MongoDB
connectMongoDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on ${port}`);
  });
}).catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
});