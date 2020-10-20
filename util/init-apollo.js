import { ApolloClient, InMemoryCache, ApolloLink } from 'apollo-boost'
import { createHttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import fetch from 'isomorphic-unfetch'

let apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message))
})

function create(uri, initialState) {
  const httpLink = createHttpLink({
    uri
    // credentials: 'include'
  })

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: typeof window === 'undefined', // Disables forceFetch on the server (so queries are only run once)
    link: ApolloLink.from([errorLink, httpLink]),
    cache: new InMemoryCache({
      dataIdFromObject: object => object.id
    }).restore(initialState || {})
  })
}

export default function initApollo(uri, initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return create(uri, initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(uri, initialState)
  }

  return apolloClient
}
