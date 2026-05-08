import { useState, useEffect, useCallback } from 'react'
import {
  Box, Container, Typography, Alert, Select, MenuItem,
  FormControl, InputLabel, Skeleton, Divider,
  IconButton, Tooltip, Paper, Slider,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import NavBar from '../components/NavBar'
import NotificationCard from '../components/NotificationCard'
import {
  fetchNotifications, getTopN, priorityScore,
  getViewedIds, markViewed, getDemoNotifications,
} from '../lib/notifications'

const TYPE_OPTIONS = [
  { value: '',          label: 'All Types' },
  { value: 'Placement', label: 'Placement' },
  { value: 'Result',    label: 'Result'    },
  { value: 'Event',     label: 'Event'     },
]

const N_MARKS = [5, 10, 15, 20].map(v => ({ value: v, label: String(v) }))

export default function PriorityInbox() {
  const [allNotifs,  setAllNotifs]  = useState([])
  const [topN,       setTopN]       = useState([])
  const [n,          setN]          = useState(10)
  const [typeFilter, setTypeFilter] = useState('')
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [viewedIds,  setViewedIds]  = useState(new Set())

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { limit: 100 }
      if (typeFilter) params.notification_type = typeFilter
      const data    = await fetchNotifications(params)
      const fetched = data.notifications ?? []
      setAllNotifs(fetched)
      setTimeout(() => {
        markViewed(fetched.map(n => n.ID))
        setViewedIds(getViewedIds())
      }, 2000)
    } catch (e) {
      setError(e.message ?? 'Failed to load notifications')
      setAllNotifs(getDemoNotifications())
    } finally {
      setLoading(false)
    }
  }, [typeFilter])

  useEffect(() => { setViewedIds(getViewedIds()) }, [])
  useEffect(() => { load() }, [load])

  // Recompute top-N whenever source data, N, or filter changes
  useEffect(() => {
    const filtered = typeFilter
      ? allNotifs.filter(notif => notif.Type === typeFilter)
      : allNotifs
    setTopN(getTopN(filtered, n))
  }, [allNotifs, n, typeFilter])

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0A0A14 0%, #0D0D1F 100%)' }}>
      <NavBar />

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Heading */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: 3, flexShrink: 0,
            background: 'linear-gradient(135deg, #6C63FF33, #FF658433)',
            border: '1px solid rgba(108,99,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <EmojiEventsIcon sx={{ color: '#6C63FF' }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ mb: 0 }}>Priority Inbox</Typography>
            <Typography variant="body2" color="text.secondary">
              Top notifications ranked by type weight + recency
            </Typography>
          </Box>
        </Box>

        {/* Scoring legend */}
        <Paper sx={{
          p: 2, mb: 3, borderRadius: 2,
          background: 'rgba(108,99,255,0.06)',
          border: '1px solid rgba(108,99,255,0.2)',
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: 'block', letterSpacing: '0.08em' }}>
            SCORING FORMULA
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
            score = type_weight + recency_bonus
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, mt: 1, flexWrap: 'wrap' }}>
            {[
              { label: 'Placement', weight: 300, color: '#22C55E' },
              { label: 'Result',    weight: 200, color: '#F59E0B' },
              { label: 'Event',     weight: 100, color: '#38BDF8' },
            ].map(t => (
              <Typography key={t.label} variant="caption" sx={{ color: t.color }}>
                {t.label}: {t.weight} + up to 100 recency
              </Typography>
            ))}
          </Box>
        </Paper>

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Filter by type</InputLabel>
            <Select
              value={typeFilter}
              label="Filter by type"
              onChange={e => setTypeFilter(e.target.value)}
            >
              {TYPE_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </Select>
          </FormControl>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="caption" color="text.secondary">
              Show top N: <strong style={{ color: '#6C63FF' }}>{n}</strong>
            </Typography>
            <Slider
              value={n} min={5} max={20} step={5} marks={N_MARKS}
              onChange={(_, v) => setN(v)}
              size="small" sx={{ color: '#6C63FF', display: 'block' }}
            />
          </Box>

          <Tooltip title="Refresh">
            <IconButton onClick={load} size="small"><RefreshIcon /></IconButton>
          </Tooltip>
        </Box>

        <Divider sx={{ mb: 3, borderColor: 'rgba(108,99,255,0.15)' }} />

        {error && <Alert severity="warning" sx={{ mb: 2 }}>{error} — showing demo data</Alert>}

        {/* Priority list */}
        {loading
          ? Array.from({ length: n }).map((_, i) =>
              <Skeleton key={i} variant="rounded" height={80} sx={{ mb: 1.5, borderRadius: 2 }} />
            )
          : topN.length === 0
            ? <Typography color="text.secondary" align="center" sx={{ py: 8 }}>No notifications found</Typography>
            : topN.map((notif, idx) => (
                <NotificationCard
                  key={notif.ID}
                  notification={notif}
                  rank={idx + 1}
                  score={priorityScore(notif)}
                  isNew={!viewedIds.has(notif.ID)}
                />
              ))
        }
      </Container>
    </Box>
  )
}