import { Router } from "express"
import { approveItem, createItem, deleteItem, editItem, getAllCategories, getAllItems, getItemById, getItemsByCategory, markAsSold, rejectItem, searchItems } from "../controllers/item.controller"
import { upload } from "../middleware/upload"
import { requireRole } from "../middleware/role"
import { Role } from "../models/user.model"
import { authenticate } from "../middleware/auth"

const router = Router()

router.post("/add",
    authenticate,
    requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SELLER]),
    upload.array("images"),
    createItem
)

router.get("/all",
    authenticate,
    getAllItems
)

router.put("/update/:id",
    authenticate,
    requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SELLER]),
    upload.array("images"),
    editItem
)

router.delete("/delete/:id",
    authenticate,
    requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SELLER]),
    deleteItem
)

router.get("/categories",
    getAllCategories
)

router.get("/:id",
    authenticate,
    requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SELLER]),
    getItemById
)

router.get("/",
    searchItems
)

//get items by category
router.get("/:category/:subCategory",
    getItemsByCategory
)

// approve item
router.put("/approve/:id",
    authenticate,
    requireRole([Role.SUPER_ADMIN, Role.ADMIN]),
    approveItem
)

//reject item
router.put("/reject/:id",
    authenticate,
    requireRole([Role.SUPER_ADMIN, Role.ADMIN]),
    rejectItem
)

//make as sold
router.put("/sold/:id",
    authenticate,
    requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SELLER]),
    markAsSold
)

export default router