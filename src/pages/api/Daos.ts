import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const API_URL = "https://api.studio.thegraph.com/query/45707/investmentdaoarbtestnet/v0.0.6";

export const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

export const Daos = (queryBody: string) => gql(queryBody);

