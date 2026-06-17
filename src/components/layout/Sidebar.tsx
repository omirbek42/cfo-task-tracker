import { useState } from 'react'
import { Search, Building2, LayoutGrid } from 'lucide-react'
import { clsx } from 'clsx'
import { useStore } from '../../store/useStore'
import { companies } from '../../data/companies'
import { departments } from '../../data/departments'

export function Sidebar() {
  const { sidebarMode, selectedId, tasks, setSidebarMode, setSelectedId } = useStore()
  const [search, setSearch] = useState('')

  const getStats = (entityId: string, field: 'companyId' | 'departmentId') => {
    const filtered = tasks.filter((t) => t[field] === entityId)
    const overdue = filtered.filter((t) => t.status === 'overdue').length
    return { total: filtered.length, overdue }
  }

  const filteredCompanies = companies.filter((c) =>
    c.shortName.toLowerCase().includes(search.toLowerCase())
  )
  const filteredDepartments = departments.filter((d) =>
    d.shortName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <aside className="w-72 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Mode toggle */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
          <button
            onClick={() => setSidebarMode('companies')}
            className={clsx(
              'flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors',
              sidebarMode === 'companies'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            )}
          >
            <Building2 size={13} />
            Компании
          </button>
          <button
            onClick={() => setSidebarMode('departments')}
            className={clsx(
              'flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors',
              sidebarMode === 'departments'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            )}
          >
            <LayoutGrid size={13} />
            Департаменты
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200 placeholder-gray-400"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-1">
        {/* All tasks item */}
        <button
          onClick={() => setSelectedId(null)}
          className={clsx(
            'w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
            selectedId === null && 'bg-blue-50 dark:bg-blue-900/30 border-r-2 border-blue-600'
          )}
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Все задачи</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{tasks.length}</span>
        </button>

        {sidebarMode === 'companies'
          ? filteredCompanies.map((c) => {
              const stats = getStats(c.id, 'companyId')
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={clsx(
                    'w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                    selectedId === c.id && 'bg-blue-50 dark:bg-blue-900/30 border-r-2 border-blue-600'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-200 truncate">{c.shortName}</p>
                    <p className="text-xs text-gray-400 truncate">{c.category}</p>
                  </div>
                  <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{stats.total}</span>
                    {stats.overdue > 0 && (
                      <span className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {stats.overdue}
                      </span>
                    )}
                  </div>
                </button>
              )
            })
          : filteredDepartments.map((d) => {
              const stats = getStats(d.id, 'departmentId')
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedId(d.id)}
                  className={clsx(
                    'w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                    selectedId === d.id && 'bg-blue-50 dark:bg-blue-900/30 border-r-2 border-blue-600'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-200 truncate">{d.shortName}</p>
                  </div>
                  <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{stats.total}</span>
                    {stats.overdue > 0 && (
                      <span className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {stats.overdue}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
      </div>
    </aside>
  )
}
