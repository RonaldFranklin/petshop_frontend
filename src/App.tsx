import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './pages/login-page/login';
import Register from './pages/register-page/register';
import Home from './pages/home-page/home';
import NotFoundPage from './pages/notfound-page/notfound';
import Services from './pages/service-page/service';
import Pets from './pages/pets-page/pets';
import Schedullings from './pages/schedulling-page/schedulling';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/schedullings" element={<Schedullings />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
