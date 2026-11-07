import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// New uploads on the YouTube channel become draft episodes.
crons.interval("sync YouTube uploads", { hours: 1 }, internal.youtube.sync, {});

export default crons;
