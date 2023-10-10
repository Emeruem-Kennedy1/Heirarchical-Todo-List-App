import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box sx={{ backgroundColor: '#f7f7f7', py: 3, position: 'absolute', bottom: 0, width: '100%' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="textSecondary" align="center">
          © Kendo {currentYear}
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;