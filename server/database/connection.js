import mongoose from "mongoose";
import config from "../config/config.js";

const connection = async () => {
  try {
    await mongoose.connect(`${config.database.url}/${config.database.name}`);
    console.log(`Database connected to ${config.database.name}`);
  } catch (error) {
    console.log(`error in database ${error}`);
  }
};

export default connection;
