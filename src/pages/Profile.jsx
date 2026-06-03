import React from 'react';
import {
  Box, Card, CardContent, Typography, Avatar, Stack,
  Divider, Chip, Button, LinearProgress
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LogoutIcon from '@mui/icons-material/Logout';
import BadgeIcon from '@mui/icons-material/Badge';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
    <Box sx={{ width: 38, height: 38, borderRadius: 3, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{label}</Typography>
      <Typography variant="body2" fontWeight={600} sx={{ mt: 0.2 }}>{value || 'N/A'}</Typography>
    </Box>
  </Box>
);

const Profile = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleLogout = () => {
    localStorage.removeItem('guard_token');
    navigate('/login');
  };

  return (
    <Stack spacing={2.5}>
      {/* Profile Hero Card */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <Box sx={{ height: 100, background: 'linear-gradient(135deg, #00897B, #00695C, #004D40)' }} />
        <CardContent sx={{ pt: 0, px: 2.5, pb: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: -5, mb: 2 }}>
            <Avatar sx={{
              width: 80, height: 80,
              fontSize: 32, fontWeight: 700,
              bgcolor: '#fff',
              color: 'primary.main',
              border: '4px solid #fff',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              borderRadius: 4,
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Chip
              icon={<Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#4CAF50', ml: '6px !important' }} />}
              label="On Duty"
              size="small"
              sx={{ bgcolor: '#E8F5E9', color: 'success.dark', fontWeight: 700, mb: 0.5 }}
            />
          </Box>
          <Typography variant="h6">{user.name}</Typography>
          <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mt: 0.3 }}>
            Security Guard{profile?.societyName ? ` · ${profile.societyName}` : ''}
          </Typography>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ px: 2.5, py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Personal Info</Typography>
          <Divider sx={{ mb: 1 }} />
          <Stack divider={<Divider sx={{ opacity: 0.5 }} />}>
            <InfoRow icon={<PhoneIcon fontSize="small" color="action" />}       label="Phone Number"  value={user.phone} />
            <InfoRow icon={<EmailIcon fontSize="small" color="action" />}       label="Email Address" value={user.email} />
            <InfoRow icon={<LocationOnIcon fontSize="small" color="action" />}  label="Assigned Gate" value={profile?.gateNumber ? `Gate ${profile.gateNumber}` : null} />
            <InfoRow icon={<CalendarTodayIcon fontSize="small" color="action" />} label="Joined On"   value={joinDate} />
          </Stack>
        </CardContent>
      </Card>

      {/* Shift Card */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>Shift Details</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
            <Box sx={{ width: 42, height: 42, borderRadius: 3, bgcolor: '#E0F2F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AccessTimeIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Current Shift</Typography>
              <Typography variant="body2" fontWeight={700}>{profile?.shift || 'Morning (6AM – 2PM)'}</Typography>
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Performance Score</Typography>
              <Typography variant="caption" color="success.main" fontWeight={700}>98%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={98}
              sx={{ height: 7, borderRadius: 4, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: 'success.main', borderRadius: 4 } }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Security Badge */}
      <Card elevation={0} sx={{ background: 'linear-gradient(135deg, #263238, #37474F)', border: 'none' }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 50, height: 50, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <VerifiedUserIcon sx={{ color: '#4DB6AC', fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#fff' }}>Certified Security Guard</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              ID: GRD-{user._id?.slice(-6).toUpperCase() || '000000'}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Logout */}
      <Button
        fullWidth
        variant="outlined"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{ py: 1.5, borderRadius: 3, fontWeight: 600, borderColor: '#FFCDD2', bgcolor: '#FFF5F5', '&:hover': { bgcolor: '#FFEBEE' } }}
      >
        Sign Out
      </Button>
    </Stack>
  );
};

export default Profile;
