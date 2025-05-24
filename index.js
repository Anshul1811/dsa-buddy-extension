import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sequelize from "./config/database.js";
import { helperRoutes } from "./routes/helper.route.js";
import fetch, { Headers, Request, Response } from "node-fetch";

// Make fetch API components available globally
global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(helperRoutes);

sequelize.sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully.");
})
  .catch((err) => {
    console.error("Error syncing database:", err);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});