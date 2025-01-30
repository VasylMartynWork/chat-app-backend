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

      const roomData = await room.addUserToRoom(fullRoomName, user.username);

      // @ts-ignore
      ws.room = fullRoomName;

      ws.send(
        JSON.stringify({
          type: 'roomJoined',
          roomName: fullRoomName,
          roomData,
        }),
      );

      wss.clients.forEach((client) => {
        // @ts-ignore
        if (client.room === fullRoomName && client !== ws) {
          client.send(
            JSON.stringify({
              type: 'userJoined',
              user: user.username,
              usersOnline: roomData.usersOnline,
            }),
          );
        }
      });
    } else if (data.type === 'changeRoom') {
      const fullRoomName = data.room;

      // @ts-ignore
      const oldRoom = ws.room;

      const user = await UserRepo.findUserById(userId);

      const oldRoomData = await room.removeUserFromRoom(oldRoom, user.username);

      const newRoomData = await room.addUserToRoom(fullRoomName, user.username);

      // @ts-ignore
      ws.room = fullRoomName;

      ws.send(
        JSON.stringify({
          type: 'roomJoined',
          roomName: fullRoomName,
          roomData: newRoomData,
        }),
      );

      wss.clients.forEach((client) => {
        // @ts-ignore
        if (client.room === oldRoom) {
          client.send(
            JSON.stringify({
              type: 'userLeft',
              user: user.username,
              usersOnline: oldRoomData.usersOnline,
            }),
          );
        }

        // @ts-ignore
        if (client.room === fullRoomName && client !== ws) {
          client.send(
            JSON.stringify({
              type: 'userJoined',
              user: user.username,
              usersOnline: newRoomData.usersOnline,
            }),
          );
        }
      });
    } else if (data.type === 'sendMessage') {
      const fullRoomName = data.room;

      const user = await UserRepo.findUserById(userId);

      wss.clients.forEach((client) => {
        // @ts-ignore
        if (client.room === fullRoomName) {
          client.send(
            JSON.stringify({
              type: 'messageSent',
              user: user.username,
              message: data.message,
            }),
          );
        }
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

  ws.on('close', async () => {
    // @ts-ignore
    const fullRoomName = ws.room;

    if (fullRoomName) {
      const user = await UserRepo.findUserById(userId);

      const roomData = await room.removeUserFromRoom(
        fullRoomName,
        user.username,
      );

      wss.clients.forEach((client) => {
        // @ts-ignore
        if ((client.room = fullRoomName)) {
          client.send(
            JSON.stringify({
              type: 'userLeft',
              user: user.username,
              usersOnline: roomData.usersOnline,
            }),
          );
        }
      });
    }
  });
});
