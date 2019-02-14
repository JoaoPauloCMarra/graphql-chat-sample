import React, { useState, useEffect } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Signup from './components/Signup';
import Chatbox from './components/Chatbox';

const style = {
  wrapper: {
    backgroundColor: '#ddd',
    margin: '0 auto',
    padding: '0 15',
    width: '100%',
    maxWidth: '960px'
  },
  signupWrapper: {
    padding: 50
  },
  chatWrapper: {
    padding: 10
  },
  chatTitleWrapper: {
    backgroundColor: '#6fb0dc',
    borderBottom: '1px solid #5887a7',
    padding: '20px 10px'
  },
  chatTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    margin: 0,
    padding: 0,
    width: '100%'
  },
  username: {
    color: '#5887a7',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'right'
  },
  chatInputWrapper: {
    backgroundColor: '#FFFFFF'
  },
  chatInput: {
    border: '0 solid #333',
    borderTopWidth: 1,
    borderRadius: 0,
    padding: 5,
    margin: 0,
    width: '100%'
  }
};

const App = ({ chatsQuery, createChatMutation }) => {
  const [from, setFrom] = useState('');
  const [content, setContent] = useState('');

  const subscribeToNewChats = () => {
    chatsQuery.subscribeToMore({
      document: gql`
        subscription MessageSentSubscription {
          messageSent {
            id
            content
            from
            createdAt
          }
        }
      `,
      updateQuery: (previousData, { subscriptionData }) => {
        return {
          chats: [
            subscriptionData.data.messageSent,
            ...previousData.chats
          ].splice(0, 8)
        };
      }
    });
  };

  useEffect(() => {
    subscribeToNewChats();
  }, []);

  const createChat = async e => {
    if (e.key === 'Enter') {
      await createChatMutation({
        variables: { content, from }
      });
      setContent('');
    }
  };

  if (!from || from.length === 0) {
    return (
      <div style={style.wrapper}>
        <div style={style.signupWrapper}>
          <Signup signin={from => setFrom(from)} />
        </div>
      </div>
    );
  }

  return (
    <div style={style.wrapper}>
      <div style={style.chatWrapper}>
        <div style={style.chatTitleWrapper}>
          <h2 style={style.chatTitle}>
            <span>Chat</span>
            <span
              style={style.username}
              onClick={() => setFrom('')}
              title="logout"
            >
              {from}
            </span>
          </h2>
        </div>
        {chatsQuery.chats &&
          chatsQuery.chats.map(message => (
            <Chatbox
              key={message.id}
              message={message}
              currentUser={message.from === from}
            />
          ))}
        <div style={style.chatInputWrapper}>
          <input
            style={style.chatInput}
            type="text"
            placeholder="Start typing"
            value={content}
            onKeyPress={createChat}
            onChange={e => setContent(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

const CHATS_QUERY = gql`
  query chatsQuery {
    chats {
      id
      content
      from
      createdAt
    }
  }
`;
const CREATE_CHAT_MUTATION = gql`
  mutation CreateChatMutation($content: String!, $from: String!) {
    createChat(content: $content, from: $from) {
      id
      content
      from
      createdAt
    }
  }
`;

export default compose(
  graphql(CHATS_QUERY, { name: 'chatsQuery' }),
  graphql(CREATE_CHAT_MUTATION, { name: 'createChatMutation' })
)(App);
