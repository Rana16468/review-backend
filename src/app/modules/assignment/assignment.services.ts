import { Assignment } from "@prisma/client";
import catchError from "../../errors/catchError";
import prisma from "../../shared/prisma";
import { QueryBuilder, QueryParams } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import status from "http-status";


const createNewAssignmentIntoDb = async (payload: Omit<Assignment, "id" | "userId" | "createdAt" | "updatedAt" | "isDeleted">, userId: string) => {
    try {
        await prisma.assignment.create({
            data: {
                ...payload,
                userId
            }
        });

        return {
            status: true,
            message: "Successfully Recorded"

        };

    } catch (error) {

        throw catchError(error, "Failed to create new assignment");
    }
};



const getAllAssignmentsFromDb = async (query: QueryParams, userId: string) => {
  const queryBuilder = new QueryBuilder(query);

  const searchableFields = ['title', 'batch', 'description'];
  const filterableFields = ['batch', 'isDeleted'];

  const builtQuery = queryBuilder
    .search(searchableFields)
    .filter(filterableFields)
    .scope({ userId })
    .build('createdAt');

  const whereConditions = {
    ...builtQuery.where,
    userId: userId, 
    isDeleted: builtQuery.where?.isDeleted ?? false, 
  };

  
  const [assignments, total] = await Promise.all([
    prisma.assignment.findMany({
      where: whereConditions,
      orderBy: builtQuery.orderBy,
      skip: builtQuery.skip,
      take: builtQuery.take,
      select: {
        id: true,
        batch: true,
        deadline: true,
        description: true,
        title: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.assignment.count({ where: whereConditions }),
  ]);

  
  return {
    meta: {
      page: builtQuery.page,
      limit: builtQuery.limit,
      total,
      totalPage: Math.ceil(total / builtQuery.limit),
    },
    data: assignments,
  };
};

const findBySpecificAssigmentIntoDb = async (id: string) => {

    try {

        const result = await prisma.assignment.findFirst({
            where: { id }, select: {
                id: true,
                batch: true,
                deadline: true,
                description: true,
                title: true,
                isDeleted: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return result

    }

    catch (error) {

        throw catchError(error, "Failed to create new assignment");
    }


};


const updateAssignmentIntoDb = async (
    id: string,
    userId: string,
    payload: Partial<Assignment>
) => {
    try {
        const existingAssignment = await prisma.assignment.findUnique({
            where: { id, isDeleted: false }
        });

        if (!existingAssignment) {
            throw new AppError(status.NOT_FOUND, "Assignment not found!");
        }

        if (existingAssignment.userId !== userId) {
            throw new AppError(status.FORBIDDEN, "You are not authorized to update this assignment!");
        }
        const updateData: any = { ...payload };
        if (updateData.deadline) {
            updateData.deadline = new Date(updateData.deadline);
        }

        const result = await prisma.assignment.update({
            where: { id },
            data: updateData,
            select: {
                id: true,

            }
        });

        return result;
    } catch (error) {
        throw catchError(error, "Failed to update assignment");
    }
};

const deleteAssignmentFromDb = async (id: string, userId: string) => {
    try {
        const existingAssignment = await prisma.assignment.findUnique({
            where: { id }
        });

        if (!existingAssignment) {
            throw new AppError(status.NOT_FOUND, "Assignment not found!");
        }

        if (existingAssignment.userId !== userId) {
            throw new AppError(status.FORBIDDEN, "You are not authorized to delete this assignment!");
        }


        const result = await prisma.assignment.delete({
            where: { id },

        });

        await prisma.submission.deleteMany({
            where: {
                assignmentId: id
            }
        })

        return result;
    } catch (error) {
        throw catchError(error, "Failed to delete assignment");
    }
};



const AssignmentServices = {
    createNewAssignmentIntoDb,
    getAllAssignmentsFromDb,
    findBySpecificAssigmentIntoDb,
    updateAssignmentIntoDb,
    deleteAssignmentFromDb
};

export default AssignmentServices;