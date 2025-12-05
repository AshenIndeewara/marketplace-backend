import { Router } from "express"
import { requireRole } from "../middleware/role"
import { Role } from "../models/user.model"
import { getMyItems } from "../controllers/seller.controller"

const router = Router()

router.get("/my-items",
    requireRole([Role.SELLER]),
    getMyItems
)

export default router