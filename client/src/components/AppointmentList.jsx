import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Kein Token vorhanden, bitte als Admin anmelden.');
        setAppointments([]);
        return;
      }

      const res = await axios.get(`http://localhost:8080/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments(res.data);
    } catch (err) {
      console.error('Fehler beim Abrufen der Termine:', err);
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filtered = appointments.filter(appointment => {
    const name = appointment.name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="service-list-container">
      <div className="service-list-header">
        <input
          type="text"
          placeholder="Termin suchen..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="service-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Datum</th>
            <th>Zeit</th>
            <th>Service</th>
            <th>Preis</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((appointment, index) => (
              <tr key={index}>
                <td>{appointment.name || 'Nicht angegeben'}</td>
                <td>{appointment.date || 'Nicht angegeben'}</td>
                <td>{appointment.time || 'Nicht angegeben'}</td>
                <td>{appointment.service || 'Unbekannt'}</td>
                <td>{appointment.price ? `${appointment.price} €` : 'Unbekannt'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-results">
                Keine Termine gefunden.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentList;
