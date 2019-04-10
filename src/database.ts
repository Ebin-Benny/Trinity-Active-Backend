const User = require('./data');
const League = require('./leaguedata');
import { callbackify } from 'util';
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

interface UserScore {
  multiplier: number;
  score: number;
}

// tslint:disable-next-line:max-classes-per-file
class UserScore {
  constructor(multiplier: number, score: number) {
    this.multiplier = multiplier;
    this.score = score;
  }
}
interface Homepage {
  goal: number;
  hist: History[];
  lifetimeSteps: number;
  league: string[];
}
// tslint:disable-next-line:max-classes-per-file
class Homepage {
  constructor(hist: History[], league: string[], goal: number, lifetimeSteps: number) {
    this.hist = hist;
    this.league = league;
    this.goal = goal;
    this.lifetimeSteps = lifetimeSteps;
  }
}

export const getLeague = async (leagueID: string, callback: any, error: any) => {
  try {
    const ret = await League.findOne({ leagueId: leagueID });
    callback(ret);
  } catch (e) {
    error();
  }
};

export const userLookup = async (userID: string, callback: any, error: any) => {
  try {
    console.log(userID.length);
    if (userID.length !== 16) {
      console.log('not 16');
      callback(0);
    }
    const ret = await User.findOne({ fuserid: userID });
    console.log(ret);
    if (ret != null) {
      callback(1);
    } else {
      callback(0);
    }
  } catch (e) {
    error();
  }
};

