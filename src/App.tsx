import { useEffect } from 'react'
import { useStore } from './store/useStore'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { MetricsBar } from './components/metrics/MetricsBar'
import { TaskList } from './components/tasks/TaskList'
import { TaskForm } from './components/tasks/TaskForm'
import { WeekView } from './components/calendar/WeekView'
import { ProtocolUpload } from './components/protocol/ProtocolUpload'

export function App() {
  const { darkMode, tasks, sidebarMode, selectedId, viewMode, showTaskForm, showProtocolUpload } = useStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const contextTasks = tasks.filter((t) => {
    if (selectedId === null) return true
    return sidebarMode === 'companies' ? t.companyId === selectedId : t.departmentId === selectedId
  })

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <MetricsBar tasks={contextTasks} />

        <div className="flex-1 min-h-0 overflow-hidden">
          {viewMode === 'list' ? <TaskList /> : <WeekView />}
        </div>
      </div>

      {showTaskForm && <TaskForm />}
      {showProtocolUpload && <ProtocolUpload />}
    </div>
  )
}
