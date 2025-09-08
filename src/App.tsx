import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Edit3, Trash2, Search, Moon, Sun, Download, Upload } from 'lucide-react';

// Utility functions for localStorage
const STORAGE_KEY = 'trello-clone-data';

const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Generate unique IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Initial data structure
const initialData = {
  boards: {},
  boardOrder: [],
  darkMode: false
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5 dark:text-white" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Task Card Component
const TaskCard = ({ task, onEdit, onDelete, isDragging, onDragStart, onDragEnd }: any) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border cursor-grab hover:shadow-md transition-all ${
        isDragging ? 'opacity-50 rotate-2' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 dark:text-white flex-1">{task.title}</h4>
        <div className="flex gap-1 ml-2">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-blue-500 rounded"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-500 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
      )}
    </div>
  );
};

// List Component
const List = ({ list, boardId, onUpdateList, onDeleteList, onAddTask, onUpdateTask, onDeleteTask, onTaskMove, searchTerm }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [draggedTask, setDraggedTask] = useState<any>(null);

  const filteredTasks = list.tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTitleSubmit = () => {
    if (editTitle.trim()) {
      onUpdateList(list.id, { ...list, title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: generateId(),
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim()
      };
      onAddTask(list.id, newTask);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setIsAddingTask(false);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    if (draggedTask && draggedTask.listId !== list.id) {
      onTaskMove(draggedTask.task, draggedTask.listId, list.id);
    }
    setDraggedTask(null);
  };

  const handleTaskDragStart = (task) => {
    setDraggedTask({ task, listId: list.id });
  };

  return (
    <div
      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 w-72 sm:w-80 flex-shrink-0"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyPress={(e) => e.key === 'Enter' && handleTitleSubmit()}
            className="font-semibold text-lg bg-transparent border-b-2 border-blue-500 outline-none dark:text-white"
            autoFocus
          />
        ) : (
          <h3
            className="font-semibold text-lg text-gray-900 dark:text-white cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {list.title}
          </h3>
        )}
        <button
          onClick={() => onDeleteList(list.id)}
          className="p-1 text-gray-400 hover:text-red-500 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 mb-4 max-h-[55vh] sm:max-h-96 overflow-y-auto">
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            isDragging={draggedTask?.task.id === task.id}
            onEdit={() => {
              const newTitle = prompt('Task title:', task.title);
              const newDescription = prompt('Task description:', task.description);
              if (newTitle !== null) {
                onUpdateTask(list.id, task.id, {
                  ...task,
                  title: newTitle.trim() || task.title,
                  description: newDescription?.trim() || task.description
                });
              }
            }}
            onDelete={() => onDeleteTask(list.id, task.id)}
            onDragStart={() => handleTaskDragStart(task)}
            onDragEnd={() => setDraggedTask(null)}
          />
        ))}
      </div>

      {isAddingTask ? (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            autoFocus
          />
          <textarea
            placeholder="Description (optional)"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className="w-full p-2 border rounded h-20 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddTask}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAddingTask(false);
                setNewTaskTitle('');
                setNewTaskDescription('');
              }}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingTask(true)}
          className="w-full p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add a task
        </button>
      )}
    </div>
  );
};

