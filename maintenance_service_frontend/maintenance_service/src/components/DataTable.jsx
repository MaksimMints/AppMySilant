import React from 'react';
import {WELCOME_DISPLAY_FIELDS} from '../pages/WelcomePage';


export default function DataTable({ machine, isAuth }) { 
  if (!machine) return null;

  const leftFields = (WELCOME_DISPLAY_FIELDS || []).slice(0, 11);
  const entries = Object.entries(machine); 
  const visible = isAuth ? entries : entries.slice(0, 11);

return ( 
  <section className="table-block" aria-label="Данные машины"> 
    <h3>Таблица с данными</h3> 
      <div className="data-grid"> 
          <div className="data-left"> 
            <table className="machine-details"> 
              <tbody> 
                {
                leftFields.map((f) => ( 
                <tr key={f.key}> 
                <td className="field-label">{f.label}</td> 
                {/* <td className="field-value">{machine?.[f.key] ?? ''}</td>*/}
                 </tr>  
                 )
                 )
                 } 
              </tbody> 
            </table> 
          </div> 
          <div className="data-right"> 
              <tbody> 
                {
                leftFields.map((f) => ( 
                <tr key={f.key}> 

                <td className="field-value">{machine?.[f.key] ?? ''}</td>
                 </tr> 
                 )
                 )
                 } 
              </tbody> 
          </div> 
        </div> 
  </section> 
  ); 
}