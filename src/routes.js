import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import QuantityController from './app/controllers/QuantityController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.put('/users', UserController.update);

routes.get('/products', ProductController.index);
routes.post('/products', ProductController.store);
routes.put('/products', ProductController.update);

routes.get('/quantities', QuantityController.index);
routes.post('/quantities', QuantityController.store);
routes.put('/quantities', QuantityController.update);

export default routes;
