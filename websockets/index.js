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

    // @ts-ignore
    const userId = ws.userId;

    if (data.type === 'joinRoom') {
      const fullRoomName = data.room;

      const user = await UserRepo.findUserById(userId);

      const usersInRoom = await room.getUsersInRoom(fullRoomName);

      await room.addUserToRoom(fullRoomName, userId, user.username);

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
    } else if (data.type === 'sendMessage') {
      const roomName = data.room;

      const user = await UserRepo.findUserById(userId);

      const usersInRoom = await room.getUsersInRoom(roomName);

      usersInRoom.forEach((userId) => {
        wss.clients.forEach((client) => {
          // @ts-ignore
          if (client.userId === userId) {
            client.send(
              JSON.stringify({
                type: 'messageSent',
                user: user.username,
                message: data.message,
              }),
            );
          }
        });
      });
    } else if (data.type === 'createRoom') {
      const roomName = data.roomName;

      const isRoomExist = await room.isRoomExist(roomName);

      if (isRoomExist) {
        ws.send(JSON.stringify({ type: 'roomExist' }));

        return;
      }

      await room.createRoom(roomName, userId);

      ws.send(
        JSON.stringify({
          type: 'roomCreated',
          roomName: `PublicRoom-${roomName}`,
        }),
      );
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