// Board Component
const Board = ({ board, onBack, onUpdateBoard, onDeleteBoard, onUpdateList, onDeleteList, onAddList, onAddTask, onUpdateTask, onDeleteTask, onTaskMove, darkMode }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  const handleAddList = () => {
    if (newListTitle.trim()) {
      const newList = {
        id: generateId(),
        title: newListTitle.trim(),
        tasks: []
      };
      onAddList(board.id, newList);
      setNewListTitle('');
      setIsAddingList(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-slate-50'}`}>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              ← Back
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-[rgb(16_24_40)] dark:text-white truncate max-w-[60vw] sm:max-w-none">{board.title}</h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative w-full max-w-xs sm:max-w-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white w-full"
              />
            </div>
            <button
              onClick={() => onDeleteBoard(board.id)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete Board
            </button>
          </div>
        </div>

        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4">
          {board.lists.map(list => (
            <List
              key={list.id}
              list={list}
              boardId={board.id}
              onUpdateList={onUpdateList}
              onDeleteList={onDeleteList}
              onAddTask={onAddTask}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
              onTaskMove={onTaskMove}
              searchTerm={searchTerm}
            />
          ))}

          <div className="w-72 sm:w-80 flex-shrink-0">
            {isAddingList ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <input
                  type="text"
                  placeholder="List title"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  className="w-full p-2 mb-3 border rounded bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddList}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add List
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingList(false);
                      setNewListTitle('');
                    }}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingList(true)}
                className="w-full p-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <Plus className="w-5 h-5" />
                Add another list
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ data, onCreateBoard, onSelectBoard, onDeleteBoard, onToggleDarkMode, onExportData, onImportData }: any) => {
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  const handleCreateBoard = () => {
    if (newBoardTitle.trim()) {
      onCreateBoard(newBoardTitle.trim());
      setNewBoardTitle('');
      setIsCreatingBoard(false);
    }
  };

  const handleImport = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse((event as any).target?.result as string);
          onImportData(importedData);
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`min-h-screen ${data.darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Task Manager Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={onExportData}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <label className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={onToggleDarkMode}
              className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              {data.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.boardOrder.map(boardId => {
            const board = data.boards[boardId];
            return (
              <div
                key={boardId}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3
                      className="text-xl font-semibold dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      onClick={() => onSelectBoard(board)}
                    >
                      {board.title}
                    </h3>
                    <button
                      onClick={() => onDeleteBoard(boardId)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {board.lists.length} lists • {board.lists.reduce((total, list) => total + list.tasks.length, 0)} tasks
                  </div>
                  <button
                    onClick={() => onSelectBoard(board)}
                    className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Open Board
                  </button>
                </div>
              </div>
            );
          })}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
            {isCreatingBoard ? (
              <div className="p-6 w-full">
                <input
                  type="text"
                  placeholder="Board title"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateBoard}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setIsCreatingBoard(false);
                      setNewBoardTitle('');
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsCreatingBoard(true)}
                className="p-6 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 flex flex-col items-center gap-2"
              >
                <Plus className="w-8 h-8" />
                <span className="text-lg font-medium">Create New Board</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [data, setData] = useState<any>(initialData);
  const [currentBoard, setCurrentBoard] = useState<any>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = loadFromStorage();
    if (savedData) {
      setData(savedData);
    } else {
      // Initialize with default board
      const defaultBoard = {
        id: generateId(),
        title: 'My First Board',
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

      const newData = {
        ...initialData,
        boards: { [defaultBoard.id]: defaultBoard },
        boardOrder: [defaultBoard.id]
      };
      
      setData(newData);
      saveToStorage(newData);
    }
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    saveToStorage(data);
  }, [data]);

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

    setData(prev => ({
      ...prev,
      boards: { ...prev.boards, [newBoard.id]: newBoard },
      boardOrder: [...prev.boardOrder, newBoard.id]
    }));
  }, []);

  const deleteBoard = useCallback((boardId) => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      setData(prev => {
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
  }, [currentBoard]);

  const updateList = useCallback((listId, updatedList) => {
    if (!currentBoard) return;

    setData(prev => ({
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
    }));

    setCurrentBoard(prev => ({
      ...prev,
      lists: prev.lists.map(list =>
        list.id === listId ? updatedList : list
      )
    }));
  }, [currentBoard]);

  const deleteList = useCallback((listId) => {
    if (!currentBoard) return;

    if (window.confirm('Are you sure you want to delete this list?')) {
      const updatedBoard = {
        ...currentBoard,
        lists: currentBoard.lists.filter(list => list.id !== listId)
      };

      setData(prev => ({
        ...prev,
        boards: {
          ...prev.boards,
          [currentBoard.id]: updatedBoard
        }
      }));

      setCurrentBoard(updatedBoard);
    }
  }, [currentBoard]);

  const addList = useCallback((boardId, newList) => {
    setData(prev => ({
      ...prev,
      boards: {
        ...prev.boards,
        [boardId]: {
          ...prev.boards[boardId],
          lists: [...prev.boards[boardId].lists, newList]
        }
      }
    }));

    if (currentBoard?.id === boardId) {
      setCurrentBoard(prev => ({
        ...prev,
        lists: [...prev.lists, newList]
      }));
    }
  }, [currentBoard]);

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

    setData(prev => ({
      ...prev,
      boards: {
        ...prev.boards,
        [currentBoard.id]: updatedBoard
      }
    }));

    setCurrentBoard(updatedBoard);
  }, [currentBoard]);

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

    setData(prev => ({
      ...prev,
      boards: {
        ...prev.boards,
        [currentBoard.id]: updatedBoard
      }
    }));

    setCurrentBoard(updatedBoard);
  }, [currentBoard]);

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

    setData(prev => ({
      ...prev,
      boards: {
        ...prev.boards,
        [currentBoard.id]: updatedBoard
      }
    }));

    setCurrentBoard(updatedBoard);
  }, [currentBoard]);

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

    setData(prev => ({
      ...prev,
      boards: {
        ...prev.boards,
        [currentBoard.id]: updatedBoard
      }
    }));

    setCurrentBoard(updatedBoard);
  }, [currentBoard]);

  const toggleDarkMode = useCallback(() => {
    setData(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
  }, []);

  const exportData = useCallback(() => {
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
    if (window.confirm('This will replace all current data. Are you sure?')) {
      setData(importedData);
      setCurrentBoard(null);
    }
  }, []);

  if (currentBoard) {
    return (
      <Board
        board={currentBoard}
        onBack={() => setCurrentBoard(null)}
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
      onSelectBoard={setCurrentBoard}
      onDeleteBoard={deleteBoard}
      onToggleDarkMode={toggleDarkMode}
      onExportData={exportData}
      onImportData={importData}
    />
  );
};

export default App;