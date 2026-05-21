import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ClaimDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const res = await fetch(`/api/claims/${id}/`, {
          credentials: 'include',
        });
        
        if (res.ok) {
          const data = await res.json();
          setClaim(data);
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

    fetchClaim();
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

  if (!claim) {
    return (
      <div style={{ padding: 20 }}>
        <p>Данные не найдены</p>
        <button onClick={() => navigate(-1)}>Назад</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Информация о рекламации</h2>
      
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: 8, 
        padding: 20,
        backgroundColor: '#fff',
        maxWidth: 700 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold', width: '40%' }}>
                Зав. номер машины:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {claim.serial_number_machine}
              </td>
            </tr>
            
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Модель машины:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {claim.model_machine || 'Не указана'}
              </td>
            </tr>
            
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Дата отказа:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {claim.date_failure}
              </td>
            </tr>
            
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Наработка в момент обращения:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {claim.claim_operating_time} м.ч.
              </td>
            </tr>
            
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Узел отказа:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {claim.component_failure}
              </td>
            </tr>
            
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Описание отказа:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {claim.description_failure}
              </td>
            </tr>
            
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Способ восстановления:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {claim.recovery_method}
              </td>
            </tr>
            
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Используемые запасные части:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {claim.spare_parts}
              </td>
            </tr>
            
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Дата восстановления:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {claim.date_recovery}
              </td>
            </tr>
            
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Время простоя:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {claim.equipment_downtime !== null ? `${claim.equipment_downtime} дн.` : 'Не рассчитано'}
              </td>
            </tr>
            
            <tr>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                Сервисная компания:
              </td>
              <td style={{ padding: '12px 8px' }}>
                {claim.service_company}
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