const User = require('./data');
export const getUsers = async () => {
  const data = new User();
  data.name = 'dh23ifda';
  await data.save();
};