// takes userid and their steps and saves them to db
// /updateUser/:id/?steps=
export const updateUserSteps = async (userId: string, currentSteps: string, callback: any, error: any) => {
  try {
    console.log(userId);
    const ret = await User.findOne({ fuserid: userId });
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
        data.totalSteps = data.totalSteps + data.year[yearSize - 1].week[weekSize - 1].day[daySize - 1].steps;
        console.log('else12');
        data.year[yearSize - 1].week[weekSize - 1].day.push({
          day: getDay(),
          goal: data.year[yearSize - 1].week[weekSize - 1].day[daySize - 1].goal,
          steps: currentSteps,
        });
      }
    } else {
      console.log('else1');
      data.totalSteps = data.totalSteps + data.year[yearSize - 1].week[weekSize - 1].day[daySize - 1].steps;
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

export const updateUserGoal = async (userId: string, goal: number, callback: any, error: any) => {
  try {
    console.log(goal);
    const ret = await User.findOne({ fuserid: userId });
    console.log(ret);
    const data = new User(ret);
    const yearSize = data.year.length;
    const weekSize = data.year[yearSize - 1].week.length;
    const daySize = data.year[yearSize - 1].week[weekSize - 1].day.length;

    data.year[yearSize - 1].week[weekSize - 1].day[daySize - 1].goal = goal;
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

export const updateScore = async (userId: string, leagueID: string, callback: any, error: any) => {
  try {
    // console.log(goal);
    const use = await User.findOne({ fuserid: userId });
    const ret = await League.findOne({ leagueId: leagueID });
    console.log(ret);
    const user = new User(use);
    const league = new League(ret);
    let dayJoined;
    let index;
    for (let l = 0; l < league.members.length; l++) {
      if (league.members[l].memberId === userId) {
        index = l;
        dayJoined = league.members[l].dateJoined;
      }
    }
    let day;
    const yearSize = user.year.length;
    const weekSize = user.year[yearSize - 1].week.length;
    const daySize = user.year[yearSize - 1].week[weekSize - 1].day.length;
    const goal = league.goal;
    let multiplier = 1;
    let score = 0;
    let j;
    if (daySize >= 2) {
      j = daySize - 2;
    }
    let dayIn;
    let weekIn;
    let i = weekSize - 1;
    for (; i >= 0; i--) {
      for (; j >= 0; j--) {
        console.log(i + '  ' + j);
        day = user.year[yearSize - 1].week[i].day[j].day;
        if (dayJoined === day) {
          console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;' + '  ' + day);
          dayIn = j;
          weekIn = i;
          continue;
        }
      }
      if (i >= 1) {
        console.log('if');
        j = user.year[yearSize - 1].week[i - 1].day.length - 1;
        console.log(j);
      }
    }
    console.log('for 2');
    for (; weekIn <= user.year[yearSize - 1].week.length - 1; weekIn++) {
      console.log(user.year[yearSize - 1].week[weekIn].day.length);
      console.log('week ' + weekIn + '   day ' + dayIn);
      for (; dayIn <= user.year[yearSize - 1].week[weekIn].day.length - 1; dayIn++) {
        day = user.year[yearSize - 1].week[weekIn].day[dayIn].day;
        console.log(day);
        console.log('multi: ' + multiplier + '  steps: ' + user.year[yearSize - 1].week[weekIn].day[dayIn].steps);
        // score = score + multiplier * user.year[yearSize - 1].week[weekIn].day[dayIn].steps;
        console.log(score);
        if (user.year[yearSize - 1].week[weekIn].day[dayIn].steps >= goal) {
          score = score + multiplier * goal;
          multiplier++;
          score = score + (user.year[yearSize - 1].week[weekIn].day[dayIn].steps - goal) * multiplier;
          console.log(score);
        } else {
          score = score + multiplier * user.year[yearSize - 1].week[weekIn].day[dayIn].steps;
          console.log(score);
          console.log(multiplier);
          multiplier = 1;
        }
      }
      dayIn = 0;
      console.log('week ' + weekIn + '   day ' + dayIn);
    }

    console.log(score);
    league.members[index].multiplier = multiplier;
    league.members[index].score = score;
    const userReturn = new UserScore(multiplier, score);
    league
      .save()
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
    console.log(ret);
    callback(userReturn);
  } catch (e) {
    error();
  }
};

export const updateTodaysStepsBool = async (
  userId: string,
  leagueID: string,
  updatedToday: boolean,
  callback: any,
  error: any,
) => {
  try {
    // console.log(goal);
    const ret = await League.findOne({ leagueId: leagueID });
    console.log(ret);
    const league = new League(ret);
    console.log('1');
    let index;
    for (let i = 0; i < league.members.length; i++) {
      console.log(i + 'nurt');
      if (league.members[i].memberId === userId) {
        console.log(i);
        index = i;
      }
    }
    console.log('no');
    league.members[index].updatedToday = updatedToday;
    console.log('yes');
    league
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
    const ret = await User.findOne({ fuserid: userId });
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
    const daySize = data.year[yearSize - 1].week[weekSize - 1].day.length;
    const goalToRet = data.year[yearSize - 1].week[weekSize - 1].day[daySize - 1].goal;
    const lifetimeSteps = data.totalSteps;
    let count = 0;
    let j;
    if (daySize >= 2) {
      j = daySize - 2;
    }
    const hist: History[] = [];
    console.log(r++);
    for (let i = weekSize - 1; i >= 0 && count < 30; i--) {
      for (; j >= 0 && count < 30; j--) {
        console.log(r++ + '  ' + i + '  ' + j);
        day = data.year[yearSize - 1].week[i].day[j].day;
        console.log(r++);
        year = data.year[yearSize - 1].year;
        console.log(r++);
        steps = data.year[yearSize - 1].week[i].day[j].steps;
        console.log(r++);
        goal = data.year[yearSize - 1].week[i].day[j].goal;
        console.log(count);
        console.log((day = data.year[yearSize - 1].week[i].day[j].day));
        const history1 = new History(day, goal, steps, year);
        hist.push(history1);
        count++;
      }
      if (i >= 1) {
        console.log('if');
        j = data.year[yearSize - 1].week[i - 1].day.length - 1;
        console.log(j);
      }
    }
    console.log(r++);
    console.log('yurt');
    for (const index of hist) {
      console.log(index.steps + ' ' + index.day);
    }
    console.log(userId);
    const leagues = await League.find({ members: { $elemMatch: { memberId: userId } } });
    const leagueArray = [];
    for (const index of leagues) {
      leagueArray.push(index.leagueId);
    }
    const userHomepage = new Homepage(hist, leagueArray, goalToRet, lifetimeSteps);
    // console.log(leagues);
    callback(userHomepage);
  } catch (e) {
    error();
  }
};

export const createNewUser = async (
  fuserID: string,
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
    const ret = await User.findOne({ fuserid: fuserID });
    if (ret != null) {
      callback(ret);
      console.log('already in db');
      return;
    }
    console.log('3');
    const user = new User({
      fuserid: fuserID,
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
  userName: string,
  leagueGoal: number,
  callback: any,
  error: any,
) => {
  try {
    console.log('3');
    const league = new League({
      goal: leagueGoal,
      leagueId: leagueID,
      leagueName: name,
      members: [
        {
          dateJoined: getDay(),
          memberId: leagueMember,
          multiplier: '1',
          name: userName,
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

export const addLeagueMember = async (
  leagueID: string,
  memberID: string,
  userName: string,
  callback: any,
  error: any,
) => {
  try {
    const ret = await League.findOne({ leagueId: leagueID });
    const league = new League(ret);
    console.log(league.members.length);
    console.log(leagueID);
    console.log(memberID);
    console.log(league.leagueName);
    let index;
    for (let i = 0; i < league.members.length; i++) {
      if (league.members[i].memberId === memberID) {
        index = i;
        console.log('yurt');
        callback(league);
        return;
      }
    }

    league.members.push({
      dateJoined: getDay(),
      memberId: memberID,
      multiplier: '1',
      name: userName,
      score: '1',
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

export const newDay = async (userId: string, currentSteps: string, callback: any, error: any) => {
  try {
    console.log(userId);
    const ret = await User.findOne({ fuserid: userId });
    console.log(ret);
    const data = new User(ret);
    const yearSize = data.year.length;
    const weekSize = data.year[yearSize - 1].week.length;
    const daySize = data.year[yearSize - 1].week[weekSize - 1].day.length;
    const dateStr = data.year[yearSize - 1].week[weekSize - 1].day[daySize - 1].day;
    let newDate;
    let finalDate;
    dateStr.split('');
    console.log(dateStr[0]);
    if (dateStr[1] === '-') {
      newDate = dateStr[0];
      console.log(newDate);

      newDate++;
      console.log(newDate);
      if (dateStr[3] != null) {
        finalDate = finalDate + dateStr[2] + dateStr[3];
      } else {
        console.log('else');
        console.log(newDate + '-' + dateStr[2]);
        finalDate = newDate + '-' + dateStr[2];
        console.log(finalDate);
      }
      console.log(finalDate);
    } else {
      newDate = dateStr[0] + dateStr[1];
      newDate++;
      if (dateStr[3] != null) {
        finalDate = finalDate + dateStr[2] + dateStr[3];
      } else {
        finalDate = finalDate + dateStr[2];
      }
      finalDate = newDate.join('');
    }
    console.log(finalDate);
    if (getWeek() === data.year[yearSize - 1].week[weekSize - 1].week) {
      console.log('if1');
      console.log(getWeek());
      console.log(data.year[yearSize - 1].week[weekSize - 1].day[daySize - 1].day);

      console.log('else12');
      data.year[yearSize - 1].week[weekSize - 1].day.push({
        day: finalDate,
        goal: data.year[yearSize - 1].week[weekSize - 1].day[daySize - 1].goal,
        steps: currentSteps,
      });
    } else {
      console.log('else1');
      data.year[yearSize - 1].week.push({ week: getWeek() });
      data.year[yearSize - 1].week[weekSize].day.push({
        day: finalDate,
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
