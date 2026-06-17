import {
  startOfWeek, endOfWeek, eachDayOfInterval, addWeeks,
  format, isSameDay, getHours, getMinutes, parseISO,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, CalendarCheck } from 'lucide-react'
import { clsx } from 'clsx'
import { useStore } from '../../store/useStore'
import { companies } from '../../data/companies'
import type { Priority, Task } from '../../types'

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8) // 8–19

const PRIORITY_BG: Record<Priority, string> = {
  critical: 'bg-red-500 border-red-600',
  high: 'bg-amber-500 border-amber-600',
  medium: 'bg-blue-500 border-blue-600',
  low: 'bg-green-500 border-green-600',
}

function TaskBlock({ task, showCompany }: { task: Task; showCompany: boolean }) {
  const company = companies.find((c) => c.id === task.companyId)
  const dt = parseISO(task.deadline)
  const top = ((getHours(dt) - 8) * 60 + getMinutes(dt)) * (48 / 60)

  return (
    <div
      style={{ top: `${top}px`, left: '2px', right: '2px', minHeight: '36px' }}
      className={clsx(
        'absolute rounded px-1.5 py-1 border text-white text-xs shadow overflow-hidden',
        PRIORITY_BG[task.priority]
      )}
    >
      <p className="font-medium leading-tight truncate">{task.title}</p>
      <p className="opacity-80 truncate">{task.assignee}</p>
      {showCompany && company && <p className="opacity-70 truncate">{company.shortName}</p>}
    </div>
  )
}

export function WeekView() {
  const { tasks, sidebarMode, selectedId, weekOffset, setWeekOffset } = useStore()
  const base = addWeeks(new Date(), weekOffset)
  const weekStart = startOfWeek(base, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(base, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd }).slice(0, 5) // Mon–Fri

  const filtered = tasks.filter((t) => {
    if (selectedId === null) return true
    return sidebarMode === 'companies' ? t.companyId === selectedId : t.departmentId === selectedId
  })

  const tasksForDay = (day: Date) =>
    filtered.filter((t) => isSameDay(parseISO(t.deadline), day))

  const showCompany = sidebarMode === 'departments'

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Week nav */}
      <div className="flex items-center gap-3 px-5 py-2.5 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setWeekOffset(weekOffset - 1)}
          className="p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {format(weekStart, 'd MMM', { locale: ru })} — {format(weekEnd, 'd MMM yyyy', { locale: ru })}
        </span>
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <ChevronRight size={18} />
        </button>
        {weekOffset !== 0 && (
          <button
            onClick={() => setWeekOffset(0)}
            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            <CalendarCheck size={13} />
            Сегодня
          </button>
        )}
      </div>

      {/* Calendar grid */}
      <div className="flex flex-1 overflow-auto">
        {/* Time axis */}
        <div className="w-12 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
          <div className="h-8" /> {/* header spacer */}
          {HOURS.map((h) => (
            <div key={h} style={{ height: '48px' }} className="flex items-start justify-end pr-1.5 text-xs text-gray-400 dark:text-gray-500">
              {h}:00
            </div>
          ))}
        </div>

        {/* Day columns */}
        <div className="flex flex-1 min-w-0">
          {days.map((day) => {
            const dayTasks = tasksForDay(day)
            const isToday = isSameDay(day, new Date())
            return (
              <div key={day.toISOString()} className="flex-1 min-w-0 border-r border-gray-100 dark:border-gray-800">
                {/* Day header */}
                <div className={clsx(
                  'h-8 flex flex-col items-center justify-center text-xs border-b border-gray-200 dark:border-gray-700',
                  isToday ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400'
                )}>
                  <span className="font-medium">{format(day, 'EEEEEE', { locale: ru }).toUpperCase()}</span>
                  <span>{format(day, 'd')}</span>
                </div>

                {/* Hour rows + task blocks */}
                <div className="relative">
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      style={{ height: '48px' }}
                      className="border-b border-gray-100 dark:border-gray-800"
                    />
                  ))}
                  {dayTasks.map((t) => (
                    <TaskBlock key={t.id} task={t} showCompany={showCompany} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
