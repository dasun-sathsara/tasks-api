import { FastifyInstance } from 'fastify';
import * as UserController from '../controllers/user.controller';
import { $ref, UpdateUserSchema } from '../schemas/user.schemas';

// route: api/users
async function userRoutes(fastify: FastifyInstance) {
	fastify.post('/', { schema: { body: $ref('addUserSchema') } }, UserController.addNewUserHandler);

	fastify.post('/login', { schema: { body: $ref('loginSchema') } }, UserController.loginHandler);

	fastify.post('/logout', { preHandler: [fastify.authenticate] }, UserController.logoutHandler);

	fastify.post('/logoutAll', { preHandler: [fastify.authenticate] }, UserController.logoutAllHandler);

	fastify.get('/me', { preHandler: [fastify.authenticate] }, UserController.getUserHandler);

	fastify.patch<{ Body: UpdateUserSchema }>(
		'/me',
		{ preHandler: [fastify.authenticate], schema: { body: $ref('updateUserSchema') } },
		UserController.updateUserHandler,
	);

	fastify.delete('/me', { preHandler: [fastify.authenticate] }, UserController.deleteUserHandler);

	fastify.post('/me/avatar', { preHandler: [fastify.authenticate] }, UserController.addAvatarHandler);

	fastify.get('/me/avatar', { preHandler: [fastify.authenticate] }, UserController.getOwnAvatarHandler);

	fastify.delete('/me/avatar', { preHandler: [fastify.authenticate] }, UserController.deleteOwnAvatarHandler);

	fastify.get<{ Params: { id: string } }>(
		'/:id/avatar',
		{ preHandler: [fastify.authenticate], schema: { params: $ref('getAvatarSchema') } },
		UserController.getAvatarHandler,
	);
}

export default userRoutes;
