const redis = require('../adapters/redis');

const getRooms = async () => {
  return await redis.scan('0', 'MATCH', 'PublicRoom-*');
};

const createRoom = async (roomName, userId) => {
  return await redis.sadd(`PublicRoom-${roomName}`, userId);
};

const addUserToRoom = async (room, userId) => {
  return await redis.sadd(room, userId);
};

const getUsersInRoom = async (room) => {
  return await redis.smembers(room);
};

const isRoomExist = async (roomName) => {
  return await redis.exists(`PublicRoom-${roomName}`);
};

module.exports = {
  getRooms,
  createRoom,
  addUserToRoom,
  getUsersInRoom,
  isRoomExist,
};
