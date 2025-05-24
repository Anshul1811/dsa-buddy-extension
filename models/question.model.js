import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // Assuming you have a database.js file for Sequelize initialization

const Question = sequelize.define("Question", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userPrompt: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: "questions",
  timestamps: true, 
});

export default Question;