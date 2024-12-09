const { ObjectId } = require('mongodb');
const usersDb = require('../adapters/mongodb')
  .db('chat-app-websocket')
  .collection('users');

const findUserById = async (userId) => {
  return await usersDb.findOne({ _id: ObjectId.createFromHexString(userId) });
};

const findUserByUsername = async (username) => {
  return await usersDb.findOne({ username });
};

const findAllUsers = async () => {
  return await usersDb.find().toArray();
};

const saveUser = async (newUserData) => {
  return await usersDb.insertOne(newUserData);
};

module.exports.UserRepo = {
  findUserById,
  findUserByUsername,
  findAllUsers,
  saveUser,
  validateObjectId: ObjectId.isValid,
};

// const findUserById = async (userId) => {};

// const findUserByUsername = async (username) => {
// 	[].filter(user => user.username === username)
// };

// const findAllUsers = async () => {};

// const saveUser = async (newUserData) => {
//   let usersJson = [];
//   fs.promises
//     .readFile('./data/users.json')
//     .then((data) => {
//       usersJson = JSON.parse(data.toString());
//       console.log(usersJson);
//     })
//     .then(() => {
//       usersJson.push(newUserData);

//       const newData = JSON.stringify(usersJson);

//       fs.promises
//         .writeFile('./data/users.json', newData)
//         .then(() => console.log('Data added'));

//       return true;
//     });
// };

// module.exports.UserRepo = {
//   findUserById,
//   findUserByUsername,
//   findAllUsers,
//   saveUser,
// };
