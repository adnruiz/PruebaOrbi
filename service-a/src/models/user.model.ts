import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    age: number;
    updatedAt?: Date;
}

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    updatedAt: { type: Date }
});

export const User = mongoose.model<IUser>('User', UserSchema);