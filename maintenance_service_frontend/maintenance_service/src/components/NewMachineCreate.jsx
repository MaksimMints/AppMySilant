import React, { useEffect, useState } from 'react';
import { createMachine } from '../services/api';
import { useActionData } from 'react-router-dom';

export default function NewMachineCreate({ onCreated, onCancel }) {
  const [serial, setSerial] = useState('');
  
  // Состояния для выпадашек (справочники)
  const [selectedModelMachineId, setSelectedModelMachineId] = useState('');
  const [selectedModelEngineId, setSelectedModelEngineId] = useState('');
  const [selectedTransmissionId, setSelectedTransmissionId] = useState('');
  const [selectedDrivingBridgeId, setSelectedDrivingBridgeId] = useState('');
  const [selectedControlledBridgeId, setSelectedControlledBridgeId] = useState('');
  
  const [serialEngine, setSnEngine] = useState('');
  const [serialTransmission, setSnTransm] = useState('');
  const [serialDrivingBridge, setSnDrBridge] = useState('');
  const [serialContrBridge, setSnContrBridge] = useState('');
  const [contract, setContract] = useState('');
  const [dateShipment, setDateShipment] = useState('');
  const [recipient, setRecipient] = useState('');
  const [operAddress, setOperAdress] = useState('');
  const [equipment, setEquipment] = useState('');
  
  // Данные для выпадашек (клиенты и сервисные компании)
  const [customers, setCustomers] = useState([]);
  const [serviceCompanies, setServiceCompanies] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedServiceCompanyId, setSelectedServiceCompanyId] = useState('');
  
  // Данные для справочников
  const [modelMachines, setModelMachines] = useState([]);
  const [modelEngines, setModelEngines] = useState([]);
  const [transmissions, setTransmissions] = useState([]);
  const [drivingBridges, setDrivingBridges] = useState([]);
  const [controlledBridges, setControlledBridges] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка всех выпадашек
  useEffect(() => {
    const loadDropdownData = async () => {
      // Клиенты и сервисные компании
      try {
        const customersRes = await fetch('/api/customers_dropdown/', {
          credentials: 'include',
        });
        if (customersRes.ok) {
          setCustomers(await customersRes.json());
        }
      } catch (err) {
        console.error('Error loading customers:', err);
      }

      try {
        const serviceRes = await fetch('/api/service_companies_dropdown/', {
          credentials: 'include',
        });
        if (serviceRes.ok) {
          setServiceCompanies(await serviceRes.json());
        }
      } catch (err) {
        console.error('Error loading service companies:', err);
      }

      // Справочники
      try {
        const [mm, me, tr, db, cb] = await Promise.all([
          fetch('/api/model_machines/', { credentials: 'include' }).then(r => r.ok ? r.json() : []),
          fetch('/api/model_engines/', { credentials: 'include' }).then(r => r.ok ? r.json() : []),
          fetch('/api/transmissions/', { credentials: 'include' }).then(r => r.ok ? r.json() : []),
          fetch('/api/driving_bridges/', { credentials: 'include' }).then(r => r.ok ? r.json() : []),
          fetch('/api/controlled_bridges/', { credentials: 'include' }).then(r => r.ok ? r.json() : []),
        ]);
        
        setModelMachines(mm);
        setModelEngines(me);
        setTransmissions(tr);
        setDrivingBridges(db);
        setControlledBridges(cb);
      } catch (err) {
        console.error('Error loading reference data:', err);
      }
    };

    loadDropdownData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const payload = {
      serial_number_machine: serial,
      model_machine: selectedModelMachineId || null,
      model_engine: selectedModelEngineId || null,
      serial_number_engine: serialEngine,
      model_transmission: selectedTransmissionId || null,
      serial_number_transmission: serialTransmission,
      model_driving_bridge: selectedDrivingBridgeId || null,
      serial_number_driving_bridge: serialDrivingBridge,
      model_controlled_bridge: selectedControlledBridgeId || null,
      serial_number_controlled_bridge: serialContrBridge,
      supply_contract_number_and_date: contract,
      date_shipment_from_factory: dateShipment,
      recipient: recipient,
      operating_address: operAddress,
      equipment: equipment,
      customer: selectedCustomerId || null,
      service_company: selectedServiceCompanyId || null,
    };
    
    try {
      const res = await createMachine(payload);
      setLoading(false);
      onCreated?.(res);
    } catch (err) {
      setLoading(false);
      setError(err?.message || 'Ошибка при создании');
    }
  };

  return (
    <div className="new-machine-create" style={{ border: '1px solid #ccc', padding: 16, borderRadius: 6, margin: '12px 0' }}>
      <h3>Создать новую машину</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        
        <input placeholder="Серийный номер" value={serial} onChange={(e) => setSerial(e.target.value)} required />
        
        {/* Модель машины */}
        <select value={selectedModelMachineId} onChange={(e) => setSelectedModelMachineId(e.target.value)} required>
          <option value="">Выберите модель машины</option>
          {modelMachines.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        
        {/* Модель двигателя */}
        <select value={selectedModelEngineId} onChange={(e) => setSelectedModelEngineId(e.target.value)} required>
          <option value="">Выберите модель двигателя</option>
          {modelEngines.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        
        <input placeholder="Серийный номер двигателя" value={serialEngine} onChange={(e) => setSnEngine(e.target.value)} required />
        
        {/* Модель трансмиссии */}
        <select value={selectedTransmissionId} onChange={(e) => setSelectedTransmissionId(e.target.value)} required>
          <option value="">Выберите модель трансмиссии</option>
          {transmissions.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        
        <input placeholder="Серийный номер трансмиссии" value={serialTransmission} onChange={(e) => setSnTransm(e.target.value)} required />
        
        {/* Ведущий мост */}
        <select value={selectedDrivingBridgeId} onChange={(e) => setSelectedDrivingBridgeId(e.target.value)} required>
          <option value="">Выберите ведущий мост</option>
          {drivingBridges.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        
        <input placeholder="Серийный номер ведущего моста" value={serialDrivingBridge} onChange={(e) => setSnDrBridge(e.target.value)} required />
        
        {/* Управляемый мост */}
        <select value={selectedControlledBridgeId} onChange={(e) => setSelectedControlledBridgeId(e.target.value)} required>
          <option value="">Выберите управляемый мост</option>
          {controlledBridges.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        
        <input placeholder="Серийный номер управляемого моста" value={serialContrBridge} onChange={(e) => setSnContrBridge(e.target.value)} required />
        
        <input placeholder="Договор поставки и дата" value={contract} onChange={(e) => setContract(e.target.value)} required />
        <input placeholder="Дата отгрузки с завода" value={dateShipment} onChange={(e) => setDateShipment(e.target.value)} required type="date" />
        <input placeholder="Получатель" value={recipient} onChange={(e) => setRecipient(e.target.value)} required />
        <input placeholder="Эксплуатационный адрес" value={operAddress} onChange={(e) => setOperAdress(e.target.value)} required />
        <input placeholder="Комплектация" value={equipment} onChange={(e) => setEquipment(e.target.value)} required />

        {/* Клиент */}
        <select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} required>
          <option value="">Выберите клиента</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Сервисная компания */}
        <select value={selectedServiceCompanyId} onChange={(e) => setSelectedServiceCompanyId(e.target.value)} required>
          <option value="">Выберите сервисную компанию</option>
          {serviceCompanies.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading}>{loading ? 'Создание...' : 'Создать'}</button>
          <button type="button" onClick={onCancel} disabled={loading}>Отмена</button>
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    </div>
  );
}