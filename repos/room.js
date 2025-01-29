const redis = require('../adapters/redis');

const getRooms = async () => {
  return await redis.scan('0', 'MATCH', 'PublicRoom-*');
};

const createRoom = async (roomName, userId) => {
  const roomData = {
    users: [],
    messages: [],
    usersOnline: 0,
    owner: userId,
  };

  return await redis.set(`PublicRoom-${roomName}`, JSON.stringify(roomData));
};

const addUserToRoom = async (fullRoomName, userId, username) => {
  const roomDataJson = await redis.get(fullRoomName);

  const roomData = JSON.parse(roomDataJson);

  roomData.users.push(userId);

  roomData.messages.push({ content: `${username} has joined to the room` });

  roomData.usersOnline += 1;

  return await redis.set(fullRoomName, JSON.stringify(roomData));
};

const getUsersInRoom = async (fullRoomName) => {
  const roomDataJson = await redis.get(fullRoomName);

  const roomData = JSON.parse(roomDataJson);

  return roomData.users;
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
