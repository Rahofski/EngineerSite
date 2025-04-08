import { CardWithForm } from "./components/card";
import { RequestList } from "./components/RequestList";
import { AdminPage } from "./components/AdminPage";

import { Provider } from "./components/ui/provider"
import { ThemeToggleButton } from "./components/ThemeToggleButton";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
export const BASE_URL = import.meta.env.MODE === "development" ? "http://25.24.120.207:8080/api" : "/api";

function App() {
  return (
    <Router>
      <Provider>
      <ThemeToggleButton />
          <Routes>
            {/* Главная страница */}
            <Route path="/" element={
              <>
                  <CardWithForm />
              </>
            } />
            {/* Страница заявки */} 
            <Route path="/request" element={<RequestList />} />
            <Route path="/AdminPage" element={<AdminPage/>}></Route>
          </Routes>
      </Provider>
    </Router>
  )
}
export default App;
