import './App.css';
import { Link, BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Siwe  from './components/Siwe/Siwe.js';
import Admin from './components/Admin/Admin.js';


function App() {

  async function isAuthenticated(){
    const res = await fetch('/auth', {
      credentials: 'include',
    });
    console.log(res);
    return res.status === 200;
  }


  

  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<p>Home</p>} />
            <Route 
              path="/admin"
              element={
                isAuthenticated().then(res => {
                  console.log(res);
                  return (res ? 
                    (<Admin />)
                    :
                    (<Navigate to="/login"/>)
                  );
                })
              }
            />
            <Route path="/login" element={<Siwe />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
