import ErrorBoundary from './components/ErrorBoundary';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
// ... other imports

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Navigation />
        <Routes>
          {/* Your routes here */}
        </Routes>
        <Footer />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
