import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status';
import AssigmentSubmissionServices from "./submission.services";

const assigmentSubmission: RequestHandler = catchAsync(async (req, res) => {

    const result = await AssigmentSubmissionServices.assigmentSubmissionIntoDb(req.body, req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Successfully All Assisgement ",
        data: result,
    });
});

const getMySubmissions: RequestHandler = catchAsync(async (req, res) => {

    const result = await AssigmentSubmissionServices.getMySubmissionsFromDb(req.query, req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Successfully Find My All Assisgement ",
        data: result,
    });

});

const findBySpecificSubmission: RequestHandler = catchAsync(async (req, res) => {

    const result = await AssigmentSubmissionServices.findBySpecificSubmissionIntoDb(req.params.id as string, req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Successfully Find My Specific Assisgement ",
        data: result,
    });

});

const specifcTeacherReviewAssigment: RequestHandler = catchAsync(async (req, res) => {

    const result = await AssigmentSubmissionServices.specifcTeacherReviewAssigmentIntoDb(req.query, req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Successfully Find My All Assisgement ",
        data: result,
    });
});


const updateSubmission: RequestHandler = catchAsync(async (req, res) => {

    const result = await AssigmentSubmissionServices.updateSubmissionIntoDb(req.params.id as string, req.user.id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Successfully Recorded ",
        data: result,
    });
});

const deleteSubmissionAssigment: RequestHandler = catchAsync(async (req, res) => {

    const result = await AssigmentSubmissionServices.deleteSubmissionAssigmentIntoDb(req.params.id as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Successfully Delete ",
        data: result,
    });
});

const getDashboardAnalytics: RequestHandler = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    const role = req.user?.role;

    const result = await AssigmentSubmissionServices.getDashboardAnalyticsFromDb(userId, role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Analytics retrieved successfully",
        data: result,
    });
});


const AssigmentSubmissionController = {
    assigmentSubmission,
    getMySubmissions,
    findBySpecificSubmission,
    specifcTeacherReviewAssigment,
    updateSubmission,
    deleteSubmissionAssigment,
    getDashboardAnalytics
};

export default AssigmentSubmissionController;
