import { FastifyInstance } from 'fastify';
import {
	addAvatarHandler,
	addNewUserHandler,
	deleteUserHandler,
	getAvatarHandler,
	getOwnAvatarHandler,
	getUserHandler,
	loginHandler,
	logoutAllHandler,
	logoutHandler,
	updateUserHandler,
} from '../controllers/user.controller';
import { $ref } from '../schemas/user.schemas';

// route: api/users
async function userRoutes(fastify: FastifyInstance) {
	fastify.post('/', { schema: { body: $ref('addUserSchema') } }, addNewUserHandler);

	fastify.post('/login', { schema: { body: $ref('loginSchema') } }, loginHandler);

	fastify.post('/logout', logoutHandler);

	fastify.post('/logoutAll', logoutAllHandler);

	fastify.get('/me', getUserHandler);

	fastify.patch('/me', { schema: { body: $ref('updateUserSchema') } }, updateUserHandler);

	fastify.delete('/me', deleteUserHandler);

	fastify.post('/me/avatar', addAvatarHandler);

	fastify.get('/me/avatar', getOwnAvatarHandler);

	fastify.get('/:id/avatar', { schema: { params: $ref('getAvatarSchema') } }, getAvatarHandler);
}

export default userRoutes;
