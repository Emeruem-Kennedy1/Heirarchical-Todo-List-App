import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import theme from "../theme";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography
        sx={{
          fontSize: "4rem",
          fontWeight: "bold",
          marginBottom: theme.spacing(2),
        }}
        color="textPrimary"
      >
        404
      </Typography>
      <Typography
        sx={{
          fontSize: "1.5rem",
          marginBottom: theme.spacing(4),
        }}
        color="textSecondary"
      >
        Oops! Page not found.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGoHome}>
        Go Home
      </Button>
    </Container>
  );
};

export default NotFoundPage;
