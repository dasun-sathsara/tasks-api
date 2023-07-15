import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { User } from './user.model';

@modelOptions({ schemaOptions: { timestamps: true } })
class Task {
	@prop({ type: String, required: true, trim: true })
	public description!: string;

	@prop({ type: Boolean, default: false })
	public completed?: boolean;

	@prop({ type: () => User, required: true, ref: () => User })
	public owner!: Ref<User>;
}

export { Task };
