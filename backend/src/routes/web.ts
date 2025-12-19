import { Router, Express } from "express";
import express from "express";
import { get } from "http";
import {
  getHomePage,
  getCreateUserPage,
  postCreateUser,
} from "../controllers/user.controller";
import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

const webRoutes = (app: Express) => {
  const router = express.Router(); // import router https://expressjs.com/en/guide/routing.html#express-router

  router.get("/hoidanit", (req, res) => {
    try {
      console.log("Accessing hoidanit route");
      res.render("home");
    } catch (error) {
      console.error("Error in hoidanit route:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Định nghĩa các route
  router.get("/", getHomePage);
  router.get("/create-user", postCreateUser);
  router.post("/handle-create-user", postCreateUser);

  // QUAN TRỌNG: Gắn router vào app
  return app.use("/", router);

  app.use("/", router);
};

export default webRoutes;
