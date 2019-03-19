const User = require('./data');
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
      data.year[yearSize - 1].week[weekSize - 1].day.push({ day: getDay(), multiplier: '1.75', steps: '14300' });
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

export const updateUserSteps = async (userName: string, callback: any, error: any) => {
  try {
    const ret = await User.findOne({ name: userName });
    const data = new User(ret);
    const yearSize = data.year.size();
    const weekSize = data.week.size();
    // if(data.year.size() ===0){}

    console.log(yearSize + weekSize);
    callback(ret);
    return ret;
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
  const currentDate = d.getDate() + '-' + d.getMonth();
  // console.log(currentDate);
  return currentDate;
}
