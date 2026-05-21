import React, { useEffect, useState } from 'react';
import { createClaim } from '../services/api';
import { useNavigate } from 'react-router-dom';


export default function NewClaimCreate() {
  const navigate = useNavigate();
  const [dateFailure, setDateFailure] = useState('');
  const [claimOperatingTime, setClaimOperatingTime] = useState('');
  const [descriptionFailure, setDescriptionFailure] = useState('');
  const [spareParts, setSpareParts] = useState('');
  const [dateRecovery, setDateRecovery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Данные для выпадашек
  const [machines, setMachines] = useState([]);
  const [components, setComponents] = useState([]);
  const [recoveryMethods, setRecoveryMethods] = useState([]);
  const [serviceCompanies, setServiceCompanies] = useState([]);

  // Выбранные значения
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [selectedComponentId, setSelectedComponentId] = useState('');
  const [selectedRecoveryMethodId, setSelectedRecoveryMethodId] = useState('');
  const [selectedServiceCompanyId, setSelectedServiceCompanyId] = useState('');
  
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
        // Загрузка узлов отказа
        const componentsRes = await fetch('/api/components/', {
          credentials: 'include',
        });
        if (componentsRes.ok) {
          setComponents(await componentsRes.json());
        }
      } catch (err) {
        console.error('Error loading components:', err);
      }

      try {
        // Загрузка способов восстановления
        const methodsRes = await fetch('/api/recovery_methods/', {
          credentials: 'include',
        });
        if (methodsRes.ok) {
          setRecoveryMethods(await methodsRes.json());
        }
      } catch (err) {
        console.error('Error loading recovery methods:', err);
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
      date_failure: dateFailure,
      claim_operating_time: parseInt(claimOperatingTime) || 0,
      component_failure: selectedComponentId || null,
      description_failure: descriptionFailure,
      recovery_method: selectedRecoveryMethodId || null,
      spare_parts: spareParts,
      date_recovery: dateRecovery,
      service_company: selectedServiceCompanyId || null,
    };
    
    try {
      const res = await createClaim(payload);
      setLoading(false);
      navigate('/claims');
    } catch (err) {
      setLoading(false);
      setError(err?.message || 'Ошибка при создании');
    }
  };

  return (
    <div className="new-claim-create" style={{ border: '1px solid #ccc', padding: 16, borderRadius: 6, margin: '12px 0' }}>
      <h3>Создать новую рекламацию</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        
        {/* Зав. номер машины */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Зав. номер машины:</label>
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
        </div>

        {/* Модель машины (автозаполнение) */}
        <div style={{ 
          padding: '8px 12px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '4px',
          color: autoModelMachine ? '#333' : '#999',
          border: '1px solid #ddd'
        }}>
          <strong>Модель машины:</strong> {autoModelMachine || 'Выберите машину'}
        </div>

        {/* Дата отказа */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Дата отказа:</label>
          <input 
            type="date"
            value={dateFailure} 
            onChange={(e) => setDateFailure(e.target.value)} 
            required 
          />
        </div>

        {/* Наработка в момент обращения */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Наработка в момент обращения (м.ч.):</label>
          <input 
            type="number"
            value={claimOperatingTime} 
            onChange={(e) => setClaimOperatingTime(e.target.value)} 
            required 
          />
        </div>

        {/* Узел отказа */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Узел отказа:</label>
          <select 
            value={selectedComponentId} 
            onChange={(e) => setSelectedComponentId(e.target.value)} 
            required
          >
            <option value="">Выберите узел отказа</option>
            {components.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Описание отказа */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Описание отказа:</label>
          <textarea 
            value={descriptionFailure} 
            onChange={(e) => setDescriptionFailure(e.target.value)} 
            required
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Способ восстановления */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Способ восстановления:</label>
          <select 
            value={selectedRecoveryMethodId} 
            onChange={(e) => setSelectedRecoveryMethodId(e.target.value)} 
            required
          >
            <option value="">Выберите способ восстановления</option>
            {recoveryMethods.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* Используемые запасные части */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Используемые запасные части:</label>
          <input 
            value={spareParts} 
            onChange={(e) => setSpareParts(e.target.value)} 
            required 
          />
        </div>

        {/* Дата восстановления */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Дата восстановления:</label>
          <input 
            type="date"
            value={dateRecovery} 
            onChange={(e) => setDateRecovery(e.target.value)} 
            required 
          />
        </div>

        {/* Сервисная компания */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Сервисная компания:</label>
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
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Создание...' : 'Создать'}
          </button>
          <button type="button" onClick={() => navigate('/claims')} disabled={loading}>
            Отмена
          </button>
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    </div>
  );
}