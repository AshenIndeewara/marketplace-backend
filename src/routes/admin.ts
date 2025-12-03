import { Router } from "express"
import { requireRole } from "../middleware/role"
import { Role } from "../models/user.model"
import { getAllItemsAdmin, getAllUsers, makeUserAdmin, removeUserAdmin } from "../controllers/admin.controller"

const router = Router()
/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin-only operations
 */

/**
 * @swagger
 * /admin/items:
 *   get:
 *     summary: Get all items (ADMIN only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Items fetched
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (ADMIN only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched
 */

/**
 * @swagger
 * /admin/make-admin/{id}:
 *   put:
 *     summary: Make a user ADMIN (SUPER_ADMIN only)
 *     tags: [Admin]
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
 *         description: User promoted to ADMIN
 */

/**
 * @swagger
 * /admin/remove-admin/{id}:
 *   put:
 *     summary: Remove ADMIN role (SUPER_ADMIN only)
 *     tags: [Admin]
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
 *         description: User demoted
 */

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