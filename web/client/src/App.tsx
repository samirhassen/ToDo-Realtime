import React, { Suspense } from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import { Provider, defaultTheme, Flex, View, Heading } from '@adobe/react-spectrum';
import RelayEnvironment from './relay/RelayEnvironment';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';

function App() {
  return (
    <Provider theme={defaultTheme}>
      <RelayEnvironmentProvider environment={RelayEnvironment}>
        <View minHeight="100vh" backgroundColor="gray-25">
          <View maxWidth="size-6000" margin="0 auto" padding="size-400">
            <Flex direction="column" gap="size-400">
              <View textAlign="center" paddingBottom="size-200">
                <Heading level={1} marginBottom="size-100">
                  Todo List with Real-Time Sync
                </Heading>
                <Heading level={4} color="gray-600">
                  Add tasks and see updates in real-time
                </Heading>
              </View>
              
              <AddTask />
              
              <Suspense 
                fallback={
                  <View padding="size-400" textAlign="center">
                    Loading tasks...
                  </View>
                }
              >
                <TaskList />
              </Suspense>
            </Flex>
          </View>
        </View>
      </RelayEnvironmentProvider>
    </Provider>
  );
}

export default App;
