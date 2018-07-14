import { Controller, Mutation, Query, Authorized } from "vesper";
import { LoginArgs } from "../args/LoginArgs";
import { EntityManager } from "typeorm";
import { User } from "../entity/User";

@Controller()
export class UserController {

    constructor(private entityManager: EntityManager, private currentUser: User ){}

    @Query()
    @Authorized()
    async users(): Promise<User[]> {
        return await this.entityManager.find(User);
    }

    @Query()
    @Authorized(["admin"])
    async user({id}): Promise<User> {
        if(this.currentUser.id !== id) {
            throw new Error("You can view only yourself info");
        }
        return await this.entityManager.findOneOrFail(User, { id: id });
    }

    @Mutation()
    @Authorized(["admin"])
    async userCreate(args: LoginArgs): Promise<User> {
        const user = new User();
        user.login = args.login;
        user.password = args.password;
        user.role = args.role || "user";

        return await this.entityManager.save(user);
    }

    @Mutation()
    @Authorized(["admin"])
    async userDelete({id}) {
        return await this.entityManager.remove(User, { id: id })
    }
}