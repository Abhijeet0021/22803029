import { useState, useEffect, useCallback } from 'react'
import {
  Box, Container, Typography, Alert, Select, MenuItem,
  FormControl, InputLabel, Pagination, Skeleton, Chip,
  Divider, IconButton, Tooltip,
} from '@mui/material'
import { Refresh as RefreshIcon } from '@mui/icons-material'
import NavBar from '../components/NavBar'
import NotificationCard from '../components/NotificationCard'
import {
  fetchNotifications, getViewedIds, markViewed, getDemoNotifications,
} from '../lib/notifications'

const PAGE_SIZE = 15

const TYPE_OPTIONS = [
  { value: '',          label: 'All Types'  },
  { value: 'Placement', label: 'Placement'  },
  { value: 'Result',    label: 'Result'     },
  { value: 'Event',     label: 'Event'      },
]

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [page,          setPage]          = useState(1)
  const [typeFilter,    setTypeFilter]    = useState('')
  const [viewedIds,     setViewedIds]     = useState(new Set())
  const [totalPages,    setTotalPages]    = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { limit: PAGE_SIZE, page }
      if (typeFilter) params.notification_type = typeFilter
      const data    = await fetchNotifications(params)
      const fetched = data.notifications ?? []
      setNotifications(fetched)
      setTotalPages(fetched.length < PAGE_SIZE ? page : page + 1)
      // Mark as viewed after 2 s
      setTimeout(() => {
        markViewed(fetched.map(n => n.ID))
        setViewedIds(getViewedIds())
      }, 2000)
    } catch (e) {
      setError(e.message ?? 'Failed to load notifications')
      const demo     = getDemoNotifications()
      const filtered = typeFilter ? demo.filter(n => n.Type === typeFilter) : demo
      setNotifications(filtered)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [page, typeFilter])

  useEffect(() => { setViewedIds(getViewedIds()) }, [])
  useEffect(() => { load() }, [load])

  const unreadCount = notifications.filter(n => !viewedIds.has(n.ID)).length

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0A0A14 0%, #0D0D1F 100%)' }}>
      
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Heading */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>All Notifications</Typography>
          <Typography variant="body2" color="text.secondary">
            Stay updated with placements, results, and events
          </Typography>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Filter by type</InputLabel>
            <Select
              value={typeFilter}
              label="Filter by type"
              onChange={e => { setTypeFilter(e.target.value); setPage(1) }}
            >
              {TYPE_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </Select>
          </FormControl>

          {unreadCount > 0 && (
            <Chip label={`${unreadCount} unread`} color="secondary" size="small" variant="outlined" />
          )}

          <Tooltip title="Refresh">
            <IconButton onClick={load} size="small" sx={{ ml: 'auto' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider sx={{ mb: 3, borderColor: 'rgba(108,99,255,0.15)' }} />

        {error && <Alert severity="warning" sx={{ mb: 2 }}>{error} — showing demo data</Alert>}

        {/* List */}
        {loading
          ? Array.from({ length: 6 }).map((_, i) =>
              <Skeleton key={i} variant="rounded" height={80} sx={{ mb: 1.5, borderRadius: 2 }} />
            )
          : notifications.length === 0
            ? <Typography color="text.secondary" align="center" sx={{ py: 8 }}>No notifications found</Typography>
            : notifications.map(n =>
                <NotificationCard key={n.ID} notification={n} isNew={!viewedIds.has(n.ID)} />
              )
        }

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages} page={page}
              onChange={(_, v) => setPage(v)}
              color="primary" shape="rounded"
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}