import { Router } from "express"
import { requireRole } from "../middleware/role"
import { Role } from "../models/user.model"
import { getMyItems } from "../controllers/seller.controller"

const router = Router()
/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Item management endpoints
 */
/**
 * @swagger
 * /items/my-items:
 *   get:
 *     summary: Get all items created by the logged-in seller
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of seller's own items
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - only SELLER role allowed
 */

//get My Items for seller
router.get("/my-items",
    requireRole([Role.SELLER]),
    getMyItems
)

export default router