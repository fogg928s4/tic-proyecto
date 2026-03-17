import React from 'react';
import ReactDOM from 'react-dom/client';
import { TicketForm } from './form';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="container">
      <h1>Gestor de Tickets IT</h1>
      <TicketForm />
    </div>
  </React.StrictMode>
);
