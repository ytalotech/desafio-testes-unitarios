import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

interface UserCreate {
  id: string;
  email: string;
  password: string;
  name: string;
}

describe("Show User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  })

  it("should be able to reject if the user does not exist in view profile", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("123456");
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })

  it("should be able to search profile user", async () => {

    const user = await inMemoryUsersRepository.create({
      email: "user@teste.com",
      password: "1234",
      name: "User test"
    });

    const profile_user = await showUserProfileUseCase.execute(user.id as string);

    expect(profile_user).toHaveProperty("id");
  })
})
