import express from 'express';
import validationRequest from '../../middlewares/validationRequest';
import AuthValidation from './auth.validation';
import AuthController from './auth.controller';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';



const router = express.Router();
router.post('/admin-login',
     validationRequest(AuthValidation.loginZodSchema),
      AuthController.loginAdminUser);
router.post(
  "/refresh-token",
  validationRequest(AuthValidation.requestTokenValidationSchema),
  AuthController.refreshToken
);



router.get('/profile',
      auth(Role.ADMIN, Role.MENTOR, Role.STUDENT),
      AuthController.findBySpecificUserProfile);

const AuthRoutes = router;
export default AuthRoutes;
