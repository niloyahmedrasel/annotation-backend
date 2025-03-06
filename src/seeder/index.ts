import { UserRepository } from "../repository/user";
const userRepository = new UserRepository();
import bcrypt from 'bcrypt';

export async function seed() {
    const user = await userRepository.findOne({ email: 'superAdmin@gmail.com' });

    if (!user) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('superAdminpass', saltRounds);
        await userRepository.create({
            name: 'superAdmin',
            email: 'superAdmin@gmail.com',
            password: hashedPassword,
            role: 'superAdmin'
        });

        console.log('Super admin created successfully');
    }
}
