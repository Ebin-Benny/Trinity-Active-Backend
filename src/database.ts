const User = require('./data');
const League = require('./data');
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
    if (data.year[yearSize - 1].week[weekSize - 1].day[daySize - 1].day === getDay()) {
      data.year[yearSize - 1].week[weekSize - 1].day[daySize - 1].steps = currentSteps;
    } else {
      data.year[yearSize - 1].week[weekSize - 1].day.push({
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
    console.log(r++);
    let day;
    let year;
    let steps;
    let goal;
    const yearSize = data.year.length;
    const weekSize = data.year[yearSize - 1].week.length;
    const daySize = data.year[yearSize - 1].week[weekSize - 1].day.length;
    console.log(r++);
    console.log(userId);
    let count = 0;
    let j;
    if (daySize >= 2) {
      j = daySize - 2;
    } else if (weekSize >= 2) {
      j = data.year[yearSize - 1].week[weekSize - 2].day.length;
      console.log('elseif');
    } else {
      console.log('No history available');
      callback(ret);
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
    console.log(ret);
    callback(hist);
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
