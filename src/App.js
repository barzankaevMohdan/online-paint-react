import './styles/app.scss'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CanvasPage from './pages/CanvasPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:id" element={<CanvasPage/>} />
        <Route path="*" element={<Navigate replace to={`f${(+new Date).toString(16)}`} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
