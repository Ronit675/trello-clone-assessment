import React, { useState } from 'react';
import { Plus, Trash2, Download, Upload, Sun, Moon } from 'lucide-react';
import { importDataFromFile } from './storage.js';

const Dashboard = ({ data, onCreateBoard, onSelectBoard, onDeleteBoard, onToggleDarkMode, onExportData, onImportData }) => {
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  const handleCreateBoard = () => {
    if (newBoardTitle.trim()) {
      onCreateBoard(newBoardTitle.trim());
      setNewBoardTitle('');
      setIsCreatingBoard(false);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      importDataFromFile(file, onImportData);
    }
    e.target.value = ''; // Reset input
  };

  return (
    <div className={`min-h-screen ${data.darkMode ? 'dark bg-gray-900' : 'bg-slate-50'}`}>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[rgb(16 24 40)] dark:text-white">Task Manager Dashboard</h1>
          <div className="mt-3 flex items-center gap-4 flex-wrap">
            <button
              onClick={onExportData}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <label className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer flex items-center gap-2 transition-colors">
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
              className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
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
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3
                      className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                      onClick={() => onSelectBoard(board)}
                    >
                      {board.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBoard(boardId);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {board.lists.length} lists • {board.lists.reduce((total, list) => total + list.tasks.length, 0)} tasks
                  </div>
                  <button
                    onClick={() => onSelectBoard(board)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Open Board
                  </button>
                </div>
              </div>
            );
          })}

          {/* Create New Board Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-200 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center min-h-[200px]">
            {isCreatingBoard ? (
              <div className="p-6 w-full">
                <input
                  type="text"
                  placeholder="Board title"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateBoard()}
                  className="w-full p-3 border rounded-lg mb-4 bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateBoard}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setIsCreatingBoard(false);
                      setNewBoardTitle('');
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsCreatingBoard(true)}
                className="p-6 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 flex flex-col items-center gap-2 transition-colors"
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

export default Dashboard;