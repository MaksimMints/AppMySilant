import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';


export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, logout } = useAuth();

  if (loading) return null;

  return (
    <header className="header">
      {/* Верхний блок: логотип | телефон | Авторизация */}
      <div div className="header-top">
        <div className="header-item logo-wrap">
          <img src="/static/images/logotypeRGB1.jpg" alt="Логотип" className="logo" />
        </div>
        <div className="header-item phone">
          Телефон: +7 (8325) 20-12-09
        </div>
        
        < div className="header-item auth-btn">
            {isAuthenticated ? (
                <button
                className="btn"
                type="button"
                onClick={async () => {
                    try {
                    await logout();
                    navigate('/', { replace: true }); // возвращаемся на WelcomePage
                    } catch (err) {
                    console.error('Ошибка выхода', err);
                    }
                }}
                >
                Выход
                </button>
            ) : (
                <button
                className="btn"
                type="button"
                onClick={() => navigate('/login')}
                >
                Авторизация
                </button>
      )}
            
        </div>
      </div >
      <h2 style={{textAlign: 'center'}}>Электронная сервисная книжка "Мой Силант"</h2>

    </header>
  );
}