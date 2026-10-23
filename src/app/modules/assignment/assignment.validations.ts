import { z } from 'zod';

const createAssignmentSchema = z.object({
    body: z.object({
        batch: z
            .string({ error: "Batch is required" })
            .max(255, "Batch must be at most 255 characters"),

        deadline: z.coerce.date({ error: "Deadline is required" }),

        description: z
            .string({ error: "Description is required" })
            .max(5000, "Description must be at most 5000 characters"),

        title: z
            .string({ error: "Title is required" })
            .max(255, "Title must be at most 255 characters"),
    })


});


const updateAssignmentSchema = createAssignmentSchema.partial();

const AssignmentValidation={
    createAssignmentSchema,
    updateAssignmentSchema
};

export default AssignmentValidation

