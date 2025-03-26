import express from "express";
import { validateBody } from "../middleware/bodyValidate.middleware";
import { registerValidation } from "../utils/validates/user.validate";
import { insertRegisterUser } from "../controllers/user.controller";

const router = express.Router();

router.post('/registerUser', validateBody(registerValidation), (req, res, next) => {
	insertRegisterUser(req, res).catch(next);
});

export default router;