
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { Role, User, IUSER } from "../models/user.model"
import { Request, Response } from "express"
import { signAccessToken, signRefreshToken } from "../utils/tokens"

dotenv.config()

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, address, phone, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email exists" })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await User.create({
        firstname,
        lastname,
        address,
        phone,
        email,
        password: hash,
        roles: [Role.SELLER]
    })

    res.status(201).json({
      message: "User registed",
      data: { email: user.email, roles: user.roles }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: "Internal; server error"
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const existingUser = (await User.findOne({ email })) as IUSER | null
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const valid = await bcrypt.compare(password, existingUser.password)
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const accessToken = signAccessToken(existingUser)
    const refreshToken = signRefreshToken(existingUser)

    res.status(200).json({
      message: "success",
      data: {
        email: existingUser.email,
        roles: existingUser.roles,
        accessToken,
        refreshToken
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: "Internal server error"
    })
  }
}