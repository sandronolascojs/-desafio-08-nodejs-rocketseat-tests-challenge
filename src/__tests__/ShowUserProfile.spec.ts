import 'reflect-metadata'

import { InMemoryUsersRepository } from "../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../modules/users/useCases/createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "../modules/users/useCases/showUserProfile/ShowUserProfileUseCase";
import { AppError } from "../shared/errors/AppError";

let inMemoryUsersRepository = new InMemoryUsersRepository();
let createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
let showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);

describe("Show User Profile", () => {
    it("should be able to show a user profile", async () => {
        const user = await createUserUseCase.execute({
        name: "show user profile",
        email: 'showuserprofile@test.com',
        password: "1234",
        });

        const userProfile = await showUserProfileUseCase.execute(user.id as string);

        expect(userProfile).toHaveProperty("id");
    })

    it("should not be able to show a user profile with a non-existent user", async () => {
        expect(async () => {
            await showUserProfileUseCase.execute("non-existent user");
        }).rejects.toEqual(new AppError("User not found", 404));
    })
})