import { Role, Submission } from "@prisma/client";
import catchError from "../../errors/catchError";
import prisma from "../../shared/prisma";
import AppError from "../../errors/AppError";
import status from "http-status";
import { QueryBuilder, QueryParams } from "../../builder/QueryBuilder";



const assigmentSubmissionIntoDb = async (
    payload: Omit<Submission, "id" | "studentId" | "createdAt" | "updatedAt" | "isDeleted" | "feedback" | "marks" | "status">,
    studentId: string
) => {
    try {

        const existingAssignment = await prisma.assignment.findUnique({
            where: {
                id: payload.assignmentId,
                isDeleted: false
            }
        });

        if (!existingAssignment) {
            throw new AppError(status.NOT_FOUND, "Assignment not found or it has been deleted!");
        }

        const existingSubmission = await prisma.submission.findUnique({
            where: {
                isDeleted: false,
                assignmentId_studentId: {
                    assignmentId: payload.assignmentId,
                    studentId: studentId,

                }
            }
        });

        if (existingSubmission) {
            throw new AppError(status.CONFLICT, "You have already submitted this assignment!");
        }

        const result = await prisma.submission.create({
            data: {
                ...payload,
                studentId,
            },
            select: {
                id: true
            }
        });

        return {
            status: true,
            message: "Successfully submitted assignment",
            data: result
        };

    } catch (error) {
        throw catchError(error, "Failed to submit assignment");
    }
};

const getMySubmissionsFromDb = async (query: QueryParams, studentId: string) => {
    const queryBuilder = new QueryBuilder(query);

    const searchableFields = ['notes', 'description'];
    const filterableFields = ['status', 'assignmentId', 'isDeleted'];

    const builtQuery = queryBuilder
        .search(searchableFields)
        .filter(filterableFields)
        .scope({ studentId, isDeleted: false })
        .build('createdAt');

    const [submissions, total] = await Promise.all([
        prisma.submission.findMany({
            where: builtQuery.where,
            orderBy: builtQuery.orderBy,
            skip: builtQuery.skip,
            take: builtQuery.take,
            include: {
                assignment: {
                    select: {
                        id: true,
                        title: true,
                        batch: true,
                        deadline: true,
                    }
                }
            }
        }),
        prisma.submission.count({ where: builtQuery.where }),
    ]);

    return {
        meta: {
            page: builtQuery.page,
            limit: builtQuery.limit,
            total,
            totalPage: Math.ceil(total / builtQuery.limit),
        },
        data: submissions,
    };
};

const findBySpecificSubmissionIntoDb = async (id: string, studentId: string) => {

    try {

        const result = await prisma.submission.findFirst({
            where: {
                assignmentId: id, studentId
            }, select: {
                id: true,
                status: true,
                feedback: true,
                marks: true,
                updatedAt: true,

            }
        });

        return result

    }
    catch (error) {
        throw catchError(error, "Failed to submit assignment");
    }


}

// now started teacher section 


const specifcTeacherReviewAssigmentIntoDb = async (query: QueryParams, teacherId: string) => {
    
    if (!query.assignmentId) {
        throw new AppError(status.BAD_REQUEST, "Assignment ID is required in query!");
    }

    const queryBuilder = new QueryBuilder(query);

    const searchableFields = ['notes', 'description'];
    const filterableFields = ['status', 'isDeleted'];

    const builtQuery = queryBuilder
        .search(searchableFields)
        .filter(filterableFields)
        .scope({ 
            assignmentId: query.assignmentId as string, 
            assignment: { userId: teacherId },        
            isDeleted: false 
        })
        .build('createdAt');

    const [submissions, total] = await Promise.all([
        prisma.submission.findMany({
            where: builtQuery.where,
            orderBy: builtQuery.orderBy,
            skip: builtQuery.skip,
            take: builtQuery.take,
            include: {
                assignment: {
                    select: {
                        id: true,
                        title: true,
                        batch: true,
                        deadline: true,
                    }
                },
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        photo: true,
                    }
                }
            }
        }),
        prisma.submission.count({ where: builtQuery.where }),
    ]);

    return {
        meta: {
            page: builtQuery.page,
            limit: builtQuery.limit,
            total,
            totalPage: Math.ceil(total / builtQuery.limit),
        },
        data: submissions,
    };
};

const updateSubmissionIntoDb = async (
    id: string,
    userId: string,
    payload: Partial<Submission>
) => {
    try {
        const existingSubmission = await prisma.submission.findUnique({
            where: { id, isDeleted: false },
            select: {
                id: true
            }
        });

        if (!existingSubmission) {
            throw new AppError(status.NOT_FOUND, "Submission not found!");
        }





        const updateData: any = {};
        if (payload.feedback !== undefined) updateData.feedback = payload.feedback;
        if (payload.marks !== undefined) updateData.marks = payload.marks;
        if (payload.status !== undefined) updateData.status = payload.status;

        await prisma.submission.update({
            where: { id },
            data: updateData,
            include: {
                student: {
                    select: { id: true, name: true, email: true }
                },
                assignment: {
                    select: { id: true, title: true }
                }
            }
        });

        return {
            status: true,
            message: "successfully recorded"
        };

    } catch (error) {
        throw catchError(error, "Failed to update submission");
    }

};



const deleteSubmissionAssigmentIntoDb = async (id: string) => {


    try {
        const existingSubmission = await prisma.submission.findUnique({
            where: { id, isDeleted: false }
        });

        if (!existingSubmission) {
            throw new AppError(status.NOT_FOUND, "Submission not found!");
        }
        await prisma.submission.update({
            where: { id },
            data: { isDeleted: true }
        });

        return {
            status: true,
            message: "Submission deleted successfully",

        };

    }
    catch (error) {

        throw catchError(error, "Failed to delete submission");
    }
};

const getDashboardAnalyticsFromDb = async (userId: string, role: Role) => {
    try {
        if (role === Role.STUDENT) {
            const [totalSubmissions, approvedCount] = await Promise.all([
                prisma.submission.count({
                    where: { studentId: userId, isDeleted: false }
                }),
                prisma.submission.count({
                    where: { studentId: userId, status: 'REVIEWED', isDeleted: false }
                })
            ]);

            const chartData = await prisma.$queryRaw`
                SELECT 
                    TO_CHAR("createdAt", 'Mon YYYY') as month,
                    COUNT(*)::integer as submissions
                FROM "submissions"
                WHERE "studentId" = ${userId} AND "isDeleted" = false
                GROUP BY TO_CHAR("createdAt", 'Mon YYYY'), DATE_TRUNC('month', "createdAt")
                ORDER BY DATE_TRUNC('month', "createdAt") ASC;
            `;

            return {
                role: Role.STUDENT,
                totalSubmissions,
                approvedCount,
                chartData
            };
        }

        if (role === Role.MENTOR) {

            const [totalReceived, totalReviewed, totalPending] = await Promise.all([
                prisma.submission.count({
                    where: { assignment: { userId: userId }, isDeleted: false }
                }),
                prisma.submission.count({
                    where: { assignment: { userId: userId }, status: 'REVIEWED', isDeleted: false }
                }),
                prisma.submission.count({
                    where: { assignment: { userId: userId }, status: { in: ['SUBMITTED', 'PENDING'] }, isDeleted: false }
                })
            ]);


            const chartData = await prisma.$queryRaw`
                SELECT 
                    TO_CHAR(s."createdAt", 'Mon YYYY') as month,
                    COUNT(*)::integer as reviews
                FROM "submissions" s
                JOIN "assignmentsts" a ON s."assignmentId" = a."id"
                WHERE a."userId" = ${userId} AND s."isDeleted" = false
                GROUP BY TO_CHAR(s."createdAt", 'Mon YYYY'), DATE_TRUNC('month', s."createdAt")
                ORDER BY DATE_TRUNC('month', s."createdAt") ASC;
            `;

            return {
                role: Role.MENTOR,
                totalReceived,
                totalReviewed,
                totalPending,
                chartData
            };
        }

        throw new AppError(status.FORBIDDEN, "Invalid user role for analytics!");

    } catch (error) {
        throw catchError(error, "Failed to fetch dashboard analytics");
    }
};









const AssigmentSubmissionServices = {
    assigmentSubmissionIntoDb,
    getMySubmissionsFromDb,
    findBySpecificSubmissionIntoDb,
    specifcTeacherReviewAssigmentIntoDb,
    updateSubmissionIntoDb,
    deleteSubmissionAssigmentIntoDb,
    getDashboardAnalyticsFromDb
};
export default AssigmentSubmissionServices