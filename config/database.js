import { Sequelize } from "sequelize";
import config from "./local_config.js";

const sequelize = new Sequelize(
  config.mysql.database,
  config.mysql.user,
  config.mysql.password,
  {
    host: config.mysql.host,
    port: config.mysql.port,
    dialect: "mysql",
    logging: false, // Disable logging; set to true for debugging
  }
);

export default sequelize;