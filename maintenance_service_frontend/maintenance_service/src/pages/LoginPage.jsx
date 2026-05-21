import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContext';
import '../styles/index.css';
import Footer from '../components/Footer';

export default function LoginPage() { 
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [error, setError] = useState(null); 
    const navigate = useNavigate(); 
    const { login } = useAuth();
    const handleSubmit = async (e) => { 
        e.preventDefault();
        try { 
            const ok = await login(username, password); 
            if (ok) { navigate('/dashboard', { replace: true }); } 
                else { setError('Неправильные учетные данные'); } 
            } catch (err) { setError('Ошибка авторизации'); } 
        };

    return ( 
        <div className="login-page"> 
            <h3>Авторизация</h3> 
                <form onSubmit={handleSubmit}>
            <div className="password-block"> 
                <div> 
                    <label style={{paddingRight: '5px'}}>Логин</label> 
                    <input value={username} onChange={(e) => 
                        setUsername(e.target.value)} placeholder="Введите логин" /> 
                </div> 
                <div> 
                    <label style={{marginRight: '1px'}}>Пароль</label> <input type="password" value={password} onChange={(e) => 
                        setPassword(e.target.value)} placeholder="Введите пароль" /> 
                </div>
            </div>     
            {error && <div className="error" style={{color: 'red'}}>{error}</div>} 
            <button type="submit" style={{marginBottom: '30px'}}>Войти</button> 
            </form>
            <Footer />
        </div> 
        );
       
    }