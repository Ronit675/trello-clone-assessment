import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, isDragging, onDragStart, onDragEnd }) => {
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

export default TaskCard;
