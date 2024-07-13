import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    port: process.env.PORT,
    host: process.env.HOST,
  },
  jwt: {
    key: process.env.JWT_KEY,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  database: {
    url: process.env.MONGODB_URL,
    name: process.env.MONGODB_NAME,
  },
};

export default config;
