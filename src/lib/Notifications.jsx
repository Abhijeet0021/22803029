const API_BASE = 'http://4.224.186.213/evaluation-service/notifications'
const API_TOKEN = import.meta.env.VITE_API_TOKEN ?? ''

// ── Priority scoring ──────────────────────────────────────────────────────────
export const TYPE_WEIGHT = { Placement: 300, Result: 200, Event: 100 }

export function priorityScore(notification) {
  const ageMs = Date.now() - new Date(notification.Timestamp).getTime()
  const ageSecs = Math.max(0, ageMs / 1000)
  const recency = Math.max(0, 100 * (1 - ageSecs / 86400))
  return (TYPE_WEIGHT[notification.Type] ?? 0) + recency
}

export function getTopN(notifications, n) {
  return [...notifications]
    .sort((a, b) => priorityScore(b) - priorityScore(a))
    .slice(0, n)
}

// ── API fetch ─────────────────────────────────────────────────────────────────
export async function fetchNotifications(params = {}) {
  const url = new URL(API_BASE)
  if (params.limit)             url.searchParams.set('limit', params.limit)
  if (params.page)              url.searchParams.set('page', params.page)
  if (params.notification_type) url.searchParams.set('notification_type', params.notification_type)

  const headers = { 'Content-Type': 'application/json' }
  if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`

  const res = await fetch(url.toString(), { headers })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

// ── Viewed tracking (localStorage) ───────────────────────────────────────────
const VIEWED_KEY = 'campus_viewed_ids'

export function getViewedIds() {
  try {
    const raw = localStorage.getItem(VIEWED_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}

export function markViewed(ids) {
  const current = getViewedIds()
  ids.forEach(id => current.add(id))
  localStorage.setItem(VIEWED_KEY, JSON.stringify([...current]))
}

// ── Demo data (used when API is unreachable) ──────────────────────────────────
export function getDemoNotifications() {
  const now = new Date()
  const ago = mins => new Date(now.getTime() - mins * 60000).toISOString()
  return [
    { ID: '1',  Type: 'Placement', Message: 'Google SWE hiring drive — apply now',           Timestamp: ago(5) },
    { ID: '2',  Type: 'Result',    Message: 'Mid-sem results published',                     Timestamp: ago(60) },
    { ID: '3',  Type: 'Event',     Message: 'Hackathon registrations open',                  Timestamp: ago(30) },
    { ID: '4',  Type: 'Placement', Message: 'Microsoft internship — deadline tomorrow',      Timestamp: ago(120) },
    { ID: '5',  Type: 'Result',    Message: 'Quiz 3 results declared',                       Timestamp: ago(15) },
    { ID: '6',  Type: 'Event',     Message: 'Annual sports day schedule released',           Timestamp: ago(1440) },
    { ID: '7',  Type: 'Placement', Message: 'Amazon off-campus drive',                       Timestamp: ago(600) },
    { ID: '8',  Type: 'Result',    Message: 'Project evaluation scores out',                 Timestamp: ago(180) },
    { ID: '9',  Type: 'Event',     Message: 'Guest lecture by industry expert',              Timestamp: ago(720) },
    { ID: '10', Type: 'Placement', Message: 'TCS NQT results announced',                     Timestamp: ago(480) },
    { ID: '11', Type: 'Result',    Message: 'Final exam timetable published',                Timestamp: ago(1200) },
    { ID: '12', Type: 'Event',     Message: 'Cultural fest ticket sales begin',              Timestamp: ago(240) },
    { ID: '13', Type: 'Placement', Message: 'Infosys walk-in interview',                     Timestamp: ago(2880) },
    { ID: '14', Type: 'Result',    Message: 'Lab exam marks updated',                        Timestamp: ago(360) },
    { ID: '15', Type: 'Event',     Message: 'Alumni meet registration deadline approaching', Timestamp: ago(4320) },
  ]
}