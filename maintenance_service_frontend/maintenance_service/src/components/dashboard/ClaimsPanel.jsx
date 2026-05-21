import React, { useEffect, useMemo, useState } from 'react';
import { fetchClaimsForCurrentUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import NewClaimCreate from '../NewClaimCreate';

export default function ClaimsPanel({ refreshKey, onCreated, isManager, isService }) {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [filters, setFilters] = useState({
    component_failure: '',
    service_company: '',
    serial_number_machine: '',
    recovery_method: '',
  });
  const [showNewClaim, setShowNewClaim] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchClaimsForCurrentUser();
        setClaims(Array.isArray(data) ? data : []);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    load();
  }, [refreshKey]);

  const getDisplayValue = (m, key) => {
    const v = m?.[key];
    if (v && typeof v === 'object') return v.name ?? v.id ?? '';
    return v ?? '';
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const filteredClaims = useMemo(() => {
    return claims.filter((m) => {
      const cf = String(getDisplayValue(m, 'component_failure')).toLowerCase();
      const sc = String(getDisplayValue(m, 'service_company')).toLowerCase();
      const sn = String(m?.serial_number_machine ?? '').toLowerCase();
      const mr = String(getDisplayValue(m, 'recovery_method')).toLowerCase();

      const f1 = filters.component_failure ? cf.includes(filters.component_failure.toLowerCase()) : true;
      const f2 = filters.service_company ? sc.includes(filters.service_company.toLowerCase()) : true;
      const f3 = filters.serial_number_machine ? sn.includes(filters.serial_number_machine.toLowerCase()) : true;
      const f4 = filters.recovery_method ? mr.includes(filters.recovery_method.toLowerCase()) : true;

      return f1 && f2 && f3 && f4;
    });
  }, [claims, filters]);

  const handleRowClick = (m) => { if (m?.id) navigate(`/claims/${m.id}`); };

  const handleCreated = () => {
    setShowNewClaim(false);
    if (onCreated) onCreated();
  };

  if (loading) return <div>Загрузка...</div>;
  if (notFound) return <div>Не удалось загрузить данные рекламаций.</div>;

  return (
    <div>
      <div className="filters" style={{ display: 'flex', gap: 8, margin: '8px 0 12px 0' }}>
        {isManager || isService ? (
          <button onClick={() => setShowNewClaim((s) => !s)}>
            {showNewClaim ? 'Свернуть' : 'Создать новую Рекламацию'}
          </button>
        ) : null}
      </div>

      {showNewClaim && (
        <NewClaimCreate onCreated={handleCreated} onCancel={() => setShowNewClaim(false)} />
      )}

      <div className="filters" style={{ display: 'flex', gap: 8, margin: '8px 0 12px 0' }}>
        <input placeholder="Узел отказа" name="component_failure" value={filters.component_failure} onChange={handleFilterChange} />
        <input placeholder="Сервисная компания" name="service_company" value={filters.service_company} onChange={handleFilterChange} />
        <input placeholder="SN машины" name="serial_number_machine" value={filters.serial_number_machine} onChange={handleFilterChange} />
        <input placeholder="Способ восстановления" name="recovery_method" value={filters.recovery_method} onChange={handleFilterChange} />
      </div>

      {filteredClaims.length === 0 ? (
        <div>Нет Рекламаций для отображения.</div>
      ) : (
        <table border="1" cellPadding="6" cellSpacing="0">
          <thead>
            <tr>
              <th>Дата отказа</th>
              <th>Модель машины</th>
              <th>Серийный номер машины</th>
              <th>Узел отказа</th>
              <th>Сервисная компания</th>
              <th>Способ восстановления</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.map((m) => (
              <tr key={m.id} onClick={() => handleRowClick(m)} style={{ cursor: 'pointer' }}>
                <td>{m.date_failure}</td>
                <td>{m.model_machine?.name ?? m.model_machine ?? ''}</td>
                <td>{m.serial_number_machine ?? ''}</td>
                <td>{m.component_failure?.name ?? m.component_failure ?? ''}</td>
                <td>{m.service_company?.name ?? m.service_company ?? ''}</td>
                <td>{m.recovery_method?.name ?? m.recovery_method ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}