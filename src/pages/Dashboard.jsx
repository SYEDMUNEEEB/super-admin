import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  People as PeopleIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: { xs: 2, sm: 3 },
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderRadius: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      textAlign: 'center',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: { xs: 1, sm: 2 } }}>
      <Box
        sx={{
          backgroundColor: `${color}15`,
          borderRadius: 2,
          p: { xs: 0.75, sm: 1 },
          mr: { xs: 1, sm: 2 },
        }}
      >
        {icon}
      </Box>
      <Typography 
        variant="h6" 
        color="text.secondary"
        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
      >
        {title}
      </Typography>
    </Box>
    <Typography 
      variant="h4" 
      component="div" 
      sx={{ 
        fontWeight: 600,
        fontSize: { xs: '1.5rem', sm: '2rem' }
      }}
    >
      {value}
    </Typography>
  </Paper>
);

function Dashboard() {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: { xs: 3, sm: 4 }, 
          fontWeight: 600,
          fontSize: { xs: '1.5rem', sm: '2rem' }
        }}
      >
        Dashboard
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Users"
            value="1,234"
            icon={<PeopleIcon sx={{ color: '#1976d2', fontSize: { xs: '1.5rem', sm: '2rem' } }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Roles"
            value="12"
            icon={<SecurityIcon sx={{ color: '#2e7d32', fontSize: { xs: '1.5rem', sm: '2rem' } }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Businesses"
            value="89"
            icon={<BusinessIcon sx={{ color: '#ed6c02', fontSize: { xs: '1.5rem', sm: '2rem' } }} />}
            color="#ed6c02"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
