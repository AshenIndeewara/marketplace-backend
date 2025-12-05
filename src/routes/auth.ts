import { Router } from "express"
import { registerUser, login }
    from "../controllers/auth.controller"
import { Role } from "../models/user.model"

const router = Router()

// register (only USER) - public
router.post("/register", registerUser)

// login - public
router.post("/login", login)

export default router
