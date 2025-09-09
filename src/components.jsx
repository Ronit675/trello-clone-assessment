import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from './types.js';
import TaskCard from './components/TaskCard.jsx';

// List Component
export const List = ({ list, boardId, onUpdateList, onDeleteList, onAddTask, onUpdateTask, onDeleteTask, onTaskMove, searchTerm }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [draggingTaskId, setDraggingTaskId] = useState(null);

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

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const raw = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
      if (!raw) return;
      const payload = JSON.parse(raw);
      const { task, fromListId } = payload || {};
      if (task && fromListId && fromListId !== list.id) {
        onTaskMove(task, fromListId, list.id);
      }
    } catch (_) {
      // ignore malformed drops
    }
    setDraggingTaskId(null);
  };

  const handleTaskDragStart = (e, task) => {
    try {
      e.dataTransfer.setData('application/json', JSON.stringify({ task, fromListId: list.id }));
    } catch (_) {
      e.dataTransfer.setData('text/plain', JSON.stringify({ task, fromListId: list.id }));
    }
    e.dataTransfer.effectAllowed = 'move';
    setDraggingTaskId(task.id);
  };

  const handleTaskDragEnd = () => {
    setDraggingTaskId(null);
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
            isDragging={draggingTaskId === task.id}
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
            onDragStart={(e) => handleTaskDragStart(e, task)}
            onDragEnd={handleTaskDragEnd}
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
