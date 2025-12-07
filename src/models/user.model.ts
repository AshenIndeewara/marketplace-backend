import mongoose, { Schema } from "mongoose"

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SELLER = "SELLER"
}

export interface IUSER extends Document {
  _id: mongoose.Types.ObjectId
  firstname: string
  lastname: string
  address?: string
  phone: string
  email: string
  password: string
  roles: Role[]
  favoriteItems?: mongoose.Types.ObjectId[]
}

const userSchema = new Schema<IUSER>({
  email: { type: String, unique: true, lowercase: true, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  roles: { type: [String], enum: Object.values(Role), default: [Role.SELLER] },
  favoriteItems: [{ type: Schema.Types.ObjectId, ref: "Item" }]
})

export const User = mongoose.model<IUSER>("User", userSchema)
