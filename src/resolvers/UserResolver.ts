import { Resolver, Query, Mutation, Arg, Ctx, Int, UseMiddleware } from 'type-graphql';
import { User } from '../entity/User';
import { hash, compare } from 'bcryptjs';
import { Context } from '../Context';
import { sendRefreshToken, createRefreshToken, createAccessToken } from '../authHelpers';
import { LoginResponse } from './ResponseTypes';
import { getConnection } from 'typeorm';
import { authenticationMiddleware } from '../middleware/autheticationMiddleware';

@Resolver()
export class UserResolver{
    @Query(() => String)
    hello(){
        return 'HI!';
    }

    @Query(() => [User])
    @UseMiddleware(authenticationMiddleware)
    users(
        @Ctx() { payload  } : Context
    ){
        console.log(payload);
        return User.find();
    }

    @Mutation(() => LoginResponse, { nullable: true })
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() { res }: Context
    ){
        // VALIDATE USER EXISTANCE
        const user = await User.findOne({ where: { email } });
        if(!user){
            throw new Error('User not found');
        }

        // VALIDATE USER PASSWORD
        const valid = await compare(password, user.password);
        if(!valid){
            throw new Error('Password incorrect');
        }

        sendRefreshToken(res, createRefreshToken(user));

        return {
            accessToken: createAccessToken(user),
            user
        }
    }

    @Mutation(() => Boolean, { nullable: true })
    async register(
        @Arg('email') email: string,
        @Arg('username') username: string,
        @Arg('password') password: string,
        @Arg('confirmPassword') confirmPasswword: string
    ){
        // VALIDATE USER EXISTANCE
        const user = await User.findOne({ where : [
            { email },
            {username}
        ]})
        if(user){
            console.log(user);
            throw new Error('Email or username already exist');
        }

        // VALIDATE PASSWORDS
        if(password !== confirmPasswword){
            throw new Error('Passwords dosen\'t match');
        }

        // INSERT USER IN DB
        const hashedPassword = await hash(password, 16);
        try {
            await User.insert({
                email, username, password: hashedPassword
            })
            return true;
        } catch (error) {
            throw new Error(error);
        }
    }

    @Mutation(() => Boolean)
    async logout(
        @Ctx() { res }: Context
    ){
        sendRefreshToken(res, "");

        return true;
    }

    @Mutation(() => Boolean)
    async revokeRefreshtoken(
        @Arg("userId", () => Int) userId: number
    ){
        await getConnection()
        .getRepository("user")
        .increment({ id: userId }, "tokenVersion", 1);

        return true;
    }
}