import express from 'express';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';
import validationRequest from '../../middlewares/validationRequest';
import AssignmentValidation from './assignment.validations';
import AssignmentController from './assignment.controller';

const router = express.Router();

router.post("/create_assigment",
    auth(Role.MENTOR),
    validationRequest(AssignmentValidation.createAssignmentSchema),
    AssignmentController.createNewAssignment);

router.get("/my_all_assigment",
    auth(Role.MENTOR),
    AssignmentController.getAllAssignments
);

router.get("/specific_assigment/:id",
    auth(Role.MENTOR, Role.STUDENT),
    AssignmentController.findBySpecificAssigment

);

router.patch("/update_assigment/:id",
    
    auth(Role.MENTOR),
    validationRequest(AssignmentValidation.updateAssignmentSchema),
    AssignmentController.updateAssignment
);

router.delete("/delete_assigment/:id",
    auth(Role.MENTOR),
    AssignmentController.deleteAssignment
)


const AssigmentRouter = router;
export default AssigmentRouter;