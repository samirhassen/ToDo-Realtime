import {
  Environment,
  Network,
  RecordSource,
  Store,
  Observable,
} from 'relay-runtime';
import { createClient } from 'graphql-ws';

const wsClient = createClient({
  url: 'ws://localhost:5000/graphql',
});

async function fetchQuery(operation: any, variables: any) {
  const response = await fetch('http://localhost:5000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  });

  return response.json();
}

function subscribeToGraphQLUpdates(operation: any, variables: any) {
  return Observable.create((sink: any) => {
    const unsubscribe = wsClient.subscribe(
      {
        query: operation.text,
        variables,
      },
      {
        next: sink.next,
        error: sink.error,
        complete: sink.complete,
      }
    );

    return () => {
      unsubscribe();
    };
  });
}

const network = Network.create(fetchQuery, subscribeToGraphQLUpdates);

const environment = new Environment({
  network,
  store: new Store(new RecordSource()),
});

export default environment;
