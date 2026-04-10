import { useState, useEffect } from 'react'

const TaskForm = ({ onSubmit, editingTask, onCancel }) => {
  const [formData, setFormData] = useState({ title: '', description: '' })

  // Update form when switching to edit mode
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || '',
      })
    } else {
      setFormData({ title: '', description: '' })
    }
  }, [editingTask])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    onSubmit(formData)
    setFormData({ title: '', description: '' })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100"
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-700">
          {editingTask ? 'Edit Task' : 'Add New Task'}
        </h2>
        <input
          type="text"
          placeholder="Task Title"
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none transition-all"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description (Optional)"
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none transition-all"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className={`flex-1 py-2 rounded text-white font-bold cursor-pointer transition-colors ${editingTask ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {editingTask ? 'Update Task' : 'Create Task'}
          </button>
          {editingTask && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default TaskForm
