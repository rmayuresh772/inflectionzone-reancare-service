import express from 'express';
import { Loader } from '../../../../startup/loader';
import { CareplanController } from '../../../controllers/clinical/careplan/careplan.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new CareplanController();

    router.get('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.getAvailableCareplans);
    router.post('/patients/:patientUserId/enroll', authenticator.authenticateClient, authenticator.authenticateUser, controller.enroll);
    router.get('/patients/:patientUserId/enrollments', authenticator.authenticateClient, authenticator.authenticateUser, controller.getPatientEnrollments);
    router.get('/:id/fetch-tasks', authenticator.authenticateClient, authenticator.authenticateUser, controller.fetchTasks);
    router.get('/:id/weekly-status', authenticator.authenticateClient, authenticator.authenticateUser, controller.getWeeklyStatus);
    
    app.use('/api/v1/care-plans', router);
};
