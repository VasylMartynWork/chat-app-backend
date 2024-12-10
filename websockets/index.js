const WebSocket = require('ws');
const room = require('../repos/room');

const wss = new WebSocket.Server({ port: 3003 });

wss.on('connection', async (ws) => {
  const rooms = await room.getRooms();

  const roomData = { type: 'sendRooms', rooms: rooms[1] };

  ws.send(JSON.stringify(roomData));

  ws.on('message', async (message) => {
    const data = JSON.parse(message.toString());

    if (data.type === 'joinRoom') {
      wss.clients.forEach((client) => {
        client.send(JSON.stringify({ type: 'roomJoined' }));
      });
    }
  });
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
