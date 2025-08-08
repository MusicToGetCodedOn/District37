import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaPen, FaPlus } from 'react-icons/fa';

const ServiceList = ({ onEdit, onCreate }) => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');

  const fetchServices = async () => {
    const res = await axios.get('/api/services');
    setServices(res.data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Service wirklich löschen?')) {
      await axios.delete(`/api/services/${id}`);
      fetchServices();
    }
  };

  const filtered = Array.isArray(services)
    ? services.filter(service =>
      service.name.toLowerCase().includes(search.toLowerCase())
    )
    : [];

  return (
    <div className="service-list-container">
      <div className="service-list-header">
        <input
          type="text"
          placeholder="Service suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button onClick={onCreate} title="Neuer Service" className="add-button">
          <FaPlus /> Hinzufügen
        </button>
      </div>

      <table className="service-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Beschreibung</th>
            <th>Preis</th>
            <th>Erstellt</th>
            <th>zuletzt bearbeitet</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(service => (
            <tr key={service._id}>
              <td>{service.name}</td>
              <td>{service.desc}</td>
              <td>{service.price} .-</td>
              <td>{new Date(service.createdAt).toLocaleString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              </td>
              <td>{new Date(service.updatedAt).toLocaleString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              </td>
              <td className="action-buttons">
                <button
                  onClick={() => onEdit(service)}
                  title="Bearbeiten"
                  className="edit-button"
                >
                  <FaPen />
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  title="Löschen"
                  className="delete-button"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="4" className="no-results">Keine passenden Services gefunden.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceList;
