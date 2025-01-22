const WebSocket = require('ws');
const room = require('../repos/room');
const { UserRepo } = require('../repos/user');

const wss = new WebSocket.Server({ port: 3003 });

wss.on('connection', async (ws, req) => {
  const userId = req.headers['sec-websocket-protocol'];

  // @ts-ignore
  ws.userId = userId;

  const rooms = await room.getRooms();

  const roomData = { type: 'sendRooms', rooms: rooms[1] };

  ws.send(JSON.stringify(roomData));

  ws.on('message', async (message) => {
    const data = JSON.parse(message.toString());

    if (data.type === 'joinRoom') {
      const roomName = data.room;
      // @ts-ignore
      const userId = ws.userId;

      const user = await UserRepo.findUserById(userId);

      const usersInRoom = await room.getUsersInRoom(roomName);

      await room.addUserToRoom(roomName, userId);

      usersInRoom.forEach((userId) => {
        wss.clients.forEach((client) => {
          // @ts-ignore
          if (client.userId === userId) {
            client.send(
              JSON.stringify({ type: 'userJoined', user: user.username }),
            );
          }
        });
      });

      //   wss.clients.forEach((client) => {
      //     client.send(JSON.stringify({ type: 'roomJoined' }));
      //   });
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
