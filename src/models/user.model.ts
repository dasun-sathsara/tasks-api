import { prop, modelOptions, pre, DocumentType, Ref, ReturnModelType } from '@typegoose/typegoose';
import isEmail from 'validator/lib/isEmail';
import * as bcrypt from 'bcrypt';
import { Task } from './task.model';
import { TaskModel, UserModel } from './export';
import * as jwt from 'jsonwebtoken';

// custom authentication error
class AuthError extends Error {
	constructor(public message: string) {
		super(message);

		// Set the prototype explicitly to preserve the instanceof check
		Object.setPrototypeOf(this, AuthError.prototype);
	}
}

/*
deleting user's tasks when the user is deleted
*/
@pre<User>(
	'deleteOne',
	async function (next) {
		const user = this;

		TaskModel.deleteMany({ owner: (await user)._id });
		next();
	},
	{ document: true },
)
/*
hashing the password before saving in to the db
*/
@pre<User>('save', async function (next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}

	next();
})
@modelOptions({ schemaOptions: { timestamps: true } })
class User {
	@prop({ type: String, required: true, trim: true })
	public name!: string;

	@prop({
		type: String,
		unique: true,
		required: true,
		trim: true,
		lowercase: true,
		validate: {
			validator: (value: string) => isEmail(value),
			message: 'Email is invalid',
		},
	})
	public email!: string;

	@prop({
		type: String,
		required: true,
		trim: true,
		minlength: 7,
		validate: {
			validator: (value: string) => !value.toLowerCase().includes('password'),
			message: "Password cannot contain 'password'. ",
		},
	})
	public password!: string;

	@prop({
		type: Number,
		validate: { validator: (value: number) => value > 0, message: 'Age should be positive' },
	})
	public age?: number;

	@prop({ type: () => [Token], default: [] })
	public tokens!: Token[];

	@prop({ type: () => Buffer })
	public avatar?: Buffer;

	@prop({ ref: () => Task, foreignField: 'owner', localField: '_id' })
	public tasks?: Ref<Task>[];

	public async generateAuthToken(this: DocumentType<User>) {
		const user = this;
		const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET!);

		user.tokens = user.tokens.concat({ token });
		await user.save();

		return token;
	}

	// the return value of this method will be used in JSON.stringify
	public toJSON(this: DocumentType<User>) {
		const user = this;
		const userObject = user.toObject() as Partial<User> & { _id?: string; id?: string; __v?: string };

		const { password, tokens, avatar, __v, _id, ...rest } = userObject;

		const result = { ...rest };

		result.id = _id;

		return result;
	}

	public static async findByCredentials(this: ReturnModelType<typeof User>, email: string, password: string) {
		const user = await UserModel.findOne({ email });

		if (!user) {
			throw new AuthError('Authentication failure.');
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			throw new AuthError('Authentication failure.');
		}

		return user;
	}
}

class Token {
	@prop({ type: String, required: true })
	public token!: string;
}

export { User, AuthError };
