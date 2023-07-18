import { AddUserSchema } from '../schemas/user.schemas';
import { UserModel } from '../models/export';
import { DocumentType } from '@typegoose/typegoose';
import { User } from 'src/models/user.model';

async function createUser(data: AddUserSchema) {
	return await UserModel.create(data);
}

async function logout(user: DocumentType<User>, authToken: string) {
	user.tokens = user.tokens.filter(token => {
		return token.token !== authToken;
	});

	await user.save();
}

async function logoutAll(user: DocumentType<User>) {
	user.tokens = [];
	await user.save();
}

export { createUser, logout, logoutAll };
