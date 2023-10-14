import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import ListPage from "./views/ListPage";
import ListsPage from "./views/ListsPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ApiProvider from "./contexts/ApiProvider";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ApiProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ListsPage />} />
              <Route path="/list/:listId" element={<ListPage />} />
              <Route path="/lists" element={<ListsPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ApiProvider>
    </ThemeProvider>
  );
}

export default App;
