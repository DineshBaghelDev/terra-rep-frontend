export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export const ACTIVITY_TYPES = [
  { value: 'electricity', label: 'Electricity', icon: '⚡' },
  { value: 'diesel', label: 'Diesel', icon: '⛽' },
  { value: 'freight', label: 'Freight', icon: '🚚' },
  { value: 'flight', label: 'Flight', icon: '✈️' },
  { value: 'waste', label: 'Waste', icon: '🗑️' },
  { value: 'spend', label: 'Spend', icon: '💰' },
]

export const SCOPE_LABELS = {
  1: 'Scope 1 - Direct Emissions',
  2: 'Scope 2 - Indirect Emissions',
  3: 'Scope 3 - Value Chain',
}

export const FRAMEWORKS = [
  { id: 'brsr', name: 'BRSR', description: 'Business Responsibility and Sustainability Reporting' },
  { id: 'ghg', name: 'GHG Protocol', description: 'Greenhouse Gas Protocol' },
  { id: 'csrd', name: 'CSRD', description: 'Corporate Sustainability Reporting Directive (EU)' },
]

export const FILE_TYPES = {
  'application/pdf': { icon: '📄', color: 'red' },
  'text/csv': { icon: '📊', color: 'green' },
  'application/vnd.ms-excel': { icon: '📊', color: 'green' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: '📊', color: 'green' },
}
