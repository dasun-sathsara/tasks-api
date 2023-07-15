import { User } from './user.model';
import { Task } from './task.model';
import { getModelForClass } from '@typegoose/typegoose';

const UserModel = getModelForClass(User);
const TaskModel = getModelForClass(Task);

export { UserModel, TaskModel };

// * trying things out

// async function main() {
// import * as mongoose from 'mongoose';
// 	try {
// 		await mongoose.connect('mongodb://dasun:Ds20020618@localhost:27017');
// 		console.log('Connected to the database');
// 	} catch (error) {
// 		console.log(error);
// 	}

// 	let a = await UserModel.create({
// 		name: 'Dasun',
// 		age: 21,
// 		email: 'kdasun@gmail.com',
// 		password: 'hh$*gjkd',
// 		tokens: [{ token: 'hi' }, { token: 'hi4' }],
// 	});

// 	await a.save();

// 	let b = await UserModel.findOne({ name: 'Kasun' });

// 	await TaskModel.create({ description: 'write code', completed: false, owner: b?._id });
// 	await TaskModel.create({ description: 'go to mall', completed: true, owner: b?._id });

// 	await b?.populate({ path: 'tasks' });
// 	console.log(b?.tasks);
// }

// main();
