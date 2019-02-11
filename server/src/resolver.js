const CHAT_CHANNEL = 'CHAT_CHANNEL';
let chats = [
  { id: 1, from: 'admin', content: 'testing 1', createdAt: '' },
  { id: 2, from: 'admin', content: 'testing 2', createdAt: '' },
  { id: 3, from: 'admin', content: 'testing 3', createdAt: '' },
  { id: 4, from: 'admin', content: 'testing 4', createdAt: '' }
];

export default {
  Query: {
    chats: (root, args, context) => chats
  },

  Mutation: {
    createChat: (root, { content, from }, { pubsub }) => {
      const id =
        '_' +
        Math.random()
          .toString(36)
          .substr(2, 9);
      const chat = {
        id,
        content,
        from,
        createdAt: new Date().toISOString()
      };

      chats = [chat, ...chats];
      chats = chats.splice(0, 8);
      pubsub.publish(CHAT_CHANNEL, { messageSent: chat });

      return chat;
    }
  },

  Subscription: {
    messageSent: {
      subscribe: (root, args, { pubsub }) => {
        return pubsub.asyncIterator(CHAT_CHANNEL);
      }
    }
  }
};
