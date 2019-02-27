import { Document, Model, model, Schema } from 'mongoose';
import { IUsers } from './models';

export interface IUsersD extends Document, IUsers {}

const users = new Schema({
  userid: String,
  years: [
    {
      weeks: [
        {
          days: [{ day: String, steps: Number, multiplier: Number }],
          week: String,
        },
      ],
      year: String,
    },
  ],
});

export const User: Model<IUsersD> = model<IUsersD>('User', users);
