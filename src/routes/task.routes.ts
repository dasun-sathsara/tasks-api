import { FastifyInstance } from 'fastify';
import {
	createTaskHandler,
	deleteTaskdHandler,
	findTasksHandler,
	getTaskByIdHandler,
	updateTaskHandler,
} from 'src/controllers/task.controller';

// route: api/tasks
async function taskRoutes(fastify: FastifyInstance) {
	fastify.post('/', createTaskHandler);

	// GET /tasks?completed=true
	// GET /tasks?limit=10&skip=20
	// GET /tasks?sortBy=createdAt:desc
	fastify.get('/', findTasksHandler);

	fastify.get('/:id', getTaskByIdHandler);

	fastify.patch('/:id', updateTaskHandler);

	fastify.delete('/:id', deleteTaskdHandler);
}

export default taskRoutes;
