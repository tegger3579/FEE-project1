import express from "express";

import { noteRoutes } from "./routes/noteRoutes.js";
import { CONFIG } from "./config.js";

export const app = express();

app.use(express.static(CONFIG.public));

app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile("/index.html", { root: CONFIG.public });
});

app.use((req, res, next) => {
  console.log(req.auth || "no user");
  next();
});
app.use("/notes", noteRoutes);

app.use(function (err, req, res, next) {
  next(err);
});
