import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box, Alert } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";

/**
 * Renders the login page component.
 * @returns {JSX.Element} The login page component.
 */
function LoginPage() {
  const navigate = useNavigate();
  const api = useApi();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Validates an email address using a regular expression.
   * @param {string} email - The email address to validate.
   * @returns {boolean} Whether the email address is valid.
   */
  const validateEmail = (email) => {
    // Simple regex for basic email validation
    return /\S+@\S+\.\S+/.test(email);
  };

  /**
   * Checks if the login form is valid.
   * @returns {boolean} Whether the login form is valid.
   */
  const isFormValid = () => {
    return email.length > 0 && password.length > 0 && validateEmail(email);
  };

  /**
   * Handles the form submission event.
   * @param {Event} event - The form submission event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Reset error message at the start

    if (!validateEmail(email)) {
      setErrorMessage("Invalid email format.");
      return;
    }
    if (password.length === 0) {
      setErrorMessage("Password is required.");
      return;
    }

    try {
      const response = await api.post("/login", { email, password });

      if (response.status === 200) {
        const username = response.body.user.username;
        localStorage.setItem("username", username);
        localStorage.setItem("isLoggedIn", true);
        navigate("/");
      } else {
        setErrorMessage(response.body.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Login failed. Please try again.");
    }
  };

  return (
    <Container
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h3">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={!isFormValid()}
          >
            Sign In
          </Button>
        </Box>
        <Typography>
          Don't have an account? &nbsp;
          <Link to="/signup" style={{ textDecoration: "none", color: "blue" }}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default LoginPage;
