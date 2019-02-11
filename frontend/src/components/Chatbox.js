import React from 'react';

const style = {
  wrapper: {
    backgroundColor: '#f2f2f2',
    padding: 5
  },
  author: {
    fontSize: 16,
    fontWeight: 'bolder',
    padding: 0,
    margin: '5px 0 0 0'
  },
  message: {
    fontSize: 14,
    padding: 0,
    margin: '0 0 0 5px'
  }
};

const Chatbox = ({ message }) => (
  <div style={style.wrapper}>
    <div style={style.message}>
      <h5 style={style.author}>{message.from}</h5>
      <p style={style.message}>{message.content}</p>
    </div>
  </div>
);

export default Chatbox;
