import React, { useState } from 'react';

export const TicketForm: React.FC = () => {
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
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
      
      if (!webhookUrl) {
        setStatus({ type: 'error', message: 'Webhook URL no configurada' });
        setLoading(false);
        return;
      }

      const params = new URLSearchParams(formData);
      const response = await fetch(`${webhookUrl}?${params.toString()}`, {
        method: "GET",
        mode: "cors"
      });

      // Handle the response if possible, noting that webhooks might not return JSON or might have CORS restrictions
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
        setStatus({ type: 'error', message: 'Error al enviar el ticket' });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setStatus({ type: 'error', message: 'Error de conexión con el webhook' });
    } finally {
      setLoading(false);
    }
  };

  if (status.type === 'success') {
    return (
      <div className="message success">
        <h2>¡Ticket enviado!</h2>
        <p>{status.message}</p>
        <button 
          onClick={() => setStatus({ type: null, message: '' })}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          Enviar otro ticket
        </button>
      </div>
    );
  }

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

      {status.type === 'error' && (
        <div className="message error">
          {status.message}
        </div>
      )}
    </div>
  );
};
