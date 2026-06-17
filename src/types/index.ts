export type Priority = 'critical' | 'high' | 'medium' | 'low'
export type Status = 'pending' | 'in_progress' | 'completed' | 'overdue'
export type Frequency = 'once' | 'weekly' | 'monthly' | 'quarterly'
export type SidebarMode = 'companies' | 'departments'
export type ViewMode = 'list' | 'calendar'

export interface Task {
  id: string
  title: string
  companyId: string
  departmentId: string
  assignee: string
  deadline: string // ISO string
  frequency: Frequency
  priority: Priority
  status: Status
  protocolSource?: string
  protocolDate?: string
  notes?: string
}

export interface Company {
  id: string
  name: string
  shortName: string
  category: string
}

export interface Department {
  id: string
  name: string
  shortName: string
}

export interface ParsedTask {
  id: string
  title: string
  assignee: string
  deadline: string
  priority: Priority
  accepted: boolean
}
