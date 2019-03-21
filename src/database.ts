const User = require('./data');
const League = require('./data');
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
        steps: '14300',
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
// /updateUser/:id
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
    const ret = await User.findOne({ _id: userId });
    const data = new User(ret);
    let day;
    let year;
    let steps;
    let goal;
    const yearSize = data.year.length;
    const weekSize = data.year[yearSize - 1].week.length;
    const daySize = data.year[yearSize - 1].week[weekSize - 1].day.length;
    console.log(userId);
    let count = 0;
    let j = daySize - 2;
    const hist: History[] = [];
    for (let i = weekSize - 1; i >= 0 && count < 6; i--) {
      for (; j >= 0 && count < 6; j--) {
        day = data.year[yearSize - 1].week[i].day[j].day;
        year = data.year[yearSize - 1].year;
        steps = data.year[yearSize - 1].week[i].day[j].steps;
        goal = data.year[yearSize - 1].week[i].day[j].goal;
        console.log(count);
        const history1 = new History(day, goal, steps, year);
        hist.push(history1);
        count++;
      }
      j = data.year[yearSize - 1].week[weekSize - 2].day.length - 1;
    }
    console.log('yurt');
    for (const index of hist) {
      console.log(index.steps + ' ' + index.day);
    }
    console.log(ret);
    callback(ret);
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

function getDay() {
  const d = new Date();
  const currentDate = d.getDate() + '-' + (d.getMonth() + 1);
  return currentDate;
}
