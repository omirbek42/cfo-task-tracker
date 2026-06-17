import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Pencil, Trash2, FileText } from 'lucide-react'
import { clsx } from 'clsx'
import type { Task, Priority, Status } from '../../types'
import { useStore } from '../../store/useStore'
import { companies } from '../../data/companies'
import { departments } from '../../data/departments'

const PRIORITY_STYLES: Record<Priority, string> = {
  critical: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  high: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  medium: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  low: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
}

const PRIORITY_LABELS: Record<Priority, string> = {
  critical: 'Критический',
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
}

const STATUS_LABELS: Record<Status, string> = {
  pending: 'Ожидание',
  in_progress: 'В работе',
  completed: 'Выполнено',
  overdue: 'Просрочено',
}

const STATUS_STYLES: Record<Status, string> = {
  pending: 'text-gray-500 dark:text-gray-400',
  in_progress: 'text-blue-600 dark:text-blue-400',
  completed: 'text-green-600 dark:text-green-400',
  overdue: 'text-red-600 dark:text-red-400 font-semibold',
}

const NEXT_STATUS: Record<Status, Status> = {
  pending: 'in_progress',
  in_progress: 'completed',
  completed: 'pending',
  overdue: 'in_progress',
}

interface Props {
  task: Task
  showCompany?: boolean
}

export function TaskRow({ task, showCompany }: Props) {
  const { updateTask, deleteTask, setEditingTask, sidebarMode } = useStore()
  const company = companies.find((c) => c.id === task.companyId)
  const department = departments.find((d) => d.id === task.departmentId)

  const cycleStatus = () => updateTask(task.id, { status: NEXT_STATUS[task.status] })

  return (
    <div className={clsx(
      'flex items-start gap-3 px-5 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 group transition-colors',
      task.status === 'overdue' && 'bg-red-50/50 dark:bg-red-950/20'
    )}>
      {/* Priority stripe */}
      <div className={clsx('w-1 self-stretch rounded-full flex-shrink-0 mt-0.5', {
        'bg-red-500': task.priority === 'critical',
        'bg-amber-500': task.priority === 'high',
        'bg-blue-500': task.priority === 'medium',
        'bg-green-500': task.priority === 'low',
      })} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 flex-1 min-w-0">{task.title}</p>
          <span className={clsx('text-xs px-2 py-0.5 rounded border flex-shrink-0', PRIORITY_STYLES[task.priority])}>
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span>{task.assignee}</span>
          {(showCompany || sidebarMode === 'departments') && company && (
            <span className="text-gray-400 dark:text-gray-500">· {company.shortName}</span>
          )}
          {department && (
            <span className="text-gray-400 dark:text-gray-500">· {department.shortName}</span>
          )}
          {task.protocolSource && (
            <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
              <FileText size={11} />
              {task.protocolSource}
            </span>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {format(new Date(task.deadline), 'd MMM yyyy, HH:mm', { locale: ru })}
        </span>
        <button
          onClick={cycleStatus}
          className={clsx('text-xs', STATUS_STYLES[task.status], 'hover:underline')}
        >
          {STATUS_LABELS[task.status]}
        </button>
      </div>

      <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setEditingTask(task)}
          className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
