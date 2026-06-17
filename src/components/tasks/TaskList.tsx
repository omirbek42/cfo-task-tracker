import { clsx } from 'clsx'
import { useStore, sortedTasks } from '../../store/useStore'
import { TaskRow } from './TaskRow'
import type { Status } from '../../types'

const STATUS_FILTERS: { value: Status | 'all'; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'pending', label: 'Ожидание' },
  { value: 'completed', label: 'Выполнено' },
  { value: 'overdue', label: 'Просрочено' },
]

export function TaskList() {
  const { tasks, sidebarMode, selectedId, filters, setFilters } = useStore()

  const filtered = tasks.filter((t) => {
    const matchesScope = selectedId === null
      ? true
      : sidebarMode === 'companies'
        ? t.companyId === selectedId
        : t.departmentId === selectedId
    const matchesStatus = filters.status === 'all' || t.status === filters.status
    return matchesScope && matchesStatus
  })

  const sorted = sortedTasks(filtered, filters.sortBy)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-2.5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-1">
          {STATUS_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilters({ status: value })}
              className={clsx(
                'px-2.5 py-1 text-xs rounded-md transition-colors',
                filters.status === value
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          Сортировка:
          <button
            onClick={() => setFilters({ sortBy: 'deadline' })}
            className={clsx('hover:text-blue-600', filters.sortBy === 'deadline' && 'text-blue-600 dark:text-blue-400 font-medium')}
          >
            По сроку
          </button>
          <span>·</span>
          <button
            onClick={() => setFilters({ sortBy: 'priority' })}
            className={clsx('hover:text-blue-600', filters.sortBy === 'priority' && 'text-blue-600 dark:text-blue-400 font-medium')}
          >
            По приоритету
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm text-gray-400 dark:text-gray-500">
            Задачи не найдены
          </div>
        ) : (
          sorted.map((task) => <TaskRow key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}
