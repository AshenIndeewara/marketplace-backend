import { Router } from "express"
import { requireRole } from "../middleware/role"
import { Role } from "../models/user.model"
import { getAllItemsAdmin, getAllUsers, makeUserAdmin, removeUserAdmin } from "../controllers/admin.controller"

const router = Router()

router.get("/items",
    requireRole([Role.ADMIN]),
    getAllItemsAdmin
)

router.get("/users",
    requireRole([Role.ADMIN]),
    getAllUsers
)

router.put("/make-admin/:id",
    requireRole([Role.SUPER_ADMIN]),
    makeUserAdmin
)

router.put("/remove-admin/:id",
    requireRole([Role.SUPER_ADMIN]),
    removeUserAdmin
)
export default router