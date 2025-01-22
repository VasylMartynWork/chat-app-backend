const redis = require('../adapters/redis');

const getRooms = async () => {
  return await redis.scan('0', 'MATCH', 'PublicRoom-*');
};

const addUserToRoom = async (room, userId) => {
  return await redis.sadd(room, userId);
};

const getUsersInRoom = async (room) => {
  return await redis.smembers(room);
};

module.exports = {
  getRooms,
  addUserToRoom,
  getUsersInRoom,
};
