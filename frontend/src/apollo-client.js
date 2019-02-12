import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-client-preset';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

const GRAPHQL_URI = 'localhost:4000';
const wsLink = new WebSocketLink({
  uri: `ws://${GRAPHQL_URI}`,
  options: {
    reconnect: true
  }
});
const httpLink = new HttpLink({ uri: `http://${GRAPHQL_URI}` });
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

export default new ApolloClient({
  link,
  cache: new InMemoryCache()
});
