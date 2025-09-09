import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Edit3, Trash2, Search, Moon, Sun, Download, Upload } from 'lucide-react';
import { initialData } from './types.js';
import useLocalStorage from './hooks/useLocalStorage.js';
import { Modal } from './components/index.js';
import Dashboard from './pages/Dashboard.jsx';
import Board from './pages/Board.jsx';

// Generate unique IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Main App Component
const App = () => {
  const [data, setData] = useLocalStorage('trello-clone-data', initialData);
  const [currentBoard, setCurrentBoard] = useState<any>(null);

  // Initialize with default board if no data exists
  useEffect(() => {
    if (!data || Object.keys(data.boards).length === 0) {
      const defaultBoard = {
        id: generateId(),
        title: 'My First Board',
        lists: [
          { id: generateId(), title: 'To Do', tasks: [] },
          { id: generateId(), title: 'In Progress', tasks: [] },
          { id: generateId(), title: 'Done', tasks: [] }
        ]
      };

      const newData = {
        ...initialData,
        boards: { [defaultBoard.id]: defaultBoard },
        boardOrder: [defaultBoard.id]
      };

      setData(newData);
    }
  }, [data, setData]);

  // Update currentBoard when data changes to keep it in sync
  useEffect(() => {
    if (currentBoard && data && data.boards && data.boards[currentBoard.id]) {
      setCurrentBoard(data.boards[currentBoard.id]);
    }
  }, [data, currentBoard]);

  const createBoard = useCallback((title) => {
    const newBoard = {
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
    };

    setData(prev => {
      if (!prev) return initialData;
      return {
        ...prev,
        boards: { ...prev.boards, [newBoard.id]: newBoard },
        boardOrder: [...prev.boardOrder, newBoard.id]
      };
    });
  }, [setData]);

  const deleteBoard = useCallback((boardId) => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      setData(prev => {
        if (!prev) return initialData;
        const { [boardId]: deletedBoard, ...remainingBoards } = prev.boards;
        return {
          ...prev,
          boards: remainingBoards,
          boardOrder: prev.boardOrder.filter(id => id !== boardId)
        };
      });
      if (currentBoard?.id === boardId) {
        setCurrentBoard(null);
      }
    }
  }, [currentBoard, setData]);

  const updateList = useCallback((listId, updatedList) => {
    if (!currentBoard) return;

    setData(prev => {
      if (!prev) return initialData;
      return {
        ...prev,
        boards: {
          ...prev.boards,
          [currentBoard.id]: {
            ...currentBoard,
            lists: currentBoard.lists.map(list =>
              list.id === listId ? updatedList : list
            )
          }
        }
      };
    });

    setCurrentBoard(prev => {
      if (!prev) return null;
      return {
        ...prev,
        lists: prev.lists.map(list =>
          list.id === listId ? updatedList : list
        )
      };
    });
  }, [currentBoard, setData]);

  const deleteList = useCallback((listId) => {
    if (!currentBoard) return;

    if (window.confirm('Are you sure you want to delete this list?')) {
      const updatedBoard = {
        ...currentBoard,
        lists: currentBoard.lists.filter(list => list.id !== listId)
      };

      setData(prev => {
        if (!prev) return initialData;
        return {
          ...prev,
          boards: {
            ...prev.boards,
            [currentBoard.id]: updatedBoard
          }
        };
      });

      setCurrentBoard(updatedBoard);
    }
  }, [currentBoard, setData]);

  const addList = useCallback((boardId, newList) => {
    setData(prev => {
      if (!prev) return initialData;
      return {
        ...prev,
        boards: {
          ...prev.boards,
          [boardId]: {
            ...prev.boards[boardId],
            lists: [...prev.boards[boardId].lists, newList]
          }
        }
      };
    });

    if (currentBoard?.id === boardId) {
      setCurrentBoard(prev => {
        if (!prev) return null;
        return {
          ...prev,
          lists: [...prev.lists, newList]
        };
      });
    }
  }, [currentBoard, setData]);

  const addTask = useCallback((listId, newTask) => {
    if (!currentBoard) return;

    const updatedBoard = {
      ...currentBoard,
      lists: currentBoard.lists.map(list =>
        list.id === listId
          ? { ...list, tasks: [...list.tasks, newTask] }
          : list
      )
    };

    setData(prev => {
      if (!prev) return initialData;
      return {
        ...prev,
        boards: {
          ...prev.boards,
          [currentBoard.id]: updatedBoard
        }
      };
    });

    setCurrentBoard(updatedBoard);
  }, [currentBoard, setData]);

  const updateTask = useCallback((listId, taskId, updatedTask) => {
    if (!currentBoard) return;

    const updatedBoard = {
      ...currentBoard,
      lists: currentBoard.lists.map(list =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.map(task =>
                task.id === taskId ? updatedTask : task
              )
            }
          : list
      )
    };

    setData(prev => {
      if (!prev) return initialData;
      return {
        ...prev,
        boards: {
          ...prev.boards,
          [currentBoard.id]: updatedBoard
        }
      };
    });

    setCurrentBoard(updatedBoard);
  }, [currentBoard, setData]);

  const deleteTask = useCallback((listId, taskId) => {
    if (!currentBoard) return;

    const updatedBoard = {
      ...currentBoard,
      lists: currentBoard.lists.map(list =>
        list.id === listId
          ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
          : list
      )
    };

    setData(prev => {
      if (!prev) return initialData;
      return {
        ...prev,
        boards: {
          ...prev.boards,
          [currentBoard.id]: updatedBoard
        }
      };
    });

    setCurrentBoard(updatedBoard);
  }, [currentBoard, setData]);

  const moveTask = useCallback((task, fromListId, toListId) => {
    if (!currentBoard || fromListId === toListId) return;

    const updatedBoard = {
      ...currentBoard,
      lists: currentBoard.lists.map(list => {
        if (list.id === fromListId) {
          return { ...list, tasks: list.tasks.filter(t => t.id !== task.id) };
        }
        if (list.id === toListId) {
          return { ...list, tasks: [...list.tasks, task] };
        }
        return list;
      })
    };

    setData(prev => {
      if (!prev) return initialData;
      return {
        ...prev,
        boards: {
          ...prev.boards,
          [currentBoard.id]: updatedBoard
        }
      };
    });

    setCurrentBoard(updatedBoard);
  }, [currentBoard, setData]);

  const toggleDarkMode = useCallback(() => {
    setData(prev => {
      if (!prev) return initialData;
      return {
        ...prev,
        darkMode: !prev.darkMode
      };
    });
  }, [setData]);

  const exportData = useCallback(() => {
    if (!data) return;
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'task-manager-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback((importedData) => {
    try {
      if (!importedData || typeof importedData !== 'object') return;
      const importedBoards = importedData.boards || {};
      const importedOrder = Array.isArray(importedData.boardOrder) ? importedData.boardOrder : [];

      setData(prev => {
        if (!prev) return initialData;
        const newBoards = { ...prev.boards };
        const newOrder = [...prev.boardOrder];

        Object.entries(importedBoards).forEach(([boardId, boardValue]: any) => {
          if (!newBoards[boardId]) {
            newBoards[boardId] = boardValue;
          }
        });

        importedOrder.forEach((boardId: string) => {
          if (!newOrder.includes(boardId) && newBoards[boardId]) {
            newOrder.push(boardId);
          }
        });

        return {
          ...prev,
          boards: newBoards,
          boardOrder: newOrder,
        };
      });
    } catch (e) {
      console.error('Failed to import data:', e);
      alert('Import failed. Ensure the JSON format matches the expected export format.');
    }
  }, [setData]);

  if (currentBoard) {
    return (
      <Board
        board={currentBoard}
        onBack={() => {
          setCurrentBoard(null);
        }}
        onUpdateBoard={(updatedBoard) => {
          setData(prev => ({
            ...prev,
            boards: { ...prev.boards, [updatedBoard.id]: updatedBoard }
          }));
          setCurrentBoard(updatedBoard);
        }}
        onDeleteBoard={deleteBoard}
        onUpdateList={updateList}
        onDeleteList={deleteList}
        onAddList={addList}
        onAddTask={addTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        onTaskMove={moveTask}
        darkMode={data.darkMode}
      />
    );
  }

  return (
    <Dashboard
      data={data}
      onCreateBoard={createBoard}
      onSelectBoard={(board) => {
        setCurrentBoard(board);
      }}
      onDeleteBoard={deleteBoard}
      onToggleDarkMode={toggleDarkMode}
      onExportData={exportData}
      onImportData={importData}
    />
  );
};

export default App;
