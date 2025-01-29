const redis = require('../adapters/redis');

const getRooms = async () => {
  return await redis.scan('0', 'MATCH', 'PublicRoom-*');
};

const createRoom = async (roomName, userId) => {
  const roomData = {
    messages: [],
    usersOnline: 0,
    owner: userId,
  };

  return await redis.set(`PublicRoom-${roomName}`, JSON.stringify(roomData));
};

const addUserToRoom = async (fullRoomName, username) => {
  const roomDataJson = await redis.get(fullRoomName);

  const roomData = JSON.parse(roomDataJson);

  roomData.messages.push({ content: `${username} has joined to the room` });

  roomData.usersOnline += 1;

  return await redis.set(fullRoomName, JSON.stringify(roomData));
};

const removeUserFromRoom = async (fullRoomName, username) => {
  const roomDataJson = await redis.get(fullRoomName);

  const roomData = JSON.parse(roomDataJson);

  roomData.messages.push({ content: `${username} has left room` });

  roomData.usersOnline -= 1;

  return await redis.set(fullRoomName, JSON.stringify(roomData));
};

const isRoomExist = async (roomName) => {
  return await redis.exists(`PublicRoom-${roomName}`);
};

module.exports = {
  getRooms,
  createRoom,
  addUserToRoom,
  removeUserFromRoom,
  isRoomExist,
};
