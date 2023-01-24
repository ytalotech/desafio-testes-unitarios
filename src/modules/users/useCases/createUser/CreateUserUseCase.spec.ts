import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { ICreateUserDTO } from "./ICreateUserDTO";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able to create an user", async () => {
    const user: ICreateUserDTO = {
      email: "user@teste.com",
      password: "1234",
      name: "User test"
    };

    const user_create = await createUserUseCase.execute(user)

    expect(user_create).toHaveProperty("id");
  })

  it("Should be able to validate duplicate user registration", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "user@teste.com",
        password: "1234",
        name: "User test"
      };

      await createUserUseCase.execute(user);

      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
