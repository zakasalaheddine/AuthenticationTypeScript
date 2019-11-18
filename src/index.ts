import "reflect-metadata";
import "dotenv/config";
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { createConnection } from "typeorm";
import cors from 'cors';
import { authenticationMiddleware } from "./middleware/autheticationMiddleware";




(async () => {
    const app = express();

    await createConnection();

    app.use(cors());
    app.use(authenticationMiddleware);

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver]
        }),
        context: ({ req, res }) => ({ req, res })
    });

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(4000, () => {
        console.log('express server started');
    })
})()
