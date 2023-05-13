import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const API_URL = "https://api.studio.thegraph.com/query/45707/treasurydao/v0.0.2";

export const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

export const Daos = (queryBody: string) => gql(queryBody);

