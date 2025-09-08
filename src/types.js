// Utility functions for generating IDs
export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Initial data structure
export const initialData = {
  boards: {},
  boardOrder: [],
  darkMode: false
};

// Create default board structure
export const createDefaultBoard = (title = 'New Board') => ({
  id: generateId(),
  title,
  lists: [
    {
      id: generateId(),
      title: 'To Do',
      tasks: []
    },
    {
      id: generateId(),
      title: 'In Progress',
      tasks: []
    },
    {
      id: generateId(),
      title: 'Done',
      tasks: []
    }
  ]
});

// Create default list structure
export const createDefaultList = (title = 'New List') => ({
  id: generateId(),
  title,
  tasks: []
});

// Create default task structure
export const createDefaultTask = (title, description = '') => ({
  id: generateId(),
  title,
  description
});