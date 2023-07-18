import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';

const addTaskSchema = z.object({
	description: z.string({
		required_error: 'Description is required',
		invalid_type_error: 'Description must be a string',
	}),
	completed: z.boolean({ invalid_type_error: 'Completed must be a boolean' }).optional(),
});

const updateTaskSchema = z.object({
	description: z
		.string({
			invalid_type_error: 'Description must be a string',
		})
		.optional(),
	completed: z.boolean({ invalid_type_error: 'Completed must be a boolean' }).optional(),
});

const taskIdSchema = z.object({
	id: z.string({ required_error: 'ID is required', invalid_type_error: 'ID must be a string' }),
});

const filterTasksSchema = z
	.object({
		completed: z.boolean({ invalid_type_error: 'Completed must be a boolean' }).optional(),
		limit: z.number({ invalid_type_error: 'Limit must be a integer' }).optional(),
		skip: z.number({ invalid_type_error: 'Skip must be a integer' }).optional(),
		sortBy: z.string({ invalid_type_error: 'SortBy must be a string' }).optional(),
	})
	.refine(
		data => {
			// returns true when either limit is not specified or limit and skip both are specified
			return data.limit === undefined || data.skip !== undefined;
		},
		{ message: 'Skip is required when limit is specified', path: ['skip'] },
	)
	.refine(
		data => {
			if (data.sortBy?.includes(':')) {
				const [column, order] = data.sortBy.split(':');
				return ['description', 'createdAt', 'updatedAt'].includes(column!) && ['asc', 'desc'].includes(order!);
			}

			return true;
		},
		{ message: 'SortBy should have the following structure: <field_name>:[asc|desc]', path: ['sortBy'] },
	);

type AddTaskSchema = z.infer<typeof addTaskSchema>;
type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
type FilterTaskSchema = z.infer<typeof filterTasksSchema>;

const { schemas: taskSchemas, $ref } = buildJsonSchemas(
	{
		addTaskSchema,
		taskIdSchema,
		filterTasksSchema,
		updateTaskSchema,
	},
	{ $id: 'taskSchema' },
);

export { AddTaskSchema, UpdateTaskSchema, FilterTaskSchema, filterTasksSchema, taskSchemas, $ref };
