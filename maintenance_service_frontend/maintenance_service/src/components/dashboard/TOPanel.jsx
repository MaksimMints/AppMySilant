import React, { useEffect, useMemo, useState } from 'react';
import { fetchTmForCurrentUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import NewTmCreate from '../NewTmCreate';

export default function TOPanel({ refreshKey, onCreated, isManager, isService }) {
  const navigate = useNavigate();
  const [tm, setTm] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [filters, setFilters] = useState({
    type_of_tm: '',
    service_company: '',
    serial_number_machine: '',
  });
  const [showNewTM, setShowNewTM] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTmForCurrentUser();
        setTm(Array.isArray(data) ? data : []);
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

  const filteredTm = useMemo(() => {
    return tm.filter((m) => {
      const t = String(getDisplayValue(m, 'type_of_tm')).toLowerCase();
      const sc = String(getDisplayValue(m, 'service_company')).toLowerCase();
      const sn = String(m?.serial_number_machine ?? '').toLowerCase();

      const f1 = filters.type_of_tm ? t.includes(filters.type_of_tm.toLowerCase()) : true;
      const f2 = filters.service_company ? sc.includes(filters.service_company.toLowerCase()) : true;
      const f3 = filters.serial_number_machine ? sn.includes(filters.serial_number_machine.toLowerCase()) : true;

      return f1 && f2 && f3;
    });
  }, [tm, filters]);

  const handleRowClick = (m) => { if (m?.id) navigate(`/tm/${m.id}`); };

  const handleCreated = () => {
    setShowNewTM(false);
    if (onCreated) onCreated();
  };

  if (loading) return <div>Загрузка...</div>;
  if (notFound) return <div>Не удалось загрузить данные ТО.</div>;

  return (
    <div>
      <div className="filters" style={{ display: 'flex', gap: 8, margin: '8px 0 12px 0' }}>
        {isManager || isService ? (
          <button onClick={() => setShowNewTM((s) => !s)}>
            {showNewTM ? 'Свернуть' : 'Создать новое ТО'}
          </button>
        ) : null}
      </div>

      {showNewTM && (
        <NewTmCreate onCreated={handleCreated} onCancel={() => setShowNewTM(false)} />
      )}

      <div className="filters" style={{ display: 'flex', gap: 8, margin: '8px 0 12px 0' }}>
        <input placeholder="Вид ТО" name="type_of_tm" value={filters.type_of_tm} onChange={handleFilterChange} />
        <input placeholder="Сервисная компания" name="service_company" value={filters.service_company} onChange={handleFilterChange} />
        <input placeholder="SN машины" name="serial_number_machine" value={filters.serial_number_machine} onChange={handleFilterChange} />
      </div>

      {filteredTm.length === 0 ? (
        <div>Нет ТО для отображения.</div>
      ) : (
        <table border="1" cellPadding="6" cellSpacing="0">
          <thead>
            <tr>
              <th>Дата проведения ТО</th>
              <th>Модель машины</th>
              <th>Серийный номер машины</th>
              <th>Вид ТО</th>
              <th>Сервисная компания</th>
              <th>Компания проводившая ТО</th>
            </tr>
          </thead>
          <tbody>
            {filteredTm.map((m) => (
              <tr key={m.id} onClick={() => handleRowClick(m)} style={{ cursor: 'pointer' }}>
                <td>{m.date_tm}</td>
                <td>{m.model_machine?.name ?? m.model_machine ?? ''}</td>
                <td>{m.serial_number_machine ?? ''}</td>
                <td>{m.type_of_tm?.name ?? m.type_of_tm ?? ''}</td>
                <td>{m.service_company?.name ?? m.service_company ?? ''}</td>
                <td>{m.tm_company?.name ?? m.tm_company ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}