import {Router} from 'express';
import departmentRouter from './department.routes.js';
import workerRouter from './worker.routes.js';
import projectRouter from './project.routes.js';
import participateRouter from './participate.routes.js';

const apiRouter: Router = Router();

apiRouter.use('/departments', departmentRouter);
apiRouter.use('/workers', workerRouter);
apiRouter.use('/projects', projectRouter);
apiRouter.use('/participations', participateRouter);

export default apiRouter;
