const User = require('./data');
const League = require('./leaguedata');
import { getDay, getWeek } from './server';
interface History {
  day: string;
  goal: number;
  steps: number;
  year: number;
}
class History {
  constructor(day: string, goal: number, steps: number, year: number) {
    this.day = day;
    this.goal = goal;
    this.steps = steps;
    this.year = year;
  }
}
export const getUser = async (userName: string, callback: any, error: any) => {
  try {
    const ret = await User.findOne({ name: userName });
    const data = new User(ret);
    const yearSize = data.year.length;
    const weekSize = data.year[yearSize - 1].week.length;
    const daySize = data.year[yearSize - 1].week[weekSize - 1].day.length;
    // console.log(data.year[yearSize-1].week[weekSize-1].day[daySize-1].day);
    if (data.year[yearSize - 1].week[weekSize - 1].day[daySize - 1].day === getDay()) {
      console.log('yurt');
    } else {
      data.year[yearSize - 1].week[weekSize - 1].day.push({
        day: getDay(),
        goal: data.year[yearSize - 1].week[weekSize - 1].day[daySize - 1].goal,
        steps: '0`',
      });
    }
    data
      .save()
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
    console.log(ret);
    callback(ret);
  } catch (e) {
    error();
  }
};

// takes userid and their steps and saves them to db
// /updateUser/:id/?steps=
export const updateUserSteps = async (userId: string, currentSteps: string, callback: any, error: any) => {
  try {
    console.log(userId);
    const ret = await User.findOne({ _id: userId });
    console.log(ret);
    const data = new User(ret);
    const yearSize = data.year.length;
    const weekSize = data.year[yearSize - 1].week.length;
    const daySize = data.year[yearSize - 1].week[weekSize - 1].day.length;

    console.log(currentSteps);
    if (getWeek() === data.year[yearSize - 1].week[weekSize - 1].week) {
      console.log('if1');
      console.log(getWeek());
      console.log(data.year[yearSize - 1].week[weekSize - 1].day[daySize - 1].day);
      if (data.year[yearSize - 1].week[weekSize - 1].day[daySize - 1].day === getDay()) {
        console.log('if12');
        data.year[yearSize - 1].week[weekSize - 1].day[daySize - 1].steps = currentSteps;
      } else {
        console.log('else12');
        data.year[yearSize - 1].week[weekSize - 1].day.push({
          day: getDay(),
          goal: data.year[yearSize - 1].week[weekSize - 1].day[daySize - 1].goal,
          steps: currentSteps,
        });
      }
    } else {
      console.log('else1');
      data.year[yearSize - 1].week.push({ week: getWeek() });
      data.year[yearSize - 1].week[weekSize].day.push({
        day: getDay(),
        goal: data.year[yearSize - 1].week[weekSize - 1].day[daySize - 1].goal,
        steps: currentSteps,
      });
    }

    data
      .save()
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
    console.log(ret);
    callback(ret);
  } catch (e) {
    error();
  }
};

// returns an array with the last five days history
// /getUserHomepage/:id
export const getUserHomePage = async (userId: string, callback: any, error: any) => {
  try {
    let r = 0;
    const ret = await User.findOne({ _id: userId });
    const data = new User(ret);
    console.log(ret);

    console.log(r++);
    let day;
    let year;
    let steps;
    let goal;
    console.log(data.year.length);
    const yearSize = data.year.length;
    console.log(yearSize);
    const weekSize = data.year[yearSize - 1].week.length;
    console.log(weekSize);
    const daySize = data.year[yearSize - 1].week[weekSize - 1].day.length;
    console.log(r++);
    let count = 0;
    let j;
    if (daySize >= 2) {
      j = daySize - 2;
    } else if (weekSize >= 2) {
      j = data.year[yearSize - 1].week[weekSize - 2].day.length;
      console.log('elseif');
    } else {
      console.log('No history available');
      return;
    }
    const hist: History[] = [];
    console.log(r++);
    for (let i = weekSize - 1; i >= 0 && count < 5; i--) {
      for (; j >= 0 && count < 5; j--) {
        console.log(r++);
        day = data.year[yearSize - 1].week[i].day[j].day;
        console.log(r++);
        year = data.year[yearSize - 1].year;
        console.log(r++);
        steps = data.year[yearSize - 1].week[i].day[j].steps;
        console.log(r++);
        goal = data.year[yearSize - 1].week[i].day[j].goal;
        console.log(count);
        const history1 = new History(day, goal, steps, year);
        hist.push(history1);
        count++;
      }
      j = data.year[yearSize - 1].week[weekSize - 2].day.length - 1;
    }
    console.log(r++);
    console.log('yurt');
    for (const index of hist) {
      console.log(index.steps + ' ' + index.day);
    }
    // callback(hist);
    callback(ret);
  } catch (e) {
    error();
  }
};

export const createNewUser = async (
  userName: string,
  fullYear: number,
  weekStart: string,
  date: string,
  goalNum: number,
  noSteps: number,
  callback: any,
  error: any,
) => {
  try {
    console.log('3');
    const user = new User({
      name: userName,
      totalSteps: noSteps,
      year: [
        {
          week: [
            {
              day: [{ day: date, goal: goalNum, steps: noSteps }],
              week: weekStart,
            },
          ],
          year: fullYear,
        },
      ],
    });
    console.log('4');
    user
      .save()
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
    callback(user);
  } catch (e) {
    error();
  }
};

export const createNewLeague = async (
  leagueID: string,
  name: string,
  leagueMember: string,
  callback: any,
  error: any,
) => {
  try {
    console.log('3');
    const league = new League({
      // _id: new mongoose.Types.ObjectId(),
      leagueId: leagueID,
      leagueName: name,
      members: [
        {
          memberId: leagueMember,
          multiplier: '1',
          score: '1',
        },
      ],
    });
    league
      .save()
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
    callback(league);
  } catch (e) {
    error();
  }
};

export const addLeagueMember = async (leagueID: string, memberID: string, callback: any, error: any) => {
  try {
    const ret = await League.findOne({ leagueId: leagueID });
    const league = new League(ret);
    console.log(league.members.length);
    console.log(leagueID);
    console.log(memberID);
    console.log(league.leagueName);
    league.members.push({
      memberId: memberID,
      multiplier: '1',
      score: '1',
    });
    callback(league);
  } catch (e) {
    error();
  }
};
export const getUserSteps = async (userName: string, currentDate: string, callback: any, error: any) => {
  try {
    const ret = await User.findOne({ name: userName });
    // console.log(ret);
    callback(ret);
  } catch (e) {
    error();
  }
};
