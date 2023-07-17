import { FastifyReply, FastifyRequest } from 'fastify';

async function createTaskHandler(request: FastifyRequest, reply: FastifyReply) {}
async function findTasksHandler(request: FastifyRequest, reply: FastifyReply) {}
async function getTaskByIdHandler(request: FastifyRequest, reply: FastifyReply) {}
async function deleteTaskdHandler(request: FastifyRequest, reply: FastifyReply) {}
async function updateTaskHandler(request: FastifyRequest, reply: FastifyReply) {}

export { createTaskHandler, findTasksHandler, getTaskByIdHandler, deleteTaskdHandler, updateTaskHandler };
