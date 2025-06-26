import dotenv from "dotenv";

dotenv.config();

const config = {
  mongodb: {
    uri: process.env.MONGO_URI,
  },
};

export default config;