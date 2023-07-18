import { FastifyReply, FastifyRequest } from 'fastify';
import { AddUserSchema, LoginSchema, UpdateUserSchema } from '../schemas/user.schemas';
import { createUser } from '../services/user.servies';
import { fastify } from '../index';
import { UserModel } from '../models/export';
import { AuthError } from '../utils/errors';

async function addNewUserHandler(request: FastifyRequest<{ Body: AddUserSchema }>, reply: FastifyReply) {
	const data = request.body;
	try {
		const user = await createUser(data);
		reply.code(201).send(user);
	} catch (error) {
		fastify.log.error(error);
		reply.code(500).send({ error: (error as Error).message });
	}
}

async function loginHandler(request: FastifyRequest<{ Body: LoginSchema }>, reply: FastifyReply) {
	try {
		const user = await UserModel.findByCredentials(request.body.email, request.body.password);
		const token = await user.generateAuthToken();

		return { user, token };
	} catch (error) {
		if (error instanceof AuthError) {
			reply.code(401).send({ error: error.message });
		} else {
			reply.code(500).send({ error: 'Unknown error occured.' });
		}
	}
}

async function logoutHandler(request: FastifyRequest, reply: FastifyReply) {
	try {
		const user = request.authUser!;

		user.tokens = user.tokens.filter(token => {
			return token.token !== request.token;
		});

		await user.save();
	} catch (error) {
		console.log(error);
		reply.code(500).send({ error: 'Unknown error occured' });
	}
}

async function logoutAllHandler(request: FastifyRequest, reply: FastifyReply) {
	try {
		const user = request.authUser!;
		user.tokens = [];

		await user.save();
	} catch (error) {
		console.log(error);
		reply.code(500).send({ error: 'Unknown error occured' });
	}
}

async function getUserHandler(request: FastifyRequest, reply: FastifyReply) {}

async function updateUserHandler(request: FastifyRequest<{ Body: UpdateUserSchema }>, reply: FastifyReply) {}

async function deleteUserHandler(request: FastifyRequest, reply: FastifyReply) {}

async function addAvatarHandler(request: FastifyRequest, reply: FastifyReply) {}

async function getOwnAvatarHandler(request: FastifyRequest, reply: FastifyReply) {}

async function getAvatarHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {}

export {
	addNewUserHandler,
	loginHandler,
	logoutHandler,
	logoutAllHandler,
	getUserHandler,
	updateUserHandler,
	deleteUserHandler,
	addAvatarHandler,
	getOwnAvatarHandler,
	getAvatarHandler,
};
