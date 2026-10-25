import { RequestHandler } from "express";
import UserService from "./user.services";
import catchAsync from "../../utils/asyncCatch";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import config from "../../config";

const createUser: RequestHandler = catchAsync(async (req, res) => {

  const result = await UserService.createUserIntoDb(req.body);
  const { refreshToken, accessToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Login",
    data: {
      accessToken,
      refreshToken
    },
  });
});

const createAccount: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserService.createAccountIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Account created successfully",
    data: result,
  });
});

const createGoogleAuth: RequestHandler = catchAsync(async (req, res) => {

  const result = await UserService.createGoogleAuthIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Account created successfully",
    data: result,
  });

})




const UserController = {
  createUser,
  createAccount,
  createGoogleAuth

};
export default UserController;
