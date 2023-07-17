import { FastifyReply, FastifyRequest } from 'fastify';
import { AddUserInput } from '../schemas/user.schemas';
import { createUser } from '../services/user.servies';
import { fastify } from '../index';

async function addNewUserHandler(request: FastifyRequest<{ Body: AddUserInput }>, reply: FastifyReply) {
	const data = request.body;
	try {
		const user = await createUser(data);
		reply.code(201).send(user);
	} catch (error) {
		fastify.log.error(error);
		reply.code(500).send({ error: (error as Error).message });
	}
}

export { addNewUserHandler };
