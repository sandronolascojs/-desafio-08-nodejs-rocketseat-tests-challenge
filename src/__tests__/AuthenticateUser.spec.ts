import 'reflect-metadata'

import { InMemoryUsersRepository } from "../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../modules/users/useCases/createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from '../modules/users/useCases/authenticateUser/AuthenticateUserUseCase';
import { AppError } from "../shared/errors/AppError";

let inMemoryUsersRepository = new InMemoryUsersRepository();
let createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
let authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);

describe(('Authenticate User'), () => {
    it('should be able to authenticate an user', async ()=> {
        const user = await createUserUseCase.execute({
            name: 'authenticate an user',
            email: 'authenticateanuser@test.com',
            password: '1234'
        })

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: '1234'
        })

        expect(result).toHaveProperty('token')
    })

    it('should not be able to authenticate an nonexistent user', async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: 'notexists@test.com',
                password: '1234'
            })
        }).rejects.toEqual(new AppError('Incorrect email or password', 401))
    })
    
    it('should not be able to authenticate with incorrect password', async () => {
        const user = await createUserUseCase.execute({
            name: 'authenticate an user',
            email: 'incorrectpassword@test.com',
            password: '1234'
        })

        expect(async ()=> {
            await authenticateUserUseCase.execute({
                email: user.email,
                password: 'passwordincorrect'
            })
        }).rejects.toEqual(new AppError('Incorrect email or password', 401))
    })
})