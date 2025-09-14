import React from 'react';
import { useLazyLoadQuery, useMutation, useSubscription } from 'react-relay';
import { 
  Checkbox, 
  Text,
  Flex,
  View,
  Badge
} from '@adobe/react-spectrum';
import { graphql } from 'relay-runtime';

const taskListQuery = graphql`
  query TaskListQuery {
    allTasks {
      id
      title
      description
      status
      createdAt
      updatedAt
    }
  }
`;

const updateTaskStatusMutation = graphql`
  mutation TaskListUpdateMutation($input: UpdateTaskStatusInput!) {
    updateTaskStatus(input: $input) {
      id
      status
      updatedAt
    }
  }
`;

const taskChangedSubscription = graphql`
  subscription TaskListSubscription {
    onTaskChanged {
      id
      title
      description
      status
      createdAt
      updatedAt
    }
  }
`;

const TaskList: React.FC = () => {
  const data = useLazyLoadQuery(taskListQuery, {}) as any;
  const [commitStatusUpdate] = useMutation(updateTaskStatusMutation);

  useSubscription({
    subscription: taskChangedSubscription,
    variables: {},
  });

  const handleStatusChange = (taskId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'PENDING' ? 'COMPLETED' : 'PENDING';
    
    commitStatusUpdate({
      variables: {
        input: {
          id: taskId,
          status: newStatus
        }
      },
      onError: (error) => {
        console.error('Error updating task status:', error);
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderTask = (task: any) => (
    <View 
      key={task.id} 
      padding="size-150" 
      backgroundColor="gray-50" 
      borderRadius="medium"
      marginBottom="size-100"
    >
      <Flex direction="column" gap="size-100">
        <Flex alignItems="center" gap="size-150">
          <Checkbox
            isSelected={task.status === 'COMPLETED'}
            onChange={() => handleStatusChange(task.id, task.status)}
          >
            <Text>{task.title}</Text>
          </Checkbox>
          <Badge variant={task.status === 'COMPLETED' ? 'positive' : 'info'}>
            {task.status === 'COMPLETED' ? 'Completed' : 'Pending'}
          </Badge>
        </Flex>
        
        {task.description && (
          <Text marginStart="size-300">
            {task.description}
          </Text>
        )}
        
        <Text marginStart="size-300" fontSize="small">
          Created: {formatDate(task.createdAt)}
          {task.updatedAt !== task.createdAt && (
            <> • Updated: {formatDate(task.updatedAt)}</>
          )}
        </Text>
      </Flex>
    </View>
  );

  if (!data.allTasks || data.allTasks.length === 0) {
    return (
      <View padding="size-400">
        <Text>No tasks yet. Add your first task above!</Text>
      </View>
    );
  }

  return (
    <View padding="size-200">
      <Text marginBottom="size-200">
        Tasks ({data.allTasks.length})
      </Text>
      <Flex direction="column" gap="size-100">
        {data.allTasks.map(renderTask)}
      </Flex>
    </View>
  );
};

export default TaskList;
