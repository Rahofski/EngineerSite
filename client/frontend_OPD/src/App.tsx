import { CardWithForm } from "./components/card";
import { RequestPage } from "./components/RequestItem";
import { Provider } from "./components/ui/provider"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Provider>
      <Routes>
            {/* Главная страница */}
            <Route path="/" element={
              <>
                  <CardWithForm />
              </>
            } />
            {/* Страница заявки */}
            <Route path="/request" element={<RequestPage />} />
          </Routes>
        </Provider>
    </Router>
  )
}
export default App;
