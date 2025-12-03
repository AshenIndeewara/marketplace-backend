import { Router } from "express"
import {registerUser, login} 
from "../controllers/auth.controller"
import { Role } from "../models/user.model"

const router = Router()
/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication routes
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (public)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user (public)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "ashen@mail.com"
 *               password: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
// register (only USER) - public
router.post("/register", registerUser)

// login - public
router.post("/login",  login)

export default router
