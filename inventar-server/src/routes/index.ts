import { Router } from "express";
import Users from "./users";
import Inventory from "./inventory";
import userRequireMiddleware from "../middleware/userRequire";

const router = Router();

router.use(userRequireMiddleware);

router.use("/users", Users);
router.use("/inventory", Inventory);

export default router;
