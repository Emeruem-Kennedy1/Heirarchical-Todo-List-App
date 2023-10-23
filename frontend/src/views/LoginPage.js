import React, { useState, useEffect } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";

function LoginPage() {
  const navigate = useNavigate();
  const api = useApi();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // check if a user is already logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  useEffect(() => {
    if (isLoggedIn === "true") {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/login", {
        email: email,
        password: password,
      });

      console.log(response);

      if (response.status === 200) {
        const username = response.body.user.username; // Note: changed from response.body to response.data
        // Store the username in local storage (This is not secure)
        localStorage.setItem("username", username);
        localStorage.setItem("isLoggedIn", true);
        navigate("/");
      } else {
        alert("Login failed");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed");
      navigate("/login");
    }
  };

  return (
    <Container
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "82vh",
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
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
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
            onClick={handleSubmit}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
