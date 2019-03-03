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
  steps: number;
  multiplier: number;
}
