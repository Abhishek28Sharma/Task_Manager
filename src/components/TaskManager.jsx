import { useState, useEffect } from 'react'
import axios from 'axios'
import TaskForm from './TaskForm'
import TaskItem from './TaskItem'

//import environment variable
const API_URL = import.meta.env.VITE_API_URL

const TaskManager = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editingTask, setEditingTask] = useState(null)

  //filter task
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await axios.get(API_URL)
      setTasks(response.data)
    } catch (err) {
      setError('Failed to sync with server.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingTask) {
        const res = await axios.patch(`${API_URL}/${editingTask._id}`, formData)
        setTasks(tasks.map((t) => (t._id === editingTask._id ? res.data : t)))
        setEditingTask(null)
      } else {
        // POST /tasks to create a new task
        const res = await axios.post(API_URL, { ...formData, completed: false })
        setTasks([...tasks, res.data])
      }
    } catch (err) {
      setError('Save failed.')
    }
  }

  const toggleComplete = async (task) => {
    try {
      // Allow a task to be marked as completed
      const res = await axios.patch(`${API_URL}/${task._id}`, {
        completed: !task.completed,
      })
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)))
    } catch (err) {
      setError('Update failed.')
    }
  }

  const handleDelete = async (id) => {
    try {
      // Allow a task to be deleted
      await axios.delete(`${API_URL}/${id}`)
      setTasks(tasks.filter((t) => t._id !== id))
    } catch (err) {
      setError('Delete failed.')
    }
  }

  // filter logic
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed
    if (filter === 'incomplete') return !task.completed
    return true
  })
  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">
          Task Manager
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your daily goals efficiently
        </p>
      </header>

      <TaskForm
        onSubmit={handleCreateOrUpdate}
        editingTask={editingTask}
        onCancel={() => setEditingTask(null)}
      />

      <div className="flex justify-center gap-2 mb-8">
        {['all', 'incomplete', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-full text-sm font-medium capitalize transition-all ${
              filter === f
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded flex justify-between">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="font-bold cursor-pointer"
          >
            x
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={toggleComplete}
                onDelete={handleDelete}
                onEdit={setEditingTask}
              />
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-400">
                {filter === 'all'
                  ? 'No tasks yet. Start by adding one above!'
                  : `No ${filter} tasks found.`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TaskManager
