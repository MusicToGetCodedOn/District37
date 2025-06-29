import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState({});
  const [search, setSearch] = useState('');

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debugging
      if (!token) {
        console.error('Kein Token vorhanden, bitte als Admin anmelden.');
        setAppointments([]);
        return;
      }

      const res = await axios.get('http://localhost:8080/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
      const userIds = [...new Set(res.data.map(appointment => appointment.userId).filter(id => id))];
      if (userIds.length > 0) {
        const userPromises = userIds.map(userId =>
          axios.get(`http://localhost:8080/api/auth/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => ({ [userId]: res.data }))
        );
        const userResponses = await Promise.all(userPromises);
        const usersMap = userResponses.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setUsers(usersMap);
      }
    } catch (err) {
      console.error('Fehler beim Abrufen der Termine oder Benutzer:', err);
      if (err.response && err.response.status === 403) {
        console.error('403 Forbidden: Möglicherweise keine Admin-Rolle.');
      }
      setAppointments([]); // Fehlermeldung bei Error
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filtered = Array.isArray(appointments)
    ? appointments.filter(appointment => {
        const user = users[appointment.userId] || {};
        const name = user.name || appointment.customerName || '';
        const email = user.email || appointment.customerEmail || '';
        return (
          name.toLowerCase().includes(search.toLowerCase()) ||
          email.toLowerCase().includes(search.toLowerCase())
        );
      })
    : [];

  return (
    <div className="service-list-container">
      <div className="service-list-header">
        <input
          type="text"
          placeholder="Termin suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="service-table">
        <thead>
          <tr>
            <th>Gebucht von</th>
            <th>Email</th>
            <th>IsGroup</th>
            <th>Kunde</th>
            <th>Service</th>
            <th>Datum</th>
            <th>Zeit</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(appointment => {
            const user = users[appointment.userId] || {};
            const person = appointment.persons[0] || {}; // Erste Person als Repräsentation
            return (
              <tr key={appointment._id}>
                <td>{user.name || appointment.customerName || 'Nicht angegeben'}</td>
                <td>{user.email || appointment.customerEmail || 'Nicht angegeben'}</td>
                <td>{appointment.isGroup ? 'Ja' : 'Nein'}</td>
                <td>{person.name}</td>
                <td>{person.serviceName || 'Unbekannt'}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
              </tr>
            );
          })}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="7" className="no-results">Keine Termine gefunden.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentList;