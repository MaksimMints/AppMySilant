import React, { useEffect, useState } from 'react';
import { createTm } from '../services/api';

export default function NewTmCreate({ onCreated, onCancel }) {
  const [operatingTime, setOperatingTime] = useState('');
  const [numberOrder, setNumberOrder] = useState('');
  const [dateTm, setDateTm] = useState('');
  const [dateOrderOutfit, setDateOrderOutfit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Данные для выпадашек
  const [machines, setMachines] = useState([]);
  const [serviceCompanies, setServiceCompanies] = useState([]);
  const [typesOfTm, setTypesOfTm] = useState([]);
  const [companiesTm, setCompaniesTm] = useState([]);

  // Выбранные значения
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [selectedServiceCompanyId, setSelectedServiceCompanyId] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [selectedCompanyTmId, setSelectedCompanyTmId] = useState('');
  
  // Автоматически загруженная модель машины
  const [autoModelMachine, setAutoModelMachine] = useState('');

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        // Загрузка машин
        const machinesRes = await fetch('/api/machines/', {
          credentials: 'include',
        });
        if (machinesRes.ok) {
          const data = await machinesRes.json();
          setMachines(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error loading machines:', err);
      }

      try {
        // Загрузка сервисных компаний (пользователи с группой ServiceCompany)
        const serviceRes = await fetch('/api/service_companies_dropdown/', {
          credentials: 'include',
        });
        if (serviceRes.ok) {
          setServiceCompanies(await serviceRes.json());
        }
      } catch (err) {
        console.error('Error loading service companies:', err);
      }

      try {
        // Загрузка видов ТО
        const typesRes = await fetch('/api/types_of_tm/', {
          credentials: 'include',
        });
        if (typesRes.ok) {
          setTypesOfTm(await typesRes.json());
        }
      } catch (err) {
        console.error('Error loading types:', err);
      }

      try {
        // Загрузка компаний ТО
        const companiesRes = await fetch('/api/companies_tm/', {
          credentials: 'include',
        });
        if (companiesRes.ok) {
          setCompaniesTm(await companiesRes.json());
        }
      } catch (err) {
        console.error('Error loading companies:', err);
      }
    };

    loadDropdownData();
  }, []);

  // Автоматическая загрузка модели машины при выборе serial_number_machine
  useEffect(() => {
    const fetchModelMachine = async () => {
      if (!selectedMachineId) {
        setAutoModelMachine('');
        return;
      }

      try {
        const res = await fetch(`/api/machines/${selectedMachineId}/`, {
          credentials: 'include',
        });
        
        if (res.ok) {
          const machineData = await res.json();

          const modelName = machineData.model_machine || 
                           machineData.model_machine_display ||
                           machineData.model_machine_name ||
                           'Не указана';
          setAutoModelMachine(modelName);
        }
      } catch (err) {
        console.error('Error loading model machine:', err);
        setAutoModelMachine('Ошибка загрузки');
      }
    };

    fetchModelMachine();
  }, [selectedMachineId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const payload = {
      serial_number_machine: selectedMachineId || null,
      type_of_tm: selectedTypeId || null,
      date_tm: dateTm,
      operating_time: parseInt(operatingTime) || 0,
      number_orderoutfit: numberOrder,
      date_orderoutfit: dateOrderOutfit,
      tm_company: selectedCompanyTmId || null,
      service_company: selectedServiceCompanyId || null,
    };
    
    try {
      const res = await createTm(payload);
      setLoading(false);
      onCreated?.(res);
    } catch (err) {
      setLoading(false);
      setError(err?.message || 'Ошибка при создании');
    }
  };

  return (
    <div className="new-tm-create" style={{ border: '1px solid #ccc', padding: 16, borderRadius: 6, margin: '12px 0' }}>
      <h3>Создать новое ТО</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        
        {/* Зав. номер машины */}
        <select 
          value={selectedMachineId} 
          onChange={(e) => setSelectedMachineId(e.target.value)} 
          required
        >
          <option value="">Выберите машину</option>
          {machines.map((m) => (
            <option key={m.id} value={m.id}>
              {m.serial_number_machine}
            </option>
          ))}
        </select>

    
        <div style={{ 
          padding: '8px 12px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '4px',
          color: autoModelMachine ? '#333' : '#999',
          border: '1px solid #ddd'
        }}>
          <strong>Модель машины:</strong> {autoModelMachine || 'Выберите машину'}
        </div>

        {/* Вид ТО */}
        <select 
          value={selectedTypeId} 
          onChange={(e) => setSelectedTypeId(e.target.value)} 
          required
        >
          <option value="">Выберите вид ТО</option>
          {typesOfTm.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Дата проведения ТО:</label>
          <input 
            type="date"
            value={dateTm} 
            onChange={(e) => setDateTm(e.target.value)} 
            required 
          />
        </div>
        
        <input 
          type="number"
          placeholder="Наработка (м.ч.)" 
          value={operatingTime} 
          onChange={(e) => setOperatingTime(e.target.value)} 
          required 
        />
        
        <input 
          placeholder="Номер заказ-наряда" 
          value={numberOrder} 
          onChange={(e) => setNumberOrder(e.target.value)} 
          required 
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Дата заказ-наряда:</label>
          <input 
            type="date"
            value={dateOrderOutfit} 
            onChange={(e) => setDateOrderOutfit(e.target.value)} 
            required 
          />
        </div>

        {/* Компания, проводившая ТО */}
        <select 
          value={selectedCompanyTmId} 
          onChange={(e) => setSelectedCompanyTmId(e.target.value)} 
          required
        >
          <option value="">Выберите компанию ТО</option>
          {companiesTm.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>


        <select 
          value={selectedServiceCompanyId} 
          onChange={(e) => setSelectedServiceCompanyId(e.target.value)} 
          required
        >
          <option value="">Выберите сервисную компанию</option>
          {serviceCompanies.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Создание...' : 'Создать'}
          </button>
          <button type="button" onClick={onCancel} disabled={loading}>
            Отмена
          </button>
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    </div>
  );
}