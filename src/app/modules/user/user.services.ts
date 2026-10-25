
import { Role, Status, User } from "@prisma/client";
import AppError from "../../errors/AppError";
import prisma from "../../shared/prisma";

import httpStatus from 'http-status'
import config from "../../config";
import { jwtHelpers } from "../../helper/jwtHelpers";
import bcrypt from 'bcrypt'
import catchError from "../../errors/catchError";
import { TJwtPayload } from "./user.interface";


const createUserIntoDb = async (
    payload: Partial<User> & Pick<User, "email">
) => {
    const { user, created } = await prisma.$transaction(async (tx) => {



        const existingUser = await tx.user.findFirst({
            where: { email: payload.email },
            select: {
                id: true,
                role: true,
                email: true,
                status: true,
                isDeleted: true,
            },
        });

        if (existingUser) {
            if (existingUser.isDeleted) {
                throw new AppError(
                    httpStatus.FORBIDDEN,
                    "This account has been deleted. Please contact support."
                );
            }

            if (existingUser.status === Status.BLOCKED) {
                throw new AppError(
                    httpStatus.FORBIDDEN,
                    "Your account has been blocked. You cannot sign in."
                );
            }

           
            if (payload.role && existingUser.role !== payload.role) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    `An account with email '${payload.email}' already exists as a '${existingUser.role}'. You cannot register as a '${payload.role}' with the same email. Please use a different email.`
                );
            }

           
            const updatedUser = await tx.user.update({
                where: { id: existingUser.id },
                data: {
                    os: payload.os,
                    browser: payload.browser,
                    device: payload.device,
                    photo: payload.photo ?? undefined, 
                },
                select: {
                    id: true,
                    role: true,
                    email: true,
                },
            });

            return { user: updatedUser, created: false };
        }

       
        if (!payload.role) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Role is required to create an account."
            );
        }

        if (!payload.name) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Name is required to create an account."
            );
        }

        const newUser = await tx.user.create({
            data: {
                name: payload.name,
                role: payload.role,
                email: payload.email,
                photo: payload.photo, 
                os: payload.os,
                browser: payload.browser,
                device: payload.device,
                isVerify: true,
                status: Status.ACTIVE,
            },
            select: {
                id: true,
                role: true,
                email: true,
            },
        });

        return { user: newUser, created: true };
    });

    const jwtPayload: TJwtPayload = {
        id: user.id,
        role: user.role,
        email: user.email ?? "",
    };

    const accessToken = jwtHelpers.generateToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.expires_in as string
    );

    const refreshToken = jwtHelpers.generateToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.refresh_expires_in as string
    );

    return { accessToken, refreshToken };
};

const createAccountIntoDb = async (payload: User) => {


    
    if (!payload.email) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Either email or phone is required to create an account'
        );
    }

   
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                ...(payload.email ? [{ email: payload.email }] : []),
                ...(payload.role ? [{ role: payload.role }] : []),
            ],
        },
        select: { id: true, status: true, isDeleted: true, email: true },
    });

    if (existingUser?.isDeleted) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'This account has been deleted. Please contact support.'
        );
    }

    if (existingUser?.status === Status.BLOCKED) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'Your account has been blocked. You cannot sign in.'
        );
    }


    if (!config.jwt_access_secret || !config.jwt_refresh_secret) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'JWT Secret keys are not defined in the configuration'
        );
    }

    const hashedPassword = payload.password
        ? await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds) || 10)
        : undefined;


    const userData = {
        ...payload,
        ...(hashedPassword && { password: hashedPassword }),
        role: payload.role || Role.ADMIN, // Default fallback role
        status: Status.ACTIVE,

        isVerify: true,
    };

    let user;


    if (existingUser) {
        user = await prisma.user.update({
            where: { id: existingUser.id },
            data: userData,
        });
    } else {
        user = await prisma.user.create({
            data: userData,
        });
    }



    const jwtPayload = {
        id: user.id,
        role: user.role,
        email: user.email,

    };

    
    const accessToken = jwtHelpers.generateToken(
        jwtPayload as TJwtPayload,
        config.jwt_access_secret as string,
        config.expires_in as string
    );

    const refreshToken = jwtHelpers.generateToken(
        jwtPayload as TJwtPayload,
        config.jwt_refresh_secret as string,
        config.refresh_expires_in as string
    );

    return {
        accessToken,
        refreshToken
    };
};




const avaterIntoDb = async (userId: string) => {
    try {
        const result = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,

                name: true,

            }
        });

        return result


    } catch (error) {
        throw catchError(error, 'Failed to update avatar');
    }
};

const createGoogleAuthIntoDb=async(payload:User)=>{

    try{

        const result= await prisma.$transaction(async(tx)=>{

             const isExistUser= await tx.user.findFirst({
                where:{
                    email:payload.email
                }
             });

             if(isExistUser){
                return "this account alredy exist"
             }
             const create=await prisma.user.create({
                data:payload
             });

             return {create}


        });

        return result

    }
    catch (error) {
        throw catchError(error);
    }


}

const UserService = {
    createUserIntoDb,
    createAccountIntoDb,
    avaterIntoDb,
    createGoogleAuthIntoDb
};

export default UserService;