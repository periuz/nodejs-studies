import { UsersRepository } from "@/repositories/users-repository"
import { hash } from "bcryptjs"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"
import { User } from "generated/prisma"

interface RegisterUseCaseRequest {
    name: string,
    email: string,
    password: string
}

interface RegisterUseCaseResponse {
    user: User
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute ({
        name, 
        email, 
        password,
    }: RegisterUseCaseRequest): Promise <RegisterUseCaseResponse> {
        const password_hash = await hash(password, 6) // Number of salt rounds - more rounds = harder to decrypt

    // Dont let user registry same email 

        const userWithSameEmail = await this.usersRepository.findByEmail(email)

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError()
        }

        // const prismaUserRepository = new PrismaUsersRepository()

        const user = await this.usersRepository.create({
            name,
            email,
            password_hash,
        })

        return {
            user,
        }
    }
}

