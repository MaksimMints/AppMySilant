import React, { useEffect, useMemo, useState } from 'react';
import { fetchMachinesForCurrentUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import NewMachineCreate from '../NewMachineCreate';

export default function InfoPanel({ refreshKey, onCreated, isManager, isService }) {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [filters, setFilters] = useState({
    model_machine: '',
    model_engine: '',
    model_transmission: '',
    model_controlled_bridge: '',
    model_driving_bridge: '',
    serial_number_machine: '',
  });
  const [showNewMachine, setShowNewMachine] = useState(false);

  // Загрузка машин
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMachinesForCurrentUser();
        setMachines(Array.isArray(data) ? data : []);
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

  const filteredMachines = useMemo(() => {
    return machines.filter((m) => {
      const mm = String(getDisplayValue(m, 'model_machine')).toLowerCase();
      const me = String(getDisplayValue(m, 'model_engine')).toLowerCase();
      const tr = String(getDisplayValue(m, 'model_transmission')).toLowerCase();
      const cb = String(getDisplayValue(m, 'model_controlled_bridge')).toLowerCase();
      const db = String(getDisplayValue(m, 'model_driving_bridge')).toLowerCase();
      const sn = String(m?.serial_number_machine ?? '').toLowerCase();

      const f1 = filters.model_machine ? mm.includes(filters.model_machine.toLowerCase()) : true;
      const f2 = filters.model_engine ? me.includes(filters.model_engine.toLowerCase()) : true;
      const f3 = filters.model_transmission ? tr.includes(filters.model_transmission.toLowerCase()) : true;
      const f4 = filters.model_controlled_bridge ? cb.includes(filters.model_controlled_bridge.toLowerCase()) : true;
      const f5 = filters.model_driving_bridge ? db.includes(filters.model_driving_bridge.toLowerCase()) : true;
      const f6 = filters.serial_number_machine ? sn.includes(filters.serial_number_machine.toLowerCase()) : true;

      return f1 && f2 && f3 && f4 && f5 && f6;
    });
  }, [machines, filters]);

  const handleRowClick = (m) => {
    if (!m?.id) return;
    navigate(`/machines/${m.id}`);
  };

  const handleCreated = () => {
    setShowNewMachine(false);
    if (onCreated) onCreated();
  };

  if (loading) return <div>Загрузка...</div>;
  if (notFound) return <div>Не удалось загрузить данные машин.</div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, margin: '8px 0 12px 0' }}>
        {isManager && (
          <button onClick={() => setShowNewMachine((s) => !s)}>
            {showNewMachine ? 'Свернуть' : 'Создать новую машину'}
          </button>
        )}
      </div>

      {showNewMachine && (
        <NewMachineCreate onCreated={handleCreated} onCancel={() => setShowNewMachine(false)} />
      )}

      <div className="filters" style={{ display: 'flex', gap: 8, margin: '8px 0 12px 0' }}>
        <input placeholder="Машина" name="model_machine" value={filters.model_machine} onChange={handleFilterChange} />
        <input placeholder="Двигатель" name="model_engine" value={filters.model_engine} onChange={handleFilterChange} />
        <input placeholder="Трансмиссия" name="model_transmission" value={filters.model_transmission} onChange={handleFilterChange} />
        <input placeholder="Упр.мост" name="model_controlled_bridge" value={filters.model_controlled_bridge} onChange={handleFilterChange} />
        <input placeholder="Вед.мост" name="model_driving_bridge" value={filters.model_driving_bridge} onChange={handleFilterChange} />
        <input placeholder="SN машины" name="serial_number_machine" value={filters.serial_number_machine} onChange={handleFilterChange} />
      </div>

      {filteredMachines.length === 0 ? (
        <div>Нет машин для отображения.</div>
      ) : (
        <table border="1" cellPadding="6" cellSpacing="0">
          <thead>
            <tr>
              <th>Дата отгрузки</th>
              <th>Модель машины</th>
              <th>Серийный номер машины</th>
              <th>Модель двигателя</th>
              <th>Модель трансмиссии</th>
              <th>Модель упр.моста</th>
              <th>Модель ведущего моста</th>
            </tr>
          </thead>
          <tbody>
            {filteredMachines.map((m) => (
              <tr key={m.id} onClick={() => handleRowClick(m)} style={{ cursor: 'pointer' }}>
                <td>{m.date_shipment_from_factory}</td>
                <td>{m.model_machine?.name ?? m.model_machine ?? ''}</td>
                <td>{m.serial_number_machine ?? ''}</td>
                <td>{m.model_engine?.name ?? m.model_engine ?? ''}</td>
                <td>{m.model_transmission?.name ?? m.model_transmission ?? ''}</td>
                <td>{m.model_controlled_bridge?.name ?? m.model_controlled_bridge ?? ''}</td>
                <td>{m.model_driving_bridge?.name ?? m.model_driving_bridge ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}