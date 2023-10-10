import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import ListPage from "./views/ListPage";
import ListsPage from "./views/ListsPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ListsPage />} />
            <Route path="/list/:listId" element={<ListPage />} />
            <Route path="/lists" element={<ListsPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
