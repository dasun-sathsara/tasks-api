import { prop, modelOptions, Ref, DocumentType } from '@typegoose/typegoose';
import { User } from './user.model';

@modelOptions({ schemaOptions: { timestamps: true } })
class Task {
	@prop({ type: String, required: true, trim: true })
	public description!: string;

	@prop({ type: Boolean, default: false })
	public completed?: boolean;

	@prop({ type: () => User, required: true, ref: () => User })
	public owner!: Ref<User>;

	// the return value of this method will be used in JSON.stringify
	public toJSON(this: DocumentType<Task>) {
		const task = this;
		const taskObject = task.toObject() as Partial<Task> & { _id?: string; id?: string; __v?: string };

		const { owner, __v, _id, ...rest } = taskObject;

		const result = { ...rest };

		result.id = _id;

		return result;
	}
}

export { Task };
