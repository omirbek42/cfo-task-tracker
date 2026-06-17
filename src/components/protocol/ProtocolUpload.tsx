import { useState, useRef } from 'react'
import { X, Upload, Check } from 'lucide-react'
import { clsx } from 'clsx'
import { format, addDays } from 'date-fns'
import { useStore } from '../../store/useStore'
import { companies } from '../../data/companies'
import { departments } from '../../data/departments'
import type { ParsedTask, Priority } from '../../types'

const MOCK_PARSED: ParsedTask[] = [
  {
    id: 'p1',
    title: 'Предоставить отчёт по дебиторской задолженности',
    assignee: 'Сейткали А.Б.',
    deadline: addDays(new Date(), 5).toISOString(),
    priority: 'high',
    accepted: true,
  },
  {
    id: 'p2',
    title: 'Провести сверку расчётов с контрагентами',
    assignee: 'Турсунов Е.И.',
    deadline: addDays(new Date(), 10).toISOString(),
    priority: 'medium',
    accepted: true,
  },
  {
    id: 'p3',
    title: 'Подготовить аналитическую справку по CAPEX',
    assignee: 'Ахметова С.Е.',
    deadline: addDays(new Date(), 14).toISOString(),
    priority: 'critical',
    accepted: true,
  },
]

const PRIORITY_LABELS: Record<Priority, string> = {
  critical: 'Критический',
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
}

type Step = 'upload' | 'parsing' | 'review'

export function ProtocolUpload() {
  const { setShowProtocolUpload, addTasksBatch } = useStore()
  const [step, setStep] = useState<Step>('upload')
  const [fileName, setFileName] = useState('')
  const [protocolName, setProtocolName] = useState('')
  const [companyId, setCompanyId] = useState(companies[0].id)
  const [departmentId, setDepartmentId] = useState(departments[0].id)
  const [parsed, setParsed] = useState<ParsedTask[]>(MOCK_PARSED)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const simulateParse = (name: string) => {
    setFileName(name)
    setProtocolName(`Протокол от ${format(new Date(), 'dd.MM.yyyy')}`)
    setStep('parsing')
    setTimeout(() => {
      setParsed(MOCK_PARSED.map((p) => ({ ...p, accepted: true })))
      setStep('review')
    }, 1800)
  }

  const handleFile = (file: File) => {
    if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      simulateParse(file.name)
    }
  }

  const toggleAccept = (id: string) =>
    setParsed((prev) => prev.map((p) => (p.id === id ? { ...p, accepted: !p.accepted } : p)))

  const confirm = () => {
    const accepted = parsed.filter((p) => p.accepted)
    addTasksBatch(
      accepted.map((p) => ({
        title: p.title,
        assignee: p.assignee,
        deadline: p.deadline,
        priority: p.priority,
        companyId,
        departmentId,
        frequency: 'once' as const,
        status: 'pending' as const,
        protocolSource: protocolName,
        protocolDate: format(new Date(), 'yyyy-MM-dd'),
      }))
    )
    setShowProtocolUpload(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Загрузка протокола</h2>
          <button onClick={() => setShowProtocolUpload(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {step === 'upload' && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="label">Компания</label>
                  <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} className="input">
                    {companies.map((c) => <option key={c.id} value={c.id}>{c.shortName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Департамент</label>
                  <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="input">
                    {departments.map((d) => <option key={d.id} value={d.id}>{d.shortName}</option>)}
                  </select>
                </div>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                onClick={() => inputRef.current?.click()}
                className={clsx(
                  'border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-colors',
                  dragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <Upload size={32} className="text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Перетащите файл протокола <span className="font-medium">.docx</span> сюда<br />
                  или нажмите для выбора
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".docx,.doc"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                />
              </div>
            </>
          )}

          {step === 'parsing' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <div className="text-center">
                <p className="font-medium text-gray-800 dark:text-gray-100">{fileName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Извлечение поручений...</p>
              </div>
            </div>
          )}

          {step === 'review' && (
            <>
              <div className="mb-3">
                <label className="label">Название протокола</label>
                <input
                  value={protocolName}
                  onChange={(e) => setProtocolName(e.target.value)}
                  className="input"
                />
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Найдено поручений: {parsed.length}. Отметьте для переноса в трекер:
              </p>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {parsed.map((p) => (
                  <div
                    key={p.id}
                    className={clsx(
                      'flex items-start gap-3 p-3 rounded-lg border transition-colors',
                      p.accepted
                        ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60'
                    )}
                  >
                    <button
                      onClick={() => toggleAccept(p.id)}
                      className={clsx(
                        'w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
                        p.accepted ? 'bg-blue-600 text-white' : 'border-2 border-gray-300 dark:border-gray-500'
                      )}
                    >
                      {p.accepted && <Check size={12} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{p.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {p.assignee} · {PRIORITY_LABELS[p.priority]} · {format(new Date(p.deadline), 'dd.MM.yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowProtocolUpload(false)}
                  className="flex-1 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  Отмена
                </button>
                <button
                  onClick={confirm}
                  disabled={!parsed.some((p) => p.accepted)}
                  className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Перенести ({parsed.filter((p) => p.accepted).length})
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
