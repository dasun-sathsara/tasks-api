import { prop, modelOptions, pre, DocumentType, Ref, ReturnModelType } from '@typegoose/typegoose';
import isEmail from 'validator/lib/isEmail';
import * as bcrypt from 'bcrypt';
import { Task } from './task.model';
import { TaskModel } from './export';

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
		required: true,
		validate: { validator: (value: number) => value > 0, message: 'Age should be positive' },
	})
	public age!: number;

	@prop({ type: () => [Token] })
	public tokens?: Token[];

	@prop({ type: () => Buffer })
	public avatar?: Buffer;

	@prop({ ref: () => Task, foreignField: 'owner', localField: '_id' })
	public tasks?: Ref<Task>[];

	// TODO: implement
	public async generateAuthToken(this: DocumentType<User>) {}

	// the return value of this method will be used in JSON.stringify
	public toJson(this: DocumentType<User>) {
		const user = this;
		const userObject = user.toObject() as Partial<User>;

		delete userObject.password;
		delete userObject.tokens;
		delete userObject.avatar;

		return userObject;
	}

	// TODO: implement
	public static async findByCredentials(this: ReturnModelType<typeof User>, email: string, password: string) {}
}

class Token {
	@prop({ type: String, required: true })
	public token!: string;
}

export { User };
