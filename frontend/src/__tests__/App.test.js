import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';

import App from '../App';
import client from '../apollo-client';

window.prompt = jest.fn();

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

describe('Testing the Application', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ApolloApp />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
