import { Card, CardContent, Box, Typography, Chip, Tooltip } from '@mui/material'
import { 
  Work as WorkIcon, 
  Assessment as AssessmentIcon, 
  Event as EventIcon, 
  FiberNew as FiberNewIcon 
} from '@mui/icons-material'
const TYPE_CONFIG = {
  Placement: { icon: <WorkIcon fontSize="small" />,       color: '#22C55E', bg: 'rgba(34,197,94,0.12)',   label: 'Placement' },
  Result:    { icon: <AssessmentIcon fontSize="small" />, color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Result'    },
  Event:     { icon: <EventIcon fontSize="small" />,      color: '#38BDF8', bg: 'rgba(56,189,248,0.12)', label: 'Event'     },
}

function timeAgo(timestamp) {
  const mins = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function NotificationCard({ notification, rank, score, isNew }) {
  const cfg = TYPE_CONFIG[notification.Type] ?? TYPE_CONFIG.Event

  return (
    <Card sx={{
      mb: 1.5,
      borderLeft: `3px solid ${cfg.color}`,
      opacity: isNew === false ? 0.72 : 1,
      transition: 'all 0.2s ease',
      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
    }}>
      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>

          {/* Rank badge */}
          {rank !== undefined && (
            <Box sx={{
              minWidth: 32, height: 32, borderRadius: '50%',
              background: `linear-gradient(135deg, ${cfg.color}33, ${cfg.color}11)`,
              border: `1px solid ${cfg.color}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 800, color: cfg.color, mt: 0.25, flexShrink: 0,
            }}>
              #{rank}
            </Box>
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Type chip + NEW + score */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
              <Chip
                icon={cfg.icon} label={cfg.label} size="small"
                sx={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}44`, '& .MuiChip-icon': { color: cfg.color } }}
              />
              {isNew && (
                <Chip
                  icon={<FiberNewIcon fontSize="small" />}
                  label="New" size="small" color="secondary" variant="outlined"
                  sx={{ fontSize: '0.65rem' }}
                />
              )}
              {score !== undefined && (
                <Tooltip title="score = type weight + recency (max 100, decays over 24h)">
                  <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
                    score {score.toFixed(1)}
                  </Typography>
                </Tooltip>
              )}
            </Box>

            {/* Message */}
            <Typography variant="body2" sx={{
              fontWeight: isNew !== false ? 600 : 400,
              color: isNew !== false ? 'text.primary' : 'text.secondary',
              lineHeight: 1.4,
            }}>
              {notification.Message}
            </Typography>

            {/* Time */}
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
              {timeAgo(notification.Timestamp)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}