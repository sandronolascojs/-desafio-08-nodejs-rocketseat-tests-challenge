import 'reflect-metadata'

import { CreateStatementUseCase } from "../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { InMemoryStatementsRepository } from "../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateStatementDTO } from "../modules/statements/useCases/createStatement/ICreateStatementDTO";
import { OperationType } from "../modules/statements/entities/Statement";
import { CreateUserUseCase } from "../modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "../shared/errors/AppError";


let inMemoryStatementsRepository = new InMemoryStatementsRepository();
let inMemoryUsersRepository = new InMemoryUsersRepository();
let createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
let createStatementUseCase = new CreateStatementUseCase(
    inMemoryUsersRepository,
    inMemoryStatementsRepository
);


describe('Create Statement', () => {
    
   it('should be able to create a new statement', async () => {
        const user = await createUserUseCase.execute({
            name: 'jhon doe',
            email: 'test@test.com',
            password: '1234'
        })

        const statement: ICreateStatementDTO = {
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: 'deposit test'
        }

        
        const result = await createStatementUseCase.execute(statement)

        expect(result).toHaveProperty('id')
   })

    it('should not be able to create a new statement with a non-existent user', async () => {
        expect(async () => {
            const statement: ICreateStatementDTO = {
                user_id: 'non-existent user',
                type: OperationType.DEPOSIT,
                amount: 100,
                description: 'deposit test'
            }
    
            await createStatementUseCase.execute(statement)
        }).rejects.toEqual(new AppError('User not found', 404))
    })

    it('should not be able to create a new statement with insufficient funds', async () => {
        const user = await createUserUseCase.execute({
            name: 'withdrow test',
            email: 'test1@test1.com',
            password: '1234'
        })

        expect(async () => {
            const statement: ICreateStatementDTO = {
                user_id: user.id as string,
                type: OperationType.WITHDRAW,
                amount: 100,
                description: 'withdraw test'
            }

            await createStatementUseCase.execute(statement)
        }).rejects.toEqual(new AppError('Insufficient funds', 400))
    })
})