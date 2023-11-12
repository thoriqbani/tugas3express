import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import Mahasiswa from '../pages/Mahasiswa';
import Jurusan from '../pages/Jurusan';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';


function Routing() {
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;
    const handleLogout = () => {
        localStorage.removeItem('token');
        console.log('berhasil logout');
        window.location.reload();
    };
    return (
    <div>
        <ul className='navbar-nav'>
            <li className='nav-item'>
                <Link className="nav-link active" to="/mhs">Mahasiswa</Link>
            </li>
            <li className='nav-item'>
                <Link className="nav-link" to="/jrsn">Jurusan</Link>
            </li>
            {isLoggedIn ? (
            <li className='nav-item'>
                <Link className="nav-link" onClick={handleLogout}>Logout</Link>
            </li>
            ) : (
            <li className='nav-item'>
                <Link className="nav-link" to="/login">Login</Link>
            </li>
            )}
        </ul>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mhs" element={<Mahasiswa />} />
            <Route path="/jrsn" element={<Jurusan />} />
        </Routes>
    </div>
    );
}

export default Routing;