import { FastifyReply, FastifyRequest } from 'fastify';
import { filterTasksSchema, AddTaskSchema, UpdateTaskSchema } from '../schemas/task.schemas';
import { ZodError } from 'zod';
import { fastify } from '../index';
import { createTask, deleteTask, filterTasks, getTask, updateTask } from '../services/task.services';
import { isValidObjectId } from 'mongoose';

async function createTaskHandler(request: FastifyRequest<{ Body: AddTaskSchema }>, reply: FastifyReply) {
	try {
		const { description, completed } = request.body;
		const { id: owner } = request.authUser!;

		const task = await createTask({ description, completed, owner });
		return task;
	} catch (error) {
		fastify.log.error(error);
		reply.status(520).send({ error: 'Unknown error occured' });
	}
}

async function filterTasksHandler(request: FastifyRequest, reply: FastifyReply) {
	try {
		const user = request.authUser!;
		const queryParams = filterTasksSchema.parse(request.query);

		return await filterTasks(user, queryParams);
	} catch (error) {
		fastify.log.error(error);

		if (error instanceof ZodError) {
			reply.status(403).send(error.flatten());
		} else {
			reply.status(520).send({ error: 'Unknown error occured' });
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

		if (!isValidObjectId(taskId)) {
			return reply.code(403).send({ error: 'Bad task ID.' });
		}

		const task = await getTask(userId, taskId);

		if (!task) {
			return reply.code(404).send({ error: 'Task was not found.' });
		}

		return await updateTask(taskId, request.body);
	} catch (error) {
		fastify.log.error(error);
		reply.status(520).send({ error: 'Unknown error occured' });
	}
}

async function getTaskHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
	try {
		const { id: userId } = request.authUser!;
		const { id: taskId } = request.params;

		if (!isValidObjectId(taskId)) {
			return reply.code(403).send({ error: 'Bad task ID.' });
		}

		const task = await getTask(userId, taskId);

		if (!task) {
			return reply.code(404).send({ error: 'Task was not found.' });
		}

		return task;
	} catch (error) {
		fastify.log.error(error);
		reply.status(520).send({ error: 'Unknown error occured' });
	}
}

async function deleteTaskHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
	try {
		const { id: userId } = request.authUser!;
		const { id: taskId } = request.params;

		if (!isValidObjectId(taskId)) {
			return reply.code(403).send({ error: 'Bad task ID.' });
		}

		const task = await getTask(userId, taskId);

		if (!task) {
			return reply.code(404).send({ error: 'Task was not found.' });
		}

		await deleteTask(request.params.id);
	} catch (error) {
		fastify.log.error(error);
		reply.status(520).send({ error: 'Unknown error occured' });
	}
}

export { createTaskHandler, filterTasksHandler, getTaskHandler, deleteTaskHandler, updateTaskHandler };
