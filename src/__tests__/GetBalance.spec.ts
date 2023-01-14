import 'reflect-metadata'

import { CreateStatementUseCase } from "../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { InMemoryStatementsRepository } from "../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateStatementDTO } from "../modules/statements/useCases/createStatement/ICreateStatementDTO";
import { OperationType } from "../modules/statements/entities/Statement";
import { CreateUserUseCase } from "../modules/users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from '../modules/statements/useCases/getBalance/GetBalanceUseCase';
import { AppError } from "../shared/errors/AppError";


let inMemoryStatementsRepository = new InMemoryStatementsRepository();
let inMemoryUsersRepository = new InMemoryUsersRepository();
let getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
let createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
let createStatementUseCase = new CreateStatementUseCase(
    inMemoryUsersRepository,
    inMemoryStatementsRepository
);


describe(('Get Balance'), () => {

    it('should be able to get balance', async ()=> {
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

        await createStatementUseCase.execute(statement)

        const balance = await getBalanceUseCase.execute({
            user_id: user.id as string
        })

        expect(balance.balance).toEqual(100)        
    })

    it('should not be able to get balance with a non-existent user', async () => {
        expect(async () => {
            await getBalanceUseCase.execute({
                user_id: 'non-existent user'
            })
        }).rejects.toEqual(new AppError('User not found', 404))
    })
})