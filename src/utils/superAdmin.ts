import { User, Role} from "../models/user.model";
import bcrypt from "bcryptjs"
export const createSuperAdminIfNotExists = async () => {
    try {
        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL as string;
        const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD as string;
        let superAdmin = await User.findOne({ email: superAdminEmail });
        if (!superAdmin) {
            const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
            superAdmin = new User({
                firstname: "Super",
                lastname: "Admin",
                email: superAdminEmail,
                password: hashedPassword,
                phone: "0000000000",
                roles: [Role.SUPER_ADMIN, Role.ADMIN]
            });
            await superAdmin.save();
            console.log("Super admin created");
        } else {
            console.log("Super admin already exists");
        }
    } catch (error) {
        console.error("Error creating super admin:", error);
    }
};