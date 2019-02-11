import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Chatbox from './components/Chatbox';

const style = {
  wrapper: {
    margin: '0 auto',
    padding: '0 15',
    width: '100%',
    maxWidth: '960px'
  },
  chatWrapper: {
    backgroundColor: '#ddd',
    padding: 10
  },
  chatTitle: {
    backgroundColor: 'rgb(111,176,220)',
    padding: '5px 10px'
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

class App extends Component {
  state = {
    from: 'anonymous',
    content: ''
  };

  componentDidMount() {
    const from = window.prompt('username');
    from && this.setState({ from });
    this.subscribeToNewChats();
  }

  createChat = async e => {
    if (e.key === 'Enter') {
      const { content, from } = this.state;
      await this.props.createChatMutation({
        variables: { content, from }
      });
      this.setState({ content: '' });
    }
  };

  subscribeToNewChats = () => {
    const { chatsQuery } = this.props;
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

  render() {
    const { content } = this.state;
    const {
      chatsQuery: { chats = [] }
    } = this.props;

    return (
      <div style={style.wrapper}>
        <div style={style.chatWrapper}>
          <div style={style.chatTitle}>
            <h2>Chats</h2>
          </div>
          {chats.map(message => (
            <Chatbox key={message.id} message={message} />
          ))}
          <div style={style.chatInputWrapper}>
            <input
              style={style.chatInput}
              type="text"
              placeholder="Start typing"
              value={content}
              onKeyPress={this.createChat}
              onChange={e => this.setState({ content: e.target.value })}
            />
          </div>
        </div>
      </div>
    );
  }
}

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
