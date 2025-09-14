import React, { useState } from 'react';
import { useMutation } from 'react-relay';
import { 
  Button, 
  TextField, 
  TextArea,
  Flex,
  View
} from '@adobe/react-spectrum';
import { graphql } from 'relay-runtime';

const addTaskMutation = graphql`
  mutation AddTaskMutation($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      createdAt
      updatedAt
    }
  }
`;

const AddTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [commit, isInFlight] = useMutation(addTaskMutation);

  const handleAddTask = () => {
    if (!title.trim()) return;

    commit({
      variables: { 
        input: { 
          title: title.trim(), 
          description: description.trim() 
        } 
      },
      onCompleted: () => {
        setTitle('');
        setDescription('');
      },
      onError: (error) => {
        console.error('Error creating task:', error);
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    }
  };

  return (
    <View padding="size-200" backgroundColor="gray-100" borderRadius="medium">
      <Flex direction="column" gap="size-150">
        <TextField
          label="Task Title"
          value={title}
          onChange={setTitle}
          onKeyDown={handleKeyPress}
          isRequired
          placeholder="Enter task title..."
        />
        <TextArea
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Enter task description (optional)..."
          height="size-1000"
        />
        <Flex justifyContent="end">
          <Button 
            variant="accent" 
            onPress={handleAddTask} 
            isDisabled={isInFlight || !title.trim()}
          >
            {isInFlight ? 'Adding...' : 'Add Task'}
          </Button>
        </Flex>
      </Flex>
    </View>
  );
};

export default AddTask;
