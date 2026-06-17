import type { Department } from '../types'

export const departments: Department[] = [
  { id: 'economics', name: 'Департамент экономики и планирования', shortName: 'Экономика и планирование' },
  { id: 'investments', name: 'Департамент инвестиций', shortName: 'Инвестиции' },
  { id: 'treasury', name: 'Департамент казначейства', shortName: 'Казначейство' },
  { id: 'corpfinance', name: 'Департамент корпоративных финансов', shortName: 'Корпоративные финансы' },
  { id: 'tax', name: 'Департамент по налогам', shortName: 'Налоги' },
  { id: 'audit', name: 'Департамент ревизии и контроля', shortName: 'Ревизия и контроль' },
  { id: 'accounting', name: 'Департамент бухгалтерского учёта и отчётности', shortName: 'Бухгалтерия' },
]
