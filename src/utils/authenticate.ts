import { FastifyReply, FastifyRequest } from 'fastify';
import { UserModel } from '../models/export';
import * as jwt from 'jsonwebtoken';
import { AuthError } from './errors';

// Define an interface for the payload
interface Payload {
	_id: string;
}

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
	try {
		const token = request.headers['authorization']?.replace('Bearer ', '');

		if (!token) {
			throw new AuthError('Authentication token must be provided');
		}

		const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as Payload;
		const user = await UserModel.findOne({ _id: decodedToken._id, 'tokens.token': token });

		if (!user) {
			throw new AuthError('Authentication failure');
		}

		request.authUser = user;
		request.token = token;
	} catch (error) {
		if (error instanceof AuthError) {
			reply.code(401).send({ error: error.message });
		} else {
			reply.code(500).send({ error: 'Unknown error occured' });
		}
	}
}

export default authenticate;
