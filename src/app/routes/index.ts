import express from "express";
import { TestRoutes } from "../modules/testModule/test.route";
import UserRoutes from "../modules/user/user.route";
import AuthRoutes from "../modules/auth/auth.route";
import AssigmentRouter from "../modules/assignment/assignment.route";
import submissionRouter from "../modules/submission/submission.route";


const router = express.Router();

const moduleRoutes = [
  {
    path: "/test",
    route: TestRoutes,
  },
  {
    path: "/user",
    route: UserRoutes
  },
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/assigment",
    route: AssigmentRouter
  },
  {
    path: "/submission",
    route: submissionRouter
  }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;