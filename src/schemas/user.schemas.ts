import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';

const userSchema = {
	name: z.string({ required_error: 'Name is required', invalid_type_error: 'Name must be a string' }),
	email: z.string({ required_error: 'Email is required', invalid_type_error: 'Email must be a string' }).email(),
	age: z.number({ invalid_type_error: 'Age must be an integer' }).optional(),
};

const addUserSchema = z.object({
	...userSchema,
	password: z.string({
		required_error: 'Password is required',
		invalid_type_error: 'Password must be a string',
	}),
});

const loginSchema = z.object({
	email: z.string({ required_error: 'Email is required', invalid_type_error: 'Email must be a string' }).email(),
	password: z.string({
		required_error: 'Password is required',
		invalid_type_error: 'Password must be a string',
	}),
});

const updateUserSchema = z.object({
	name: z.string({ required_error: 'Name is required', invalid_type_error: 'Name must be a string' }).optional(),
	email: z
		.string({ required_error: 'Email is required', invalid_type_error: 'Email must be a string' })
		.email()
		.optional(),
	age: z.number({ invalid_type_error: 'Age must be an integer' }).optional(),
	password: z
		.string({ required_error: 'Password is required', invalid_type_error: 'Password must be a string' })
		.optional(),
});

const getAvatarSchema = z.object({
	id: z.string({ required_error: 'ID is required', invalid_type_error: 'ID must be a string' }),
});

type AddUserSchema = z.infer<typeof addUserSchema>;
type LoginSchema = z.infer<typeof loginSchema>;
type UpdateUserSchema = z.infer<typeof updateUserSchema>;

const { schemas: userSchemas, $ref } = buildJsonSchemas({
	addUserSchema,
	loginSchema,
	updateUserSchema,
	getAvatarSchema,
});

export { AddUserSchema, LoginSchema, UpdateUserSchema, userSchemas, $ref };
