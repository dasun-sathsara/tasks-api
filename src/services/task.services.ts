import { TaskModel } from '../models/export';

async function createTask(data: { description: string; completed?: boolean; owner: string }) {
	return await TaskModel.create(data);
}

export { createTask };
