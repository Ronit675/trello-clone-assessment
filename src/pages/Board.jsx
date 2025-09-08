import React, { useState } from 'react';
import { Search, Plus, ArrowLeft } from 'lucide-react';
import { List } from './components.jsx';
import { createDefaultList } from './types.js';

const Board = ({ 
  board, 
  onBack, 
  onUpdateBoard, 
  onDeleteBoard, 
  onUpdateList, 
  onDeleteList, 
  onAddList, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  onTaskMove, 
  darkMode 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  const handleAddList = () => {
    if (newListTitle.trim()) {
      const newList = createDefaultList(newListTitle.trim());
      onAddList(board.id, newList);
      setNewListTitle('');
      setIsAddingList(false);
    }
  };

  const handleDeleteBoard = () => {
    if (window.confirm(`Are you sure you want to delete the board "${board.title}"? This action cannot be undone.`)) {
      onDeleteBoard(board.id);
      onBack(); // Navigate back to dashboard after deletion
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-slate-50'}`}>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-[rgb(16_24_40)] dark:text-white truncate max-w-[60vw] sm:max-w-none">{board.title}</h1>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="relative w-full max-w-xs sm:max-w-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
            </div>
            
            {/* Delete Board Button */}
            <button
              onClick={handleDeleteBoard}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Delete Board
            </button>
          </div>
        </div>

        {/* Board Content */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4">
          {/* Existing Lists */}
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

          {/* Add New List */}
          <div className="w-72 sm:w-80 flex-shrink-0">
            {isAddingList ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <input
                  type="text"
                  placeholder="List title"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddList()}
                  className="w-full p-2 mb-3 border rounded bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddList}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Add List
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingList(false);
                      setNewListTitle('');
                    }}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
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

export default Board;