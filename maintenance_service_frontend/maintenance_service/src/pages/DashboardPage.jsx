import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import InfoPanel from '../components/dashboard/InfoPanel';
import TOPanel from '../components/dashboard/TOPanel';
import ClaimsPanel from '../components/dashboard/ClaimsPanel';
import Footer from '../components/Footer';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Роли
  const isManager = useMemo(() => {
    if (!user) return false;
    const groups = user.groups ?? [];
    if (Array.isArray(groups) && groups.length) {
      if (typeof groups[0] === 'string') {
        return groups.includes('Manager');
      }
      if (typeof groups[0] === 'object') {
        return groups.some((g) => (g.name ?? '') === 'Manager');
      }
    }
    if (typeof user.group === 'string') return user.group === 'Manager';
    if (typeof user.role === 'string') return user.role === 'Manager';
    if (typeof user.is_manager === 'boolean') return user.is_manager;
    return false;
  }, [user]);

  const isService = useMemo(() => {
    if (!user) return false;
    const groups = user.groups ?? [];
    if (Array.isArray(groups) && groups.length) {
      if (typeof groups[0] === 'string') {
        return groups.includes('ServiceCompany');
      }
      if (typeof groups[0] === 'object') {
        return groups.some((g) => (g.name ?? '') === 'ServiceCompany');
      }
    }
    if (typeof user.group === 'string') return user.group === 'ServiceCompany';
    if (typeof user.role === 'string') return user.role === 'ServiceCompany';
    if (typeof user.is_service_company === 'boolean') return user.is_service_company;
    return false;
  }, [user]);

  const [activeTab, setActiveTab] = useState('info');
  
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="dashboard-page" style={{ padding: 16 }}>
      <div className="page-header" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <h2>Основная панель</h2>
      </div>

      <div className="user-name" style={{ marginTop: 8, marginBottom: 16 }}>
        Вы вошли как: {user?.username ?? 'Пользователь'}
      </div>

      <div className="dashboard-tabs">
        <button onClick={() => setActiveTab('info')} className={`btn ${activeTab === 'info' ? 'active' : ''}`}>
          Общая информация
        </button>
        <button onClick={() => setActiveTab('TO')} className={`btn ${activeTab === 'TO' ? 'active' : ''}`}>
          ТО
        </button>
        <button onClick={() => setActiveTab('claims')} className={`btn ${activeTab === 'claims' ? 'active' : ''}`}>
          Рекламации
        </button>
      </div>

      {!['info','TO','claims'].includes(activeTab) && <div>Неправильная вкладка</div>}

      {activeTab === 'info' && (
        <InfoPanel
          refreshKey={refreshKey}
          onCreated={handleRefresh}
          isManager={isManager}
          isService={isService}
        />
      )}
      {activeTab === 'TO' && (
        <TOPanel
          refreshKey={refreshKey}
          onCreated={handleRefresh}
          isManager={isManager}
          isService={isService}
        />
      )}
      {activeTab === 'claims' && (
        <ClaimsPanel
          refreshKey={refreshKey}
          onCreated={handleRefresh}
          isManager={isManager}
          isService={isService}
        />
      )}
      <Footer />
    </div>
  );
}