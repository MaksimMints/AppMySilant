import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tm, setTm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTm = async () => {
      try {
        const res = await fetch(`/api/tm/${id}/`, {
          credentials: 'include',
        });
        
        if (res.ok) {
          const data = await res.json();
          setTm(data);
        } else if (res.status === 404) {
          setError('Запись не найдена');
        } else {
          setError('Ошибка при загрузке данных');
        }
      } catch (err) {
        setError('Ошибка соединения');
      } finally {
        setLoading(false);
      }
    };

    fetchTm();
  }, [id]);

  if (loading) {
    return <div style={{ padding: 20 }}>Загрузка...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => navigate(-1)}>Назад</button>
      </div>
    );
  }

  if (!tm) {
    return (
      <div style={{ padding: 20 }}>
        <p>Данные не найдены</p>
        <button onClick={() => navigate(-1)}>Назад</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Информация о техническом обслуживании</h2>
      
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: 8, 
        padding: 20,
        backgroundColor: '#fff',
        maxWidth: 600 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold', width: '40%' }}>
                Зав. номер машины:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {tm.serial_number_machine}
              </td>
            </tr>
            
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Модель машины:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {tm.model_machine || 'Не указана'}
              </td>
            </tr>
            
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Вид ТО:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {tm.type_of_tm}
              </td>
            </tr>
            
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Дата проведения ТО:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {tm.date_tm}
              </td>
            </tr>
            
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Наработка:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {tm.operating_time} м.ч.
              </td>
            </tr>
            
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Номер заказ-наряда:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {tm.number_orderoutfit}
              </td>
            </tr>
            
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Дата заказ-наряда:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {tm.date_orderoutfit}
              </td>
            </tr>
            
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Компания, проводившая ТО:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {tm.tm_company}
              </td>
            </tr>
            
            <tr>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Сервисная компания:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {tm.service_company}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div style={{ marginTop: 16 }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ padding: '8px 16px' }}
        >
          ← Назад
        </button>
      </div>
    </div>
  );
}