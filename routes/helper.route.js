import { Router } from "express";
import helperController from "../controllers/helper.controller.js";
import rateLimit from 'express-rate-limit';


const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // Time window: 1 minute (in ms)
  max: 20,                  // Limit: max 10 requests per IP in that time
  message: "Too many requests, please try again later.", // Response if limit exceeded
});


const helperRoutes = Router();

helperRoutes.post("/analyze", limiter,  helperController.getResponse);
helperRoutes.get("/health", limiter, helperController.health);

export { helperRoutes };
