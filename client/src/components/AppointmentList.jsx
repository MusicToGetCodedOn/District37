import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState({});
  const [search, setSearch] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('/api/appointments');
      setAppointments(res.data);
      // Hole alle eindeutigen userIds
      const userIds = [...new Set(res.data.map(appointment => appointment.userId))];
      if (userIds.length > 0) {
        const userPromises = userIds.map(userId =>
          axios.get(`/api/auth/${userId}`).then(res => ({ [userId]: res.data }))
        );
        const userResponses = await Promise.all(userPromises);
        const usersMap = userResponses.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setUsers(usersMap);
      }
    } catch (err) {
      console.error('Fehler beim Abrufen der Termine oder Benutzer:', err);
      setAppointments([]); // Fallback auf leere Liste bei Fehler
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filtered = Array.isArray(appointments)
    ? appointments.filter(appointment => {
        const user = users[appointment.userId] || {};
        const name = user.name || '';
        const email = user.email || '';
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
            <th>Name</th>
            <th>Email</th>
            <th>IsGroup</th>
            <th>Anzahl Personen</th>
            <th>Service</th>
            <th>Datum</th>
            <th>Zeit</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(appointment => {
            const user = users[appointment.userId] || {};
            return (
              <tr key={appointment._id}>
                <td>{user.name || 'Nicht angegeben'}</td>
                <td>{user.email || 'Nicht angegeben'}</td>
                <td>{appointment.isGroup ? 'Ja' : 'Nein'}</td>
                <td>{appointment.participants || 0}</td>
                <td>{appointment.service?.name || 'Unbekannt'}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
              </tr>
            );
          })}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="5" className="no-results">Keine Termine gefunden.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentList;