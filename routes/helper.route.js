import { Router } from "express";
import helperController from "../controllers/helper.controller.js";
import rateLimit from 'express-rate-limit';


const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,  
  max: 10,                  
  message: "Too many requests, please try again later."
});


const helperRoutes = Router();

helperRoutes.post("/analyze", limiter,  helperController.getResponse);
helperRoutes.get("/health", limiter, helperController.health);

export { helperRoutes };
