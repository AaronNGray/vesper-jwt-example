import * as jwt from "jsonwebtoken";
import { Mutation, Controller } from "vesper";
import { LoginArgs } from "../args/LoginArgs";
import { EntityManager } from "typeorm";
import { User } from "../entity/User";

@Controller()
export class AuthController {
    
    constructor(private entityManager: EntityManager){}

    @Mutation()
    async login(args: LoginArgs) {
        const user = await this.entityManager.findOneOrFail(User, { login: args.login });
        if(!user.checkPassword(args.password)) {
            throw new Error("Wrong password");
        }

        const token = jwt.sign({ id: user.id, role: user.role }, "secret", { expiresIn: '1h' });

        return token;
    }
}