import 'reflect-metadata'

import { CreateStatementUseCase } from "../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { InMemoryStatementsRepository } from "../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateStatementDTO } from "../modules/statements/useCases/createStatement/ICreateStatementDTO";
import { OperationType } from "../modules/statements/entities/Statement";
import { CreateUserUseCase } from "../modules/users/useCases/createUser/CreateUserUseCase";
import { GetStatementOperationUseCase } from '../modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase';
import { AppError } from "../shared/errors/AppError";


let inMemoryStatementsRepository = new InMemoryStatementsRepository();
let inMemoryUsersRepository = new InMemoryUsersRepository();
let createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
let getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
let createStatementUseCase = new CreateStatementUseCase(
    inMemoryUsersRepository,
    inMemoryStatementsRepository
);

describe(('Get Statement Operation'), () => {
    
    it('should be able to get statement operation', async ()=> {
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

        const statementCreated = await createStatementUseCase.execute(statement)

        const statementOperation = await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: statementCreated.id as string
        })

        expect(statementOperation).toHaveProperty('id')
    })

    it('should not be able to get statement operation with a non-existent user', async () => {
        expect(async () => {
            await getStatementOperationUseCase.execute({
                user_id: 'non-existent user',
                statement_id: 'non-existent statement'
            })
        }).rejects.toEqual(new AppError('User not found', 404))
    })

    it('should not be able to get statement operation with a non-existent statement', async () => {
        const user = await createUserUseCase.execute({
            name: 'test not found statement',
            email: 'teststatement@test.com',
            password: '1234'
        })

        expect(async () => {
            await getStatementOperationUseCase.execute({
                user_id: user.id as string,
                statement_id: 'non-existent statement'
            })
        }).rejects.toEqual(new AppError('Statement not found', 404))
    })
})