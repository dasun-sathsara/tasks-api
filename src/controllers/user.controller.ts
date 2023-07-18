import { FastifyReply, FastifyRequest } from 'fastify';
import { AddUserSchema, LoginSchema, UpdateUserSchema } from '../schemas/user.schemas';
import {
	createUser,
	deleteAvatar,
	deleteUser,
	getAvatarById,
	logout,
	logoutAll,
	updateUser,
} from '../services/user.servies';
import { fastify } from '../index';
import { UserModel } from '../models/export';
import { AuthError } from '../utils/errors';
import sharp from 'sharp';

async function addNewUserHandler(request: FastifyRequest<{ Body: AddUserSchema }>, reply: FastifyReply) {
	const data = request.body;
	try {
		const user = await createUser(data);
		reply.code(201).send(user);
	} catch (error) {
		fastify.log.error(error);

		if (error instanceof Error && 'code' in error && error.code === 11000) {
			reply.code(409).send({ error: 'User already exists.' });
		} else {
			reply.code(500).send({ error: 'User already exists.' });
		}
	}
}

async function loginHandler(request: FastifyRequest<{ Body: LoginSchema }>, reply: FastifyReply) {
	try {
		const user = await UserModel.findByCredentials(request.body.email, request.body.password);
		const token = await user.generateAuthToken();

		return { user, token };
	} catch (error) {
		fastify.log.error(error);
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
		const { token } = request;

		await logout(user, token!);
	} catch (error) {
		fastify.log.error(error);
		reply.code(500).send({ error: 'Unknown error occured' });
	}
}

async function logoutAllHandler(request: FastifyRequest, reply: FastifyReply) {
	try {
		const user = request.authUser!;
		await logoutAll(user);
	} catch (error) {
		fastify.log.error(error);
		reply.code(500).send({ error: 'Unknown error occured' });
	}
}

async function getUserHandler(request: FastifyRequest, reply: FastifyReply) {
	try {
		const user = request.authUser!;
		return user;
	} catch (error) {
		fastify.log.error(error);
		reply.code(500).send({ error: 'Unknown error occured' });
	}
}

async function updateUserHandler(request: FastifyRequest<{ Body: UpdateUserSchema }>, reply: FastifyReply) {
	try {
		const user = request.authUser!;
		const { body } = request;

		return await updateUser(user, body);
	} catch (error) {
		fastify.log.error(error);
		reply.code(500).send({ error: 'Unknown error occured' });
	}
}

async function deleteUserHandler(request: FastifyRequest, reply: FastifyReply) {
	try {
		const user = request.authUser!;
		return deleteUser(user);
	} catch (error) {
		fastify.log.error(error);
		reply.code(500).send({ error: 'Unknown error occured' });
	}
}

async function addAvatarHandler(request: FastifyRequest, reply: FastifyReply) {
	try {
		const user = request.authUser!;

		const parts = request.files();
		let fileBuffer;

		for await (const data of parts) {
			if (!data.mimetype.startsWith('image')) {
				reply.code(403).send({ error: 'Only image files are allowed.' });
			}
			fileBuffer = await data.toBuffer();
		}

		// image processing
		fileBuffer = await sharp(fileBuffer).resize({ width: 250, height: 250 }).png().toBuffer();

		user.avatar = fileBuffer;
		await user.save();
	} catch (error) {
		fastify.log.error(error);
		reply.code(500).send({ error: 'Unknown error occured' });
	}
}

async function getOwnAvatarHandler(request: FastifyRequest, reply: FastifyReply) {
	try {
		const user = request.authUser!;

		if (!user.avatar) {
			reply.code(404).send({ error: 'Avatar was not found.' });
		}

		reply.header('Content-Type', 'image/png').send(user.avatar);
	} catch (error) {
		fastify.log.error(error);
		reply.code(500).send({ error: 'Unknown error occured' });
	}
}

async function deleteOwnAvatarHandler(request: FastifyRequest, reply: FastifyReply) {
	try {
		const user = request.authUser!;
		await deleteAvatar(user);
	} catch (error) {
		fastify.log.error(error);
		reply.code(500).send({ error: 'Unknown error occured' });
	}
}

async function getAvatarHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
	try {
		const avatar = await getAvatarById(request.params.id);

		if (!avatar) {
			reply.code(404).send({ error: 'Avatar was not found.' });
		}

		reply.header('Content-Type', 'image/png').send(avatar);
	} catch (error) {
		fastify.log.error(error);
		reply.code(500).send({ error: 'Unknown error occured' });
	}
}

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
	deleteOwnAvatarHandler,
};
