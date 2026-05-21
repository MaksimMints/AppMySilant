import React, { useContext, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DataTable from '../components/DataTable';
import { AuthContext } from '../contexts/AuthContext';
import { fetchMachineBySerial } from '../services/api';

export const WELCOME_DISPLAY_FIELDS = [ 
    { key: 'serial_number_machine', label: 'Серийный номер машины' }, 
    { key: 'model_machine', label: 'Модель машины' }, 
    { key: 'model_engine', label: 'Модель двигателя' }, 
    { key: 'model_transmission', label: 'Модель трансмиссии' }, 
    { key: 'model_driving_bridge', label: 'Модель ведущего моста' }, 
    { key: 'model_controlled_bridge', label: 'Модель управляемого моста' }, 
    { key: 'serial_number_engine', label: 'Серийный номер двигателя' }, 
    { key: 'serial_number_transmission', label: 'Серийный номер трансмиссии' }, 
    { key: 'serial_number_driving_bridge', label: 'Серийный номер ведущего моста' }, 
    { key: 'serial_number_controlled_bridge', label: 'Серийный номер управляемого моста' }, 
     
]

export default function WelcomePage() {
  const { isAuthenticated } = useContext(AuthContext);
  const [serial, setSerial] = useState('');
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);


  const handleSearch = async () => {
    if (!serial.trim()) return;
    setLoading(true);
    setNotFound(false);
    setMachine(null);

    try {
      const data = await fetchMachineBySerial(serial.trim());
      if (data) {
        setMachine(data);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const displaySource = machine && Array.isArray(machine) ? machine[0] : machine;
  const entriesWrapper = displaySource ? Object.entries(displaySource) : [];

  const machineForTable = displaySource;

  return (
    <div className="app-root">
      
      <main className="container">
        
        <section className="full-width-text">
          <p>Добро пожаловать. Введите заводской номер машины и нажмите Поиск.</p>
        </section>

        <section className="search-area">
          <div className="search-row">
            <input
              type="text"
              placeholder="Заводской номер"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              className="input"
            />
            <button className="btn-search" onClick={handleSearch} disabled={loading}>
              {loading ? 'Поиск...' : 'Поиск'}
            </button>
          </div>
          {notFound && (
            <div className="message not-found" role="status">
              Машина с указанным заводским номером не найдена
            </div>
          )}
        </section>

        <section className="left-text">
          <p>Результат поиска:</p>
        </section>

        <section className="center-text">
          <p>Информация о комплектации и технических характеристиках Вашей техники</p>
        </section>

        <DataTable machine={machineForTable} isAuth={isAuthenticated} />
      </main>

      <Footer />
    </div>
  );
}