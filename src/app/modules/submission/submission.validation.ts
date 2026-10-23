import { z } from 'zod';

const createSubmissionSchema = z.object({
    body: z.object({
        assignmentId: z
            .string({ error: "Assignment ID is required" }),


        description: z
            .string({ error: "description is required" })
            .max(5000, "Description must be at most 500 characters"),


        notes: z
            .string()
            .max(1000, "Notes must be at most 1000 characters")
            .optional(),
    }),
});


const updateSubmissionSchema = z.object({
    body: z.object({
        feedback: z
            .string()
            .max(2000, "Feedback must be at most 2000 characters")
            .optional(),

        marks: z
            .number({ error: "Marks must be a number" })
            .int("Marks must be an integer")
            .nonnegative("Marks cannot be negative")
            .optional(),

        status: z.enum(["PENDING", "SUBMITTED", "REVIEWED", "REJECTED"]).default('PENDING').optional()
    })

});


const submissionValidation = {
    createSubmissionSchema,
    updateSubmissionSchema
}

export default submissionValidation

