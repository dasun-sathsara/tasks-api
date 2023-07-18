import { FilterTaskSchema, UpdateTaskSchema } from 'src/schemas/task.schemas';
import { TaskModel } from '../models/export';
import { User } from 'src/models/user.model';
import { DocumentType } from '@typegoose/typegoose';

interface SortOption {
	[key: string]: number;
}

interface MatchOption {
	completed?: boolean;
}

async function createTask(data: { description: string; completed?: boolean; owner: string }) {
	return await TaskModel.create(data);
}

async function updateTask(id: string, update: UpdateTaskSchema) {
	return await TaskModel.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });
}

async function getTask(userId: string, taskId: string) {
	return await TaskModel.findOne({ _id: taskId, owner: userId });
}

async function deleteTask(id: string) {
	return await TaskModel.deleteOne({ _id: id });
}

async function filterTasks(user: DocumentType<User>, filters: FilterTaskSchema) {
	const sort: SortOption = {};
	const match: MatchOption = {};

	if ('completed' in filters) {
		match['completed'] = filters.completed;
	}

	if (filters.sortBy) {
		let [field, order] = filters.sortBy.split(':');

		sort[field!] = order === 'desc' ? -1 : 1;
	}

	await user.populate({
		path: 'tasks',
		match,
		options: {
			limit: filters.limit,
			skip: filters.skip,
			sort,
		},
	});

	return user.tasks;
}

export { createTask, updateTask, getTask, deleteTask, filterTasks };
