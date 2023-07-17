import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';

const userSchema = {
	name: z.string({ required_error: 'Name is required', invalid_type_error: 'Name must be a string' }),
	email: z.string({ required_error: 'Email is required', invalid_type_error: 'Email must be a string' }).email(),
	age: z.number({ invalid_type_error: 'Age must be an integer' }).optional(),
};

const addUserSchema = z.object({
	...userSchema,
	password: z.string({ required_error: 'Password is required', invalid_type_error: 'Password must be a string' }),
});

type AddUserInput = z.infer<typeof addUserSchema>;

const { schemas: userSchemas, $ref } = buildJsonSchemas({
	addUserSchema,
});

export { AddUserInput, userSchemas, $ref };
