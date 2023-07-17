import { FastifyInstance } from 'fastify';
import {
	createTaskHandler,
	deleteTaskdHandler,
	findTasksHandler,
	getTaskByIdHandler,
	updateTaskHandler,
} from '../controllers/task.controller';
import { $ref } from '../schemas/task.schemas';

// route: api/tasks
async function taskRoutes(fastify: FastifyInstance) {
	fastify.post('/', { schema: { body: $ref('addTaskSchema') } }, createTaskHandler);

	// GET /tasks?completed=true
	// GET /tasks?limit=10&skip=20
	// GET /tasks?sortBy=createdAt:desc
	fastify.get('/', { schema: { querystring: $ref('findTaskSchema') } }, findTasksHandler);

	fastify.get('/:id', { schema: { params: $ref('taskIdSchema') } }, getTaskByIdHandler);

	fastify.patch(
		'/:id',
		{ schema: { body: $ref('updateTaskSchema'), params: $ref('taskIdSchema') } },
		updateTaskHandler,
	);

	fastify.delete('/:id', { schema: { params: $ref('taskIdSchema') } }, deleteTaskdHandler);
}

export default taskRoutes;
