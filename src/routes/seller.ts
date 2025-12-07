import { Router } from "express"
import { requireRole } from "../middleware/role"
import { Role } from "../models/user.model"
import { addFavoriteItem, deleteFavoriteItem, getFavoriteItems, getMyItems } from "../controllers/seller.controller"

const router = Router()

router.get("/my-items",
    requireRole([Role.SELLER]),
    getMyItems
)

router.post("/favorite-item/:itemId",
    requireRole([Role.SELLER]),
    addFavoriteItem
)

//delete favorite item
router.delete("/favorite-item/:itemId",
    requireRole([Role.SELLER]),
    deleteFavoriteItem
)

router.get("/favorite-items",
    requireRole([Role.SELLER]),
    getFavoriteItems
)

export default router