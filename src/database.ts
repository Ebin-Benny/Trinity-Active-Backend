const User = require('./data');
export const getUser = async (userName: string, callback: any, error: any) => {
  try {
    const ret = await User.findOne({ name: userName });
    console.log(ret);
    callback(ret);
  } catch (e) {
    error();
  }
};

export const getUserSteps = async (userName: string, currentDate: string, callback: any, error: any) => {
  try {
    const ret = await User.findOne({ name: userName });

    console.log(ret);
    callback(ret);
  } catch (e) {
    error();
  }
};
