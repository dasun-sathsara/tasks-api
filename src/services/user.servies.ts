import { AddUserInput } from '../schemas/user.schemas';
import { UserModel } from '../models/export';

async function createUser(data: AddUserInput) {
	try {
		const user = await UserModel.create({ ...data });
		return user;
	} catch (error) {
		if (error instanceof Error && 'code' in error && error.code === 11000) {
			throw new Error('User already exists.');
		} else {
			throw new Error('Unknown error occured.');
		}
	}
}

export { createUser };
