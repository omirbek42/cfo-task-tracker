import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { companies } from '../../data/companies'
import { departments } from '../../data/departments'
import type { Priority, Status, Frequency, Task } from '../../types'
import { format } from 'date-fns'

const emptyForm = (): Omit<Task, 'id'> => ({
  title: '',
  companyId: companies[0].id,
  departmentId: departments[0].id,
  assignee: '',
  deadline: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  frequency: 'once',
  priority: 'medium',
  status: 'pending',
  protocolSource: '',
  protocolDate: '',
})

export function TaskForm() {
  const { showTaskForm, editingTask, setShowTaskForm, setEditingTask, addTask, updateTask } = useStore()
  const [form, setForm] = useState(emptyForm())

  useEffect(() => {
    if (editingTask) {
      setForm({
        ...editingTask,
        deadline: format(new Date(editingTask.deadline), "yyyy-MM-dd'T'HH:mm"),
      })
    } else {
      setForm(emptyForm())
    }
  }, [editingTask])

  if (!showTaskForm) return null

  const close = () => {
    setShowTaskForm(false)
    setEditingTask(null)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const task = { ...form, deadline: new Date(form.deadline).toISOString() }
    if (editingTask) {
      updateTask(editingTask.id, task)
    } else {
      addTask(task)
    }
    close()
  }

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: val }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            {editingTask ? 'Редактировать задачу' : 'Новая задача'}
          </h2>
          <button onClick={close} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="p-4 space-y-3">
          <div>
            <label className="label">Название *</label>
            <input
              required
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="input"
              placeholder="Краткое описание поручения"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Компания *</label>
              <select value={form.companyId} onChange={(e) => set('companyId', e.target.value)} className="input">
                {companies.map((c) => <option key={c.id} value={c.id}>{c.shortName}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Департамент *</label>
              <select value={form.departmentId} onChange={(e) => set('departmentId', e.target.value)} className="input">
                {departments.map((d) => <option key={d.id} value={d.id}>{d.shortName}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Исполнитель *</label>
            <input
              required
              value={form.assignee}
              onChange={(e) => set('assignee', e.target.value)}
              className="input"
              placeholder="ФИО исполнителя"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Срок *</label>
              <input
                required
                type="datetime-local"
                value={form.deadline}
                onChange={(e) => set('deadline', e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">Периодичность</label>
              <select value={form.frequency} onChange={(e) => set('frequency', e.target.value as Frequency)} className="input">
                <option value="once">Разовая</option>
                <option value="weekly">Еженедельная</option>
                <option value="monthly">Ежемесячная</option>
                <option value="quarterly">Квартальная</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Приоритет</label>
              <select value={form.priority} onChange={(e) => set('priority', e.target.value as Priority)} className="input">
                <option value="critical">Критический</option>
                <option value="high">Высокий</option>
                <option value="medium">Средний</option>
                <option value="low">Низкий</option>
              </select>
            </div>
            <div>
              <label className="label">Статус</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value as Status)} className="input">
                <option value="pending">Ожидание</option>
                <option value="in_progress">В работе</option>
                <option value="completed">Выполнено</option>
                <option value="overdue">Просрочено</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Протокол-источник</label>
              <input
                value={form.protocolSource ?? ''}
                onChange={(e) => set('protocolSource', e.target.value)}
                className="input"
                placeholder="Протокол №X от ..."
              />
            </div>
            <div>
              <label className="label">Дата протокола</label>
              <input
                type="date"
                value={form.protocolDate ?? ''}
                onChange={(e) => set('protocolDate', e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={close} className="flex-1 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
              Отмена
            </button>
            <button type="submit" className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {editingTask ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
