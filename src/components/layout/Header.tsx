import { Moon, Sun, Plus, Upload, LayoutList, CalendarDays } from 'lucide-react'
import { clsx } from 'clsx'
import { useStore } from '../../store/useStore'
import { companies } from '../../data/companies'
import { departments } from '../../data/departments'

export function Header() {
  const {
    sidebarMode, selectedId, viewMode, darkMode,
    toggleDarkMode, setShowTaskForm, setShowProtocolUpload, setViewMode,
  } = useStore()

  const title = selectedId === null
    ? 'Все задачи'
    : sidebarMode === 'companies'
      ? companies.find((c) => c.id === selectedId)?.name ?? ''
      : departments.find((d) => d.id === selectedId)?.name ?? ''

  return (
    <header className="h-14 px-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
      <h1 className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate max-w-lg" title={title}>
        {title}
      </h1>

      <div className="flex items-center gap-2">
        {/* View mode toggle */}
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
          <button
            onClick={() => setViewMode('list')}
            className={clsx(
              'p-1.5 transition-colors',
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50'
            )}
            title="Список"
          >
            <LayoutList size={16} />
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={clsx(
              'p-1.5 transition-colors',
              viewMode === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50'
            )}
            title="Календарь"
          >
            <CalendarDays size={16} />
          </button>
        </div>

        <button
          onClick={() => setShowProtocolUpload(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Upload size={14} />
          Протокол
        </button>

        <button
          onClick={() => setShowTaskForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={14} />
          Задача
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  )
}
