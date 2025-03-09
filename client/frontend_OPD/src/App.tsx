import { CardWithForm } from "./components/card";
import { RequestList } from "./components/RequestList";
import { Provider } from "./components/ui/provider"
import { ThemeToggleButton } from "./components/ThemeToggleButton";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
export const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

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
          </Routes>
      </Provider>
    </Router>
  )
}
export default App;
