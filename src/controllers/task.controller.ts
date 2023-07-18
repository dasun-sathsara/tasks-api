import { FastifyReply, FastifyRequest } from 'fastify';
import { findTaskSchema, AddTaskSchema, UpdateTaskSchema } from '../schemas/task.schemas';
import { ZodError } from 'zod';
import { fastify } from '../index';
import { createTask } from '../services/task.services';

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

async function findTasksHandler(request: FastifyRequest, reply: FastifyReply) {
	try {
		const queryParams = findTaskSchema.parse(request.query);
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
) {}

async function getTaskByIdHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {}

async function deleteTaskdHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {}

export { createTaskHandler, findTasksHandler, getTaskByIdHandler, deleteTaskdHandler, updateTaskHandler };
