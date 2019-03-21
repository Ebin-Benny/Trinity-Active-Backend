export interface IUsers {
  userid: string;
  totalSteps: number;
  years: IYear[];
}

interface IYear {
  year: string;
  weeks: IWeek[];
}
interface IWeek {
  week: string;
  days: IDay[];
}
interface IDay {
  day: string;
  goal: string;
  steps: number;
}

export interface ILeague {
  leagueId: string;
  leagueName: string;
  members: IMember;
}

interface IMember {
  memberId: string;
  multilier: string;
}
