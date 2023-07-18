import { User } from './user.model';
import { Task } from './task.model';
import { getModelForClass } from '@typegoose/typegoose';

const UserModel = getModelForClass(User);
const TaskModel = getModelForClass(Task);

export { UserModel, TaskModel };
