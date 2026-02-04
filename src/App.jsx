
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormFlow from './pages/FormFlow';
import Admin from './pages/Admin';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormFlow />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
