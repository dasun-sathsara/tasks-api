import { FastifyInstance } from 'fastify';
import {
	createTaskHandler,
	deleteTaskHandler,
	filterTasksHandler,
	getTaskHandler,
	updateTaskHandler,
} from '../controllers/task.controller';
import { $ref, AddTaskSchema, UpdateTaskSchema } from '../schemas/task.schemas';

// route: api/tasks
async function taskRoutes(fastify: FastifyInstance) {
	fastify.post<{ Body: AddTaskSchema }>(
		'/',
		{ preHandler: [fastify.authenticate], schema: { body: $ref('addTaskSchema') } },
		createTaskHandler,
	);

	// GET /tasks?completed=true
	// GET /tasks?limit=10&skip=20
	// GET /tasks?sortBy=createdAt:desc
	fastify.get(
		'/',
		{ preHandler: [fastify.authenticate], schema: { querystring: $ref('filterTasksSchema') } },
		filterTasksHandler,
	);

	fastify.get<{ Params: { id: string } }>(
		'/:id',
		{ preHandler: [fastify.authenticate], schema: { params: $ref('taskIdSchema') } },
		getTaskHandler,
	);

	fastify.patch<{ Body: UpdateTaskSchema; Params: { id: string } }>(
		'/:id',
		{ preHandler: [fastify.authenticate], schema: { body: $ref('updateTaskSchema'), params: $ref('taskIdSchema') } },
		updateTaskHandler,
	);

	fastify.delete<{ Params: { id: string } }>(
		'/:id',
		{ preHandler: [fastify.authenticate], schema: { params: $ref('taskIdSchema') } },
		deleteTaskHandler,
	);
}

export default taskRoutes;
