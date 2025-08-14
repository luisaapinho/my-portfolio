import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectPage from './pages/ProjectPage'; // o ficheiro chama-se "ProjectPage.js"
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
