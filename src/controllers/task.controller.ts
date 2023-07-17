import { FastifyReply, FastifyRequest } from 'fastify';
import { findTaskSchema } from '../schemas/task.schemas';
import { ZodError } from 'zod';

async function createTaskHandler(request: FastifyRequest, reply: FastifyReply) {}
async function findTasksHandler(request: FastifyRequest, reply: FastifyReply) {
	try {
		const queryParams = findTaskSchema.parse(request.query);
	} catch (error) {
		if (error instanceof ZodError) {
			reply.status(400).send(error.flatten());
		} else {
			reply.status(500).send(error);
		}
	}
}
async function getTaskByIdHandler(request: FastifyRequest, reply: FastifyReply) {}
async function deleteTaskdHandler(request: FastifyRequest, reply: FastifyReply) {}
async function updateTaskHandler(request: FastifyRequest, reply: FastifyReply) {}

export { createTaskHandler, findTasksHandler, getTaskByIdHandler, deleteTaskdHandler, updateTaskHandler };
