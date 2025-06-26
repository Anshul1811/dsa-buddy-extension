import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Question from "../models/question.model.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

let helperController = {
  health: async (req, res) => {
    try {
      return res.status(200).json({'message': 'All Good!!'});
    } catch (error) {
        return res.status(500).json({ error: "Something went wrong", details: error.message });
    }
  },
 
  getResponse: async (req, res) => {
    try {
        const { question, description, code, userPrompt } = req.body;

        await Question.create({ question, userPrompt });

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const prompt = `You are assisting a user solving a DSA problem on LeetCode.
            
        Problem Title: ${question}
        Problem Description: ${description}
        User Code:
        ${code}
        
        User's Question:
        ${userPrompt}
        
        Provide a helpful, clear response analyzing their code and addressing their question.`;
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        res.json({ output: text });
        } catch (err) {
        console.error("Error analyzing code:", err);
        res.status(500).json({ error: "Something went wrong", details: err.message });
        }
    }
};

export default helperController;