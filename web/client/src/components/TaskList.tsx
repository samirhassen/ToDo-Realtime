import React, { useEffect } from 'react';
import { useLazyLoadQuery, useMutation, useSubscription } from 'react-relay';
import { 
  ListView, 
  Item, 
  Checkbox, 
  Text,
  Flex,
  View,
  Badge
} from '@adobe/react-spectrum';
import { graphql } from 'relay-runtime';

const taskListQuery = graphql`
  query TaskListQuery {
    getAllTasks {
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
  const data = useLazyLoadQuery(taskListQuery, {});
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
          <Badge variant={task.status === 'COMPLETED' ? 'positive' : 'notice'}>
            {task.status === 'COMPLETED' ? 'Completed' : 'Pending'}
          </Badge>
        </Flex>
        
        {task.description && (
          <Text marginStart="size-300" color="gray-700">
            {task.description}
          </Text>
        )}
        
        <Text marginStart="size-300" color="gray-600" fontSize="small">
          Created: {formatDate(task.createdAt)}
          {task.updatedAt !== task.createdAt && (
            <> • Updated: {formatDate(task.updatedAt)}</>
          )}
        </Text>
      </Flex>
    </View>
  );

  if (!data.getAllTasks || data.getAllTasks.length === 0) {
    return (
      <View padding="size-400" textAlign="center">
        <Text color="gray-600">No tasks yet. Add your first task above!</Text>
      </View>
    );
  }

  return (
    <View padding="size-200">
      <Text elementType="h2" marginBottom="size-200">
        Tasks ({data.getAllTasks.length})
      </Text>
      <Flex direction="column" gap="size-100">
        {data.getAllTasks.map(renderTask)}
      </Flex>
    </View>
  );
};

export default TaskList;
