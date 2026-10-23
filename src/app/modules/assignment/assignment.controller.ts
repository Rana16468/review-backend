import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import AssignmentServices from "./assignment.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus, { status } from 'http-status'

const createNewAssignment: RequestHandler = catchAsync(async (req, res) => {
    const result = await AssignmentServices.createNewAssignmentIntoDb(req.body, req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: result.message,
        data: result,
    });
});

const getAllAssignments: RequestHandler = catchAsync(async (req, res) => {
    const result = await AssignmentServices.getAllAssignmentsFromDb(req.query, req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Successfully All Assisgement ",
        data: result,
    });
});

const findBySpecificAssigment: RequestHandler = catchAsync(async (req, res) => {

    const result = await AssignmentServices.findBySpecificAssigmentIntoDb(req.params.id as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Successfully find by Specifc Assisgement ",
        data: result,
    });
});

const updateAssignment: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    const result = await AssignmentServices.updateAssignmentIntoDb(id as string, userId, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Assignment updated successfully",
        data: result,
    });
});


const deleteAssignment: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    const result = await AssignmentServices.deleteAssignmentFromDb(id as string, userId);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Assignment deleted successfully",
        data: result,
    });
});


const AssignmentController = {
    createNewAssignment,
    getAllAssignments,
    findBySpecificAssigment,
    deleteAssignment,
    updateAssignment
};

export default AssignmentController;
