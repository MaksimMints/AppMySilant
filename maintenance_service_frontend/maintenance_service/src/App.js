import React from 'react'; 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import WelcomePage  from './pages/WelcomePage'; 
import DashboardPage from './pages/DashboardPage';
import MachineDetailPage from './pages/MachineDetailPage'; 
import { AuthProvider } from './contexts/AuthContext'; 
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import { RequireAuth } from './components/RequireAuth';
import TmDetail from './pages/TmDetail';
import NewClaimCreate from './components/NewClaimCreate';
import ClaimDetail from './pages/ClaimDetail';


export default function App() { 
  return ( 
    <AuthProvider> 
      <BrowserRouter> 
        <Header /> 
        <Routes>
          <Route path="/" element={<WelcomePage />} /> 
          <Route path="/login" element={<LoginPage />} /> 
          <Route 
            path="/dashboard" 
            element={ 
              <RequireAuth> 
                <DashboardPage /> 
              </RequireAuth> 
            } 
            />
          <Route path="/machines/:id" element={<MachineDetailPage />} />
          <Route path="/tm/:id" element={<TmDetail />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/claims/new" element={<NewClaimCreate />} />
          <Route path="/claims/:id" element={<ClaimDetail />} /> 
        </Routes> 
      </BrowserRouter> 
    </AuthProvider> 
    ); 
  }