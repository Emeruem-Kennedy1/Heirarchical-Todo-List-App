import { createTheme } from '@mui/material/styles';

/**
 * Creates a theme object with primary and secondary color palettes.
 *
 * @returns {Object} The theme object with primary and secondary color palettes.
 */
const theme = createTheme({
  palette: {
        primary: {
        // black: '#000000',
      main: '#000000', 
    },
        secondary: {
        // light gray: '#f7f7f7',
      main: '#f7f7f7',
    },
  },
});

export default theme;