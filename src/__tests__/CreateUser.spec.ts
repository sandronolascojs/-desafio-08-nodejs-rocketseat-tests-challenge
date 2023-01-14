import 'reflect-metadata'

import { InMemoryUsersRepository } from "../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "../shared/errors/AppError";

let inMemoryUsersRepository = new InMemoryUsersRepository();
let createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

describe(('Create User'), () => {
    it('should be able to create a new user', async () => {
        const user = await createUserUseCase.execute({
            name: 'jhon doe',
            email: 'test@test.com',
            password: '1234'
        })

        expect(user).toHaveProperty('id')
    })

    it('should not be able to create a new user with an email that already exists', async () => {
        const user = await createUserUseCase.execute({
            name: 'create same user',
            email: 'create same user@test.com',
            password: '1234'
        })

        expect(async () => {
            await createUserUseCase.execute({
                name: 'create same user',
                email: 'create same user@test.com',
                password: '1234'
            })
        }).rejects.toEqual(new AppError('User already exists', 400))
    })
})
