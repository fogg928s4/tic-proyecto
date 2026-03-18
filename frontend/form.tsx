import React, { useState } from 'react';
import { config } from 'dotenv';

export const TicketForm: React.FC = () => {
  const webhookURL = process.env['WEBHOOK_URL'] || "https://webhook.my-domain.com";
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    priority: 'MEDIA',
    date: new Date().toISOString().split('T')[0],
    reason: ''
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({
    type: null,
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const params = new URLSearchParams(formData);
      const response = await fetch(`${webhookURL}?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Ticket enviado correctamente' });
        setFormData({
          name: '',
          email: '',
          priority: 'MEDIA',
          date: new Date().toISOString().split('T')[0],
          reason: ''
        });
      } else {
        setStatus({ type: 'error', message: data.error || 'Error al enviar el ticket' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error de conexión con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Prioridad</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="BAJA">BAJA</option>
            <option value="MEDIA">MEDIA</option>
            <option value="ALTA">ALTA</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Fecha de incidencia</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reason">Descripción del problema</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>

      {status.type && (
        <div className={`message ${status.type}`}>
          {status.message}
        </div>
      )}
    </div>
  );
};
