import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMachineById } from '../services/api';

export default function MachineDetailPage() {
  const { id } = useParams();
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // verbose_name для полей
  const fieldLabels = {
    id: 'ID',
    date_shipment_from_factory: 'Дата отгрузки',
    model_machine: 'Модель машины',
    model_engine: 'Модель двигателя',
    serial_number_machine: 'Серийный номер машины',
  };

  const renderValue = (v) => {
    if (v == null) return '';
    if (typeof v === 'object') {
      if (v.name) return v.name;
      if (v.id) return String(v.id);
      return JSON.stringify(v);
    }
    return String(v);
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMachineById(id);
        const machineData = Array.isArray(data) ? data[0] ?? null : data;
        if (mounted) setMachine(machineData);
      } catch (e) {
        if (mounted) setError('Не удалось загрузить данные машины.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!machine) return <div>Машина не найдена.</div>;

  return (
    <div className="machine-detail-page" style={{ padding: 16 }}>
      <h3>Характеристики машины</h3>
      <table
        border="1"
        cellPadding="6"
        cellSpacing="0"
        style={{ borderCollapse: 'collapse', width: '100%' }}
      >
        <tbody>
          {Object.entries(machine).map(([key, value]) => {

            const label =
              fieldLabels[key] ??
              key
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase());

            return (
              <tr key={key}>
                <td style={{ fontWeight: 'bold', verticalAlign: 'top', width: 260 }}>
                  {label}
                </td>
                <td>{renderValue(value)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}