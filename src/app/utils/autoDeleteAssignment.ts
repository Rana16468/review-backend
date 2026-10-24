import prisma from "../shared/prisma";


const autoDeleteAssignment = async () => {
    try {
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);


        const expiredAssignments = await prisma.assignment.findMany({
            where: {
                deadline: {
                    lte: fifteenDaysAgo,
                },
            },
            select: {
                id: true,
            },
        });

        const assignmentIds = expiredAssignments.map((assignment) => assignment.id);

        if (assignmentIds.length === 0) {
            console.log("[Auto Delete]: No expired assignments found to delete.");
            return { deletedAssignments: 0, deletedSubmissions: 0 };
        }

        const [deletedSubmissions, deletedAssignments] = await prisma.$transaction([

            prisma.submission.deleteMany({
                where: {
                    assignmentId: {
                        in: assignmentIds,
                    },
                },
            }),

            prisma.assignment.deleteMany({
                where: {
                    id: {
                        in: assignmentIds,
                    },
                },
            }),
        ]);

        console.log(
            `[Auto Delete]: Successfully deleted ${deletedAssignments.count} expired assignments and ${deletedSubmissions.count} related submissions.`
        );

        return {
            deletedAssignments: deletedAssignments.count,
            deletedSubmissions: deletedSubmissions.count,
        };
    } catch (error) {
        console.error("Error while auto-deleting expired assignments and submissions:", error);
        throw error;
    }
};

export default autoDeleteAssignment;