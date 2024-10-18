import http from "http";
import cors from "cors";
import Express from "express";
import config from "../config/config.js";
import defaultRoutes from "./routes/default.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import connection from "../database/connection.js";
import verifyToken from "./middleware/verifyToken.js";
import { Server } from "socket.io";
import socketConnection from "./socket/socketConnection.js";
import cronSchedule from "./utils/cron.js";

const app = Express();

const server = http.createServer(app);

export const io = new Server(server, {
  maxHttpBufferSize: 1e8,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const socket = new socketConnection(io);
socket.connect();

app.use(cors());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use("/api/default", defaultRoutes);
app.use("/api/auth", verifyToken, authRoutes);
app.use("/api/user", verifyToken, userRoutes);

console.clear();
connection();
cronSchedule();

server.listen(config.server.port, () => {
  console.log(`Server started on port ${config.server.port}`);
});

//module.exports = app;
export default app;
// Just This Minor Change Needed for running backend
