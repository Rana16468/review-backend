import express from 'express';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';
import validationRequest from '../../middlewares/validationRequest';
import submissionValidation from './submission.validation';
import AssigmentSubmissionController from './submission.controller';


const router = express.Router();

router.post("/submit_assigment",
    auth(Role.STUDENT),
    validationRequest(submissionValidation.createSubmissionSchema),
    AssigmentSubmissionController.assigmentSubmission

);


router.get("/find_my_submission",
    auth(Role.STUDENT),
    AssigmentSubmissionController.getMySubmissions
);

router.get("/find_by_specifc_submission/:id",
    auth(Role.STUDENT),
    AssigmentSubmissionController.findBySpecificSubmission
)

//teacher 
router.get("/my_all_review_assigment",
    auth(Role.MENTOR),
    AssigmentSubmissionController.specifcTeacherReviewAssigment
)

router.patch("/update_assigment/:id",
    auth(Role.MENTOR),
    validationRequest(submissionValidation.updateSubmissionSchema),
    AssigmentSubmissionController.updateSubmission
);

router.delete("/delete_submission_assigment/:id",
    auth(Role.MENTOR),
    AssigmentSubmissionController.deleteSubmissionAssigment
)


router.get("/analysis", 
    auth(Role.MENTOR,Role.STUDENT), 
    AssigmentSubmissionController.getDashboardAnalytics)

const submissionRouter = router;
export default submissionRouter