import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  })

  it("Should be able to validate existing user when fetching balance", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "123456"
      })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })

  it("Should be able to get user balance", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Hellen",
      email: "hellen@love.com",
      password: "admin"
    });

    const balace = await getBalanceUseCase.execute({
      user_id: user.id as string
    })

    expect(balace).toHaveProperty("balance")
  })
})
