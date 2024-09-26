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
