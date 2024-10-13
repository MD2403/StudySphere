import React from 'react';
import { Grid, Paper, Typography, List, ListItem, ListItemText, ListItemIcon, Avatar, Button, Box, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

// Statistics Section Data
const stats = [
  {
    title: 'Study Hours This Week',
    value: 12,
    icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#2196f3' }} />,
    color: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
  },
  {
    title: 'Active Study Groups',
    value: 3,
    icon: <GroupIcon sx={{ fontSize: 40, color: '#f50057' }} />,
    color: 'linear-gradient(135deg, #fce4ec, #f8bbd0)',
  },
  {
    title: 'Upcoming Sessions',
    value: 2,
    icon: <ScheduleIcon sx={{ fontSize: 40, color: '#4caf50' }} />,
    color: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
  },
  {
    title: 'Resources Accessed',
    value: 8,
    icon: <LibraryBooksIcon sx={{ fontSize: 40, color: '#ff9800' }} />,
    color: 'linear-gradient(135deg, #fff8e1, #ffecb3)',
  },
];

function Home() {
  return (
    <Box 
      sx={{
        p: 3,
        margin: '0 auto', // Centers the content
        maxWidth: '1300px', // Limits the max width
        backgroundColor: '#f5f5f5', 
        minHeight: '100vh'
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Welcome Back, [Your Name]!
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ color: '#666' }}>
        Here's a quick overview of your activities this week.
      </Typography>

      {/* Statistics Section */}
      <Grid container spacing={3} mt={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }} // Add hover effect
            >
              <Paper
                elevation={4}
                sx={{
                  padding: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '12px',
                  background: stat.color,
                  color: '#333',
                }}
              >
                {stat.icon}
                <Box ml={2}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{stat.value}</Typography>
                  <Typography variant="subtitle2">{stat.title}</Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Divider to separate sections */}
      <Divider sx={{ my: 5 }} />

      {/* Dashboard Sections */}
      <motion.div
        className="flex-1 p-6 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={3} mt={5}>
          {/* Study Buddy Matches */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <Paper elevation={4} sx={{ padding: 3, borderRadius: '12px' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Study Buddy Matches</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Avatar src="https://via.placeholder.com/40" alt="Buddy" />
                    </ListItemIcon>
                    <ListItemText primary="John Doe" secondary="Mathematics" />
                    <Button variant="contained" color="success" sx={{ borderRadius: '20px' }}>Connect</Button>
                  </ListItem>
                </List>
              </Paper>
            </motion.div>
          </Grid>

          {/* Study Sessions */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <Paper elevation={4} sx={{ padding: 3, borderRadius: '12px' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Upcoming Study Sessions</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Algorithms" secondary="Aug 25, 2024 - 10:00 AM" />
                    <Button variant="contained" color="primary" sx={{ borderRadius: '20px' }}>Join</Button>
                  </ListItem>
                </List>
              </Paper>
            </motion.div>
          </Grid>

          {/* Resource Library */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              whileHover={{ scale: 1.05 }}
            >
              <Paper elevation={4} sx={{ padding: 3, borderRadius: '12px' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Resource Library</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Data Structures Notes" />
                    <Button variant="contained" color="secondary" sx={{ borderRadius: '20px' }}>View</Button>
                  </ListItem>
                </List>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={5}>
          {/* Progress Tracking */}
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ padding: 3, borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Progress Tracking</Typography>
              <Typography variant="body2">Study Goal: 20 hours/week</Typography>
              <div className="w-full bg-gray-300 rounded-full h-2.5 mt-1">
                <motion.div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: "70%" }}
                  initial={{ width: "0%" }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </Paper>
          </Grid>

          {/* Message Center */}
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ padding: 3, borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Message Center</Typography>
              <Typography variant="body2">No new messages.</Typography>
            </Paper>
          </Grid>

          {/* Announcements */}
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ padding: 3, borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Announcements</Typography>
              <Typography variant="body2">New feature update coming soon!</Typography>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}

export default Home;
