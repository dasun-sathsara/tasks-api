import { AddUserSchema, UpdateUserSchema } from '../schemas/user.schemas';
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

async function updateUser(user: DocumentType<User>, update: UpdateUserSchema) {
	for (const prop in update) {
		// @ts-ignore
		user[prop] = update[prop];
	}

	await user.save();
	return user;
}

async function deleteUser(user: DocumentType<User>) {
	return await user.deleteOne();
}

async function deleteAvatar(user: DocumentType<User>) {
	user.avatar = undefined;
	await user.save();
}

async function getAvatarById(userId: string) {
	return (await UserModel.findById(userId))?.avatar;
}

export { createUser, logout, logoutAll, updateUser, deleteUser, deleteAvatar, getAvatarById };
