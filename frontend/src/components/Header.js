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
import { useNavigate } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const api = useApi();

  const gotoHome = () => {
    navigate("/");
  };

  // get username from local storage
  const username = localStorage.getItem("username");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const handleLogout = () => {
    api
      .post("/logout")
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem("username");
          localStorage.removeItem("isLoggedIn");
          // clear cookies on logout
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Box>
            <Button onClick={gotoHome} color="inherit" disableRipple>
              <Typography
                variant="h5"
                component="div"
                fontFamily="Public Sans"
                fontWeight={900}
              >
                Two-Do
              </Typography>
            </Button>
          </Box>

          <Grid item>
            <Box display="flex" alignItems="center">
              <AccountCircle fontSize="large" />
              {!isMobile && (
                <Typography variant="body1" sx={{ marginLeft: 1 }}>
                  {username ? username : "Guest"}
                </Typography>
              )}
              {isLoggedIn === "true" && (
                <Button
                  color="inherit"
                  startIcon={<LogoutIcon />}
                  sx={{ marginLeft: 2 }}
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Logout
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
