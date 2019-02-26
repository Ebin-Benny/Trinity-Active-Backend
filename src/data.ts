import { Document, Model, model, Schema } from 'mongoose';
import { IUserRepos } from './models';

export interface IUserReposData extends Document, IUserRepos { }

const userRepos = new Schema({
  forks: {
    children: [
      {
        language: String,
        name: String,
        value: Number,
      },
    ],
    name: String,
  },
  issues: {
    children: [
      {
        language: String,
        name: String,
        value: Number,
      },
    ],
    name: String,
  },
  size: {
    children: [
      {
        language: String,
        name: String,
        value: Number,
      },
    ],
    name: String,
  },
  stars: {
    children: [
      {
        language: String,
        name: String,
        value: Number,
      },
    ],
    name: String,
  },
  user: String,
});

export const UserRepos: Model<IUserReposData> = model<IUserReposData>('UserRepos', userRepos);
