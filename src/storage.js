// Utility functions for localStorage management
const STORAGE_KEY = 'trello-clone-data';

export const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Export/Import utilities
export const exportDataToFile = (data) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'task-manager-backup.json';
  link.click();
  URL.revokeObjectURL(url);
};

export const importDataFromFile = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const importedData = JSON.parse(event.target.result);
      callback(importedData);
    } catch {
      alert('Invalid JSON file');
    }
  };
  reader.readAsText(file);
};