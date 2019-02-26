export interface IUserRepos {
  forks: ISizes;
  size: ISizes;
  stars: ISizes;
  issues: ISizes;
  user: string;
}

export interface ISizes {
  children: IRepoStat[];
  name: string;
}
interface IRepoStat {
  name: string;
  value: number;
  language: string;
}