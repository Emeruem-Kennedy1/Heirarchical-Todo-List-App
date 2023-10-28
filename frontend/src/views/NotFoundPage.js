import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import theme from "../theme";

/**
 * Renders a page with a 404 error message and a button to navigate back to the home page.
 * @returns {JSX.Element} The JSX code to render the 404 page.
 */
const NotFoundPage = () => {
  const navigate = useNavigate();

  /**
   * Navigates to the home page when the "Go Home" button is clicked.
   */
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container
      sx={{
        height: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography
        sx={{
          fontSize: "6rem",
          fontWeight: "bold",
          marginBottom: theme.spacing(2),
        }}
        color="textPrimary"
      >
        404
      </Typography>
      <Typography
        sx={{
          fontSize: "2rem",
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
