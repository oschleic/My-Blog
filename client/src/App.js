import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Siwe  from './components/Siwe/Siwe.js';
import Admin from './components/Admin/Admin.js';
import AuthProvider, { useAuth } from './utils/auth';


function App() {

  function RequireAuth({ children }) {
    const auth = useAuth(); 
    return auth.isAuthenticated ? children : <Navigate to="/login" />;
  }

  return (
    <AuthProvider>
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<p>Home</p>} />
            <Route 
              path="/admin"
              element={
                <RequireAuth>
                  <Admin />
                </RequireAuth>
            }
            />
            <Route path="/login" element={<Siwe />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
    </AuthProvider>
  );
}

export default App;
