import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, SidebarMode, ViewMode, Priority, Status, Frequency } from '../types'
import { seedTasks } from '../data/seedTasks'

interface Filters {
  status: Status | 'all'
  sortBy: 'priority' | 'deadline'
}

interface Store {
  // Data
  tasks: Task[]
  // Navigation
  sidebarMode: SidebarMode
  selectedId: string | null
  viewMode: ViewMode
  // UI
  darkMode: boolean
  showTaskForm: boolean
  editingTask: Task | null
  showProtocolUpload: boolean
  weekOffset: number
  filters: Filters
  // Actions
  setSidebarMode: (mode: SidebarMode) => void
  setSelectedId: (id: string | null) => void
  setViewMode: (mode: ViewMode) => void
  toggleDarkMode: () => void
  setShowTaskForm: (v: boolean) => void
  setEditingTask: (task: Task | null) => void
  setShowProtocolUpload: (v: boolean) => void
  setWeekOffset: (offset: number) => void
  setFilters: (f: Partial<Filters>) => void
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  addTasksBatch: (tasks: Omit<Task, 'id'>[]) => void
}

const PRIORITY_ORDER: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 }

export const useStore = create<Store>()(
  persist(
    (set) => ({
      tasks: seedTasks,
      sidebarMode: 'companies',
      selectedId: null,
      viewMode: 'list',
      darkMode: false,
      showTaskForm: false,
      editingTask: null,
      showProtocolUpload: false,
      weekOffset: 0,
      filters: { status: 'all', sortBy: 'deadline' },

      setSidebarMode: (mode) => set({ sidebarMode: mode, selectedId: null }),
      setSelectedId: (id) => set({ selectedId: id }),
      setViewMode: (mode) => set({ viewMode: mode }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setShowTaskForm: (v) => set({ showTaskForm: v }),
      setEditingTask: (task) => set({ editingTask: task, showTaskForm: !!task }),
      setShowProtocolUpload: (v) => set({ showProtocolUpload: v }),
      setWeekOffset: (offset) => set({ weekOffset: offset }),
      setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),

      addTask: (task) =>
        set((s) => ({
          tasks: [...s.tasks, { ...task, id: crypto.randomUUID() }],
        })),

      updateTask: (id, updates) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      addTasksBatch: (tasks) =>
        set((s) => ({
          tasks: [...s.tasks, ...tasks.map((t) => ({ ...t, id: crypto.randomUUID() }))],
        })),
    }),
    {
      name: 'cfo-tracker-storage',
      partialize: (s) => ({ tasks: s.tasks, darkMode: s.darkMode }),
    }
  )
)

export function sortedTasks(tasks: Task[], sortBy: 'priority' | 'deadline') {
  return [...tasks].sort((a, b) => {
    if (sortBy === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  })
}
