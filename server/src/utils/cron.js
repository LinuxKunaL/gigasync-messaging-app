import { autoDeleteMediaStatus } from "../controller/user.controller.js";
import cron from "node-cron";

const cronSchedule = () => {
  // cron.schedule("* * * * * *", autoDeleteMediaStatus);
  cron.schedule("* * * * *", autoDeleteMediaStatus);
};

export default cronSchedule;
