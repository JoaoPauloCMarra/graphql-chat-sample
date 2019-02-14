import React, { useState } from 'react';

const style = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5
  },
  label: {
    fontSize: 16,
    fontWeight: 'bolder',
    padding: 0,
    margin: '0 0 5px 0'
  },
  input: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #ddd',
    padding: 5,
    margin: 0,
    height: 40
  },
  button: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #ddd',
    padding: 5,
    margin: '0 0 0 5px',
    height: 40
  }
};

const Signup = ({ signin }) => {
  const [username, setUsername] = useState('');

  const submit = async e => {
    if (e.key === 'Enter') {
      signin(username);
    }
  };

  return (
    <div style={style.wrapper}>
      <div style={style.label}>
        <label>Your username:</label>
      </div>

      <div>
        <input
          style={style.input}
          type="text"
          placeholder="your username"
          value={username}
          onKeyPress={submit}
          onChange={e => setUsername(e.target.value)}
        />
        <button style={style.button} onClick={() => signin(username)}>
          enter
        </button>
      </div>
    </div>
  );
};

export default React.memo(Signup);
