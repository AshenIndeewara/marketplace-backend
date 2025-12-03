import { Router } from "express"
import { approveItem, createItem, deleteItem, editItem, getAllItems, getItemById, getItemsByCategory, markAsSold, rejectItem, searchItems } from "../controllers/item.controller"
import { upload } from "../middleware/upload"
import { requireRole } from "../middleware/role"
import { Role } from "../models/user.model"

const router = Router()
/**
 * @swagger
 * tags:
 *   - name: Item
 *     description: Item management
 */

/**
 * @swagger
 * /item/add:
 *   post:
 *     summary: Add new item
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               itemName:
 *                 type: string
 *               itemPrice:
 *                 type: number
 *               itemDescription:
 *                 type: string
 *               itemCategory:
 *                 type: string
 *               itemSubCategory:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item added
 */

/**
 * @swagger
 * /item/all:
 *   get:
 *     summary: Get all items
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Items fetched
 */

/**
 * @swagger
 * /item/update/{id}:
 *   put:
 *     summary: Update item
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 */

/**
 * @swagger
 * /item/delete/{id}:
 *   delete:
 *     summary: Delete item
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */

/**
 * @swagger
 * /item/{id}:
 *   get:
 *     summary: Get item by ID
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item fetched
 */

/**
 * @swagger
 * /item:
 *   get:
 *     summary: Search items
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Items fetched
 */

/**
 * @swagger
 * /item/{category}/{subCategory}:
 *   get:
 *     summary: Get items by category
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: subCategory
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category items fetched
 */

/**
 * @swagger
 * /item/approve/{id}:
 *   put:
 *     summary: Approve item
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Approved
 */

/**
 * @swagger
 * /item/reject/{id}:
 *   put:
 *     summary: Reject item
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rejected
 */

/**
 * @swagger
 * /item/sold/{id}:
 *   put:
 *     summary: Mark item as sold
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Marked as sold
 */

router.post("/add",
    requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SELLER]),
    upload.array("images"),
    createItem
)

router.get("/all",
    requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SELLER]),
    getAllItems
)

router.put("/update/:id",
    requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SELLER]),
    upload.array("images"),
    editItem
)

router.delete("/delete/:id",
    requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SELLER]),
    deleteItem
)

router.get("/:id",
    requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SELLER]),
    getItemById
)

router.get("/",
    requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SELLER]),
    searchItems
)

//get items by category
router.get("/:category/:subCategory",
    requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SELLER]),
    getItemsByCategory
)

// approve item
router.put("/approve/:id",
    requireRole([Role.SUPER_ADMIN, Role.ADMIN]),
    approveItem
)

//reject item
router.put("/reject/:id",
    requireRole([Role.SUPER_ADMIN, Role.ADMIN]),
    rejectItem
)

//make as sold
router.put("/sold/:id",
    requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SELLER]),
    markAsSold
)

export default router