import * as jwt from "jsonwebtoken";
import {bootstrap} from "vesper";
import {PostController} from "./controller/PostController";
import {Post} from "./entity/Post";
import {CategoryController} from "./controller/CategoryController";
import {Category} from "./entity/Category";
import {PostResolver} from "./resolver/PostResolver";
import {AuthController} from "./controller/AuthController";
import {UserController} from "./controller/UserController";
import {User} from "./entity/User";
import {getManager} from "typeorm";

bootstrap({
    port: 3000,
    controllers: [
        PostController,
        CategoryController,
        UserController,
        AuthController
    ],
    resolvers: [
        PostResolver
    ],
    entities: [
        Post,
        Category,
        User
    ],
    schemas: [__dirname + "/schema/**/*.graphql"],
    setupContainer: async (container, action) => {
        const request = action.request;
        const token:string = request.headers["token"] as string || "";
        if(token === "") {
            return;
        }

        const entityManager = getManager();
        const payload = jwt.verify(token, "secret");
        const currentUser = await entityManager.findOneOrFail(User, { id: payload["id"] });

        container.set(User, currentUser);
    },
    authorizationChecker: (roles: string[], action) => {
        const currentUser = action.container.get(User);
        if(currentUser.id === undefined) {
          throw new Error("The current user doesn't set");
        }

        if(roles.length === 0) {
            return;
        }

        if(!roles.includes(currentUser.role)) {
            throw new Error("Access error");
        }
    }
}).then(() => {
    console.log("Your app is up and running on http://localhost:3000 . " +
        "You can use Playground in development mode on http://localhost:3000/playground");

}).catch(error => {
    console.error(error.stack ? error.stack : error);
});