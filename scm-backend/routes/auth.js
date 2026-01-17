import e from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = e.Router();

router.post('/register', register);
router.post('/login', login);

export default router;