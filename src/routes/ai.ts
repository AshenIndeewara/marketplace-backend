import { Router } from "express"
import { aiSearch, embedAllItems } from "../controllers/ai.controller"
import { authenticate } from "../middleware/auth"

const router = Router()

router.post(
    "/search",
    aiSearch)

router.get(
    "/generate-item-embedding",
    authenticate,
    embedAllItems)

export default router