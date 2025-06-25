import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceForm = ({ initialData, onSave, onCancel }) => {
  const [form, setForm] = useState({ name: '', desc: '', price: '' });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (initialData?._id) {
      await axios.put(`/api/services/${initialData._id}`, form);
    } else {
      await axios.post('/api/services', form);
      console.log("eingereicht")
    }
    onSave();
    setForm({ name: '', desc: '', price: '' });
  };

  return (
    <div>
      <h3>{initialData ? 'Service bearbeiten' : 'Neuer Service'}</h3>
      <form onSubmit={handleSubmit} className='formcontainer'>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="inputfield"
        />
        <input
          type="text"
          placeholder="Beschreibung"
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
          required
          className="inputfield"
        />
        <input
          type="number"
          placeholder="Preis"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
          className="inputfield"
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" onClick={handleSubmit}>Speichern</button>
          <button type="button" onClick={onCancel}>Abbrechen</button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
