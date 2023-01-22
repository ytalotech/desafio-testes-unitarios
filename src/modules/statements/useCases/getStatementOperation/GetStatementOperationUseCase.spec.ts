import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Ge tStatement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("Should be able to validate existing user when fetching balance", async () => {
    expect(async () => {

      await getStatementOperationUseCase.execute({
        user_id: "123456",
        statement_id: "654321"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it("Should be able to non-existent balance", async () => {
    expect(async () => {

      const response_create_user = await inMemoryUsersRepository.create({
        name: "ytalo",
        email: "suporte@ytalo.dev",
        password: "123456"
      })

      await getStatementOperationUseCase.execute({
        user_id: response_create_user.id as string,
        statement_id: "123456"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

  it("Should be able to fetch balance", async () => {

    const response_create_user = await inMemoryUsersRepository.create({
      name: "ytalo",
      email: "suporte@ytalo.dev",
      password: "123456"
    })

    const response_create_statement = await inMemoryStatementsRepository.create({
      user_id: response_create_user.id as string,
      type: OperationType.DEPOSIT,
      amount: 20,
      description: "Teste"
    })

    const response_get_statement_operation = await getStatementOperationUseCase.execute({
      user_id: response_create_user.id as string,
      statement_id: response_create_statement.id as string
    })

    expect(response_get_statement_operation).toHaveProperty("id")
  })
})
