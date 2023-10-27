import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import ListPage from "./views/ListPage";
import ListsPage from "./views/ListsPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ApiProvider from "./contexts/ApiProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFoundPage from "./views/NotFoundPage";
import LoginPage from "./views/LoginPage";
import SignupPage from "./views/SignUp";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <ApiProvider>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<ListsPage />} />
              <Route path="/list/:listId" element={<ListPage />} />
              <Route path="/lists" element={<ListsPage />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
            </Routes>
            <Footer />
          </div>
        </ApiProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
