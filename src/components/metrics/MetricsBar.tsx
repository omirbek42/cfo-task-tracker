import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react'
import type { Task } from '../../types'

interface Props {
  tasks: Task[]
}

export function MetricsBar({ tasks }: Props) {
  const total = tasks.length
  const completed = tasks.filter((t) => t.status === 'completed').length
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length
  const overdue = tasks.filter((t) => t.status === 'overdue').length

  const items = [
    { label: 'Всего', value: total, icon: ListTodo, color: 'text-gray-600 dark:text-gray-300', bg: 'bg-gray-100 dark:bg-gray-800' },
    { label: 'Выполнено', value: completed, icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30' },
    { label: 'В работе', value: inProgress, icon: Clock, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { label: 'Просрочено', value: overdue, icon: AlertCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30' },
  ]

  return (
    <div className="flex gap-3 px-5 py-3 border-b border-gray-200 dark:border-gray-700">
      {items.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${bg} flex-1`}>
          <Icon size={16} className={color} />
          <div>
            <p className={`text-lg font-bold leading-none ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
