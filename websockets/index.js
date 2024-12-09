const WebSocket = require('ws');
const redis = require('../adapters/redis');

const wss = new WebSocket.Server({ port: 3003 });

wss.on('connection', async (ws) => {
  const rooms = await redis.scan('0', 'MATCH', 'PublicRoom-*');

  const roomData = { type: 'sendRooms', rooms: rooms[1] };

  ws.send(JSON.stringify(roomData));
  //   rooms[1].forEach((room) => {
  // 	ws.send(room);
  //   });

  //   ws.on('message', async (message) => {
  // 	const { room, message: msg } = JSON.parse(message);

  // 	await redis.publish(room, msg);
  //   });

  //   redis.set('users');

  //   redis.set('users');
});
