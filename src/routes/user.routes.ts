import { FastifyInstance } from 'fastify';
import { addNewUserHandler } from '../controllers/user.controller';
import { $ref } from '../schemas/user.schemas';

async function userRoutes(fastify: FastifyInstance) {
	fastify.post('/', { schema: { body: $ref('addUserSchema') } }, addNewUserHandler);
}

export default userRoutes;
