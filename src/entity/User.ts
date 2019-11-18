import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity("users")
export class User extends BaseEntity{

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;
    
    @Field()
    @Column({
        type: "varchar",
        length: 55,
        unique: true
    })
    username: string;

    @Field()
    @Column({
        type: "nvarchar",
        length: 255,
        unique: true
    })
    email: string;

    @Column()
    password: string;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

}
