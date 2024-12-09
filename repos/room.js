const redis = require('../adapters/redis');

const getRooms = async () => {
  return await redis.scan('0', 'MATCH', 'PublicRoom-*');
};

module.exports = {
  getRooms,
};
