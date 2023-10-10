import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          {/* Left Side - Main Title */}
          <Grid item>
            <Typography variant="h6" component="div">
              Main Title
            </Typography>
          </Grid>

          {/* Right Side - Avatar Icon, Name, and Logout Button */}
          <Grid item>
            <Box display="flex" alignItems="center">
              <AccountCircle fontSize="large" />
              {!isMobile && (
                <Typography variant="body1" sx={{ marginLeft: 1 }}>
                  User Name
                </Typography>
              )}
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                sx={{ marginLeft: 2 }}
              >
                Logout
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
