// Import assets
import logo from '../assets/images/logo.svg';
import '../assets/styles/app.css';

// Import components
import ClassSelector from './ClassSelector';

// Export App component
export default function App() {
  return (
    <div className="app">
      <ClassSelector />
    </div>
  )
}
