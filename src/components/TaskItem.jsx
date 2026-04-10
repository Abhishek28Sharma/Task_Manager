const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const isEdited = task.updatedAt && task.updatedAt !== task.createdAt

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
          className="w-5 h-5 cursor-pointer accent-blue-600"
        />
        <div>
          <h3
            className={`font-bold text-gray-800 ${task.completed ? 'line-through text-gray-400' : ''}`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-500 italic">{task.description}</p>
          )}

          <div className="flex flex-wrap gap-x-2 mt-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              Created: {formatDate(task.createdAt)}
            </p>
            {isEdited && (
              <p className="text-[10px] text-blue-500 uppercase tracking-wider font-semibold">
                • Edited: {formatDate(task.updatedAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 ml-4">
        <button
          onClick={() => onEdit(task)}
          className="text-blue-600 hover:text-blue-800 text-sm font-bold bg-blue-50 px-2 py-1 rounded cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="text-red-600 hover:text-red-800 text-sm font-bold bg-red-50 px-2 py-1 rounded cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default TaskItem
