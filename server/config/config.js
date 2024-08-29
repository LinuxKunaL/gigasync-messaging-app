import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    port: process.env.PORT,
    host: `${process.env.HOST}:${process.env.PORT}`,
  },
  jwt: {
    key: process.env.JWT_KEY,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  database: {
    url: process.env.MONGODB_URL,
    name: process.env.MONGODB_NAME,
  },
  googleSMTP: {
    host: process.env.GOOGLE_SMTP_HOST,
    port: process.env.GOOGLE_SMTP_PORT,
    user: process.env.GOOGLE_SMTP_USER,
    pass: process.env.GOOGLE_SMTP_PASS,
  },
};

export default config;
