import { FastifyReply, FastifyRequest } from 'fastify';
import { filterTasksSchema, AddTaskSchema, UpdateTaskSchema } from '../schemas/task.schemas';
import { ZodError } from 'zod';
import { fastify } from '../index';
import { createTask, deleteTask, filterTasks, getTask, updateTask } from '../services/task.services';

async function createTaskHandler(request: FastifyRequest<{ Body: AddTaskSchema }>, reply: FastifyReply) {
	try {
		const { description, completed } = request.body;
		const { id: owner } = request.authUser!;

		const task = await createTask({ description, completed, owner });
		return task;
	} catch (error) {
		fastify.log.error(error);
		reply.status(500).send({ error: 'Unknown error occured' });
	}
}

async function filterTasksHandler(request: FastifyRequest, reply: FastifyReply) {
	try {
		const user = request.authUser!;
		const queryParams = filterTasksSchema.parse(request.query);

		return await filterTasks(user, queryParams);
	} catch (error) {
		if (error instanceof ZodError) {
			reply.status(400).send(error.flatten());
		} else {
			fastify.log.error(error);
			reply.status(500).send({ error: 'Unknown error occured' });
		}
	}
}

async function updateTaskHandler(
	request: FastifyRequest<{ Params: { id: string }; Body: UpdateTaskSchema }>,
	reply: FastifyReply,
) {
	try {
		const { id: userId } = request.authUser!;
		const { id: taskId } = request.params;

		const task = await getTask(userId, taskId);

		if (!task) {
			reply.code(404).send({ error: 'Task was not found.' });
		}

		return await updateTask(taskId, request.body);
	} catch (error) {
		fastify.log.error(error);
		reply.status(500).send({ error: 'Unknown error occured' });
	}
}

async function getTaskHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
	try {
		const { id: userId } = request.authUser!;
		const { id: taskId } = request.params;

		const task = await getTask(userId, taskId);

		if (!task) {
			reply.code(404).send({ error: 'Task was not found.' });
		}

		return task;
	} catch (error) {
		fastify.log.error(error);
		reply.status(500).send({ error: 'Unknown error occured' });
	}
}

async function deleteTaskHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
	try {
		const { id: userId } = request.authUser!;
		const { id: taskId } = request.params;

		const task = await getTask(userId, taskId);

		if (!task) {
			reply.code(404).send({ error: 'Task was not found.' });
		}

		await deleteTask(request.params.id);
	} catch (error) {
		fastify.log.error(error);
		reply.status(500).send({ error: 'Unknown error occured' });
	}
}

export { createTaskHandler, filterTasksHandler, getTaskHandler, deleteTaskHandler, updateTaskHandler };
