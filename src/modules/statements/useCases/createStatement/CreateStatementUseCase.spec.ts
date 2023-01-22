import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to validate existing user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "123456",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Teste"
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it("Should be able to create a new deposit", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Hellen",
      email: "hellen@love.com",
      password: "admin"
    });
    const deposit = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 40,
      description: "Description Test"
    });
    expect(deposit).toHaveProperty("id");
  });

  it("Should be able a new withdraw", async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Hellen',
      email: "email@hellen.com",
      password: "passhellen"
    });
    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 20,
      description: "Deposit"
    });
    const result = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 15,
      description: "Deposit"
    });
    expect(result).toHaveProperty("id");
  });

  it("Should be able to validate sufficient balance", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "Osvaldo",
        email: "osvaldo2rt.com",
        password: "admin@Osvaldo"
      });
      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 20,
        description: "Deposit"
      });
      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 25,
        description: "WITHDRAW"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })
})
