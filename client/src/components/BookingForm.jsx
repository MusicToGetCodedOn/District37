import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const BookingContainer = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const CalendarSection = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.card};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const SelectedDate = styled.div`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
  background-color:${({ theme }) => theme.card};
  padding: .5rem;
  border-radius:8px;
  text-align:start;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CalendarNavButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  color: ${({ theme }) => theme.text};
  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const CalendarMonth = styled.h2`
  margin: 0;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
`;

const Day = styled.div`
  padding: 0.5rem;
  text-align: center;
  border-radius: 4px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  background-color: ${({ status, disabled, selected, theme }) =>
    selected ? theme.calendarSelected :
    disabled ? theme.calendarDisabled :
    status === 'full' ? theme.calendarFull :
    status === 'free' ? theme.calendarFree :
    status === 'some' ? theme.calendarSome :
    theme.calendarAlmost};
  color: ${({ status, disabled }) =>
    disabled ? '#fff' :
    status === 'full' ? '#fff' :
    '#000'};
`;

const TimeSlot = styled.button`
  padding: 0.5rem;
  margin: 0.2rem;
  border: none;
  border-radius: 4px;
  background-color: ${({ disabled, selected, theme }) =>
    selected ? theme.calendarSelected :
    disabled ? '#d3d3d3' : theme.accent};
  color: ${({ disabled, selected }) => (disabled ? '#888' : selected ? '#000' : '#fff')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border: ${({ selected }) => (selected ? '2px solid #000' : 'none')};
`;

const FormSection = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.nav};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 94%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  ${({ disabled }) => disabled && `
    pointer-events: none;
    opacity: 0.6;
  `}
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.accent};
  color: white;
  transition: background-color 0.3s ease, transform 0.2s ease;
  &:hover {
    background-color: ${({ theme }) => theme.accenthover};
    transform: translateY(-2px);
  }
`;

const Weekday = styled.div`
  text-align: center;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.calendarDisabled};
  padding: 0.5rem;
  text-align: center;
  border-radius: 4px;
`;

const Weekdaygrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;

const LegendContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.card};
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const LegendColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-right: 0.5rem;
  background-color: ${({ theme, status }) => {
    switch (status) {
      case 'free': return theme.calendarFree;
      case 'some': return theme.calendarSome;
      case 'almost': return theme.calendarAlmost;
      case 'full': return theme.calendarFull;
      case 'selected': return theme.calendarSelected;
      default: return theme.calendarDisabled;
    }
  }};
`;

export default function BookingForm() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    participants: 1,
    isGroup: false,
    serviceId: '',
  });
  const [services, setServices] = useState([]);
  const theme = useTheme(); // Holen des aktuellen Themes

  // Fetch appointments
  useEffect(() => {
    axios.get('/api/appointments')
      .then(res => setAppointments(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch available time slots when a date is selected
  useEffect(() => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      axios.get(`/api/appointments/available/${dateString}`)
        .then(res => setAvailableSlots(res.data))
        .catch(err => console.error(err));
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate]);

  // Fetch services from database
  useEffect(() => {
    axios.get('/api/services')
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  }, []);

  // Generate days for the current month, excluding Sa and So
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Starte mit dem ersten Montag
    let startDay = new Date(firstDay);
    while (startDay.getDay() !== 1) { // 1 = Montag
      startDay.setDate(startDay.getDate() + 1);
    }

    // Füge Tage hinzu, nur Mo–Fr
    for (let day = startDay.getDate(); day <= lastDay.getDate(); day++) {
      const currentDate = new Date(year, month, day);
      if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) { // Nur Mo–Fr (1–5)
        days.push(currentDate);
      }
    }

    // Füge leere Tage für das Ende des Monats hinzu, um 5 Spalten pro Woche zu füllen
    while (days.length % 5 !== 0) {
      days.push(null);
    }

    return days;
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Determine day status based on bookings
  const getDayStatus = (date) => {
    if (!date) return 'disabled';
    const dateString = date.toISOString().split('T')[0];
    const dayAppointments = appointments.filter(appt => appt.date === dateString);
    const totalSlots = 6; // 18:00–20:30 = 6 Slots
    const bookedSlots = dayAppointments.length;

    if (bookedSlots === 0) return 'free';
    if (bookedSlots < totalSlots * 0.3) return 'some';
    if (bookedSlots < totalSlots * 0.8) return 'almost';
    return 'full';
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !formData.fullName || !formData.email || !formData.serviceId) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const token = localStorage.getItem('token'); // Token aus localStorage
      const appointmentsToSave = [];
      const participants = formData.isGroup ? formData.participants : 1;

      if (formData.isGroup && participants > 1) {
        const timeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];
        const startIndex = timeSlots.indexOf(selectedTime);
        if (startIndex === -1) {
          alert('Ungültige Startzeit.');
          return;
        }

        // Prüfen, ob genügend aufeinanderfolgende Slots verfügbar sind
        for (let i = 0; i < participants; i++) {
          const slotTime = timeSlots[startIndex + i];
          if (!slotTime || !availableSlots.includes(slotTime)) {
            alert('Nicht genügend aufeinanderfolgende Zeitfenster verfügbar. Bitte mindere die Anzahl Kunden.');
            return;
          }
        }

        // Gruppenbuchungen erstellen
        for (let i = 0; i < participants; i++) {
          const slotTime = timeSlots[startIndex + i];
          appointmentsToSave.push({
            userId: 'sample-user-id', // Platzhalter, ersetze mit realer User-ID
            date: dateString,
            time: slotTime,
            participants: 1,
            isGroup: true,
            service: {
              id: formData.serviceId,
              name: services.find(s => s._id === formData.serviceId)?.name || 'Unbekannter Service',
              price: services.find(s => s._id === formData.serviceId)?.price || 50
            }
          });
        }
      } else {
        if (!availableSlots.includes(selectedTime)) {
          alert('Gewählte Zeit ist bereits gebucht.');
          return;
        }
        appointmentsToSave.push({
          userId: 'sample-user-id', // Platzhalter, ersetze mit realer User-ID
          date: dateString,
          time: selectedTime,
          participants,
          isGroup: false,
          service: {
            id: formData.serviceId,
            name: services.find(s => s._id === formData.serviceId)?.name || 'Unbekannter Service',
            price: services.find(s => s._id === formData.serviceId)?.price || 50
          }
        });
      }

      for (const appt of appointmentsToSave) {
        await axios.post('/api/appointments', appt, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      alert('Buchung erfolgreich!');
      setFormData({ fullName: '', email: '', participants: 1, isGroup: false, serviceId: '' });
      setSelectedDate(null);
      setSelectedTime(null);
      setAvailableSlots([]);
    } catch (err) {
      console.error(err);
      alert('Buchung fehlgeschlagen: ' + err.message);
    }
  };

  // Format selected date for display
  const formatSelectedDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <BookingContainer>
      <CalendarSection>
        <CalendarHeader>
          <CalendarNavButton onClick={prevMonth}><FaArrowLeft /></CalendarNavButton>
          <CalendarMonth>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</CalendarMonth>
          <CalendarNavButton onClick={nextMonth}><FaArrowRight /></CalendarNavButton>
        </CalendarHeader>
        
        <Weekdaygrid>
          {['Mo', 'Di', 'Mi', 'Do', 'Fr'].map(day => (
            <Weekday key={day}>{day}</Weekday>
          ))}
        </Weekdaygrid>
        <br />
        <CalendarGrid>
          {getMonthDays().map((day, index) => (
            <Day
              key={index}
              status={day ? getDayStatus(day) : 'disabled'}
              disabled={!day}
              selected={day && selectedDate && day.toDateString() === selectedDate.toDateString()}
              onClick={() => day && setSelectedDate(day)}
            >
              {day ? day.getDate() : ''}
            </Day>
          ))}
        </CalendarGrid>
        <div>
          <h3>Uhrzeit auswählen</h3>
          {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'].map((time, index) => (
            <TimeSlot
              key={index}
              disabled={!selectedDate || !availableSlots.includes(time)}
              selected={selectedTime === time}
              onClick={() => availableSlots.includes(time) && setSelectedTime(time)}
            >
              {time}
            </TimeSlot>
          ))}
        </div>
        <LegendContainer>
          <h4>Legende</h4>
          <LegendItem>
            <LegendColor theme={theme} status="free" />
            <span>Frei</span>
          </LegendItem>
          <LegendItem>
            <LegendColor theme={theme} status="some" />
            <span>Einige Buchungen</span>
          </LegendItem>
          <LegendItem>
            <LegendColor theme={theme} status="almost" />
            <span>Fast ausgebucht</span>
          </LegendItem>
          <LegendItem>
            <LegendColor theme={theme} status="full" />
            <span>Ausgebucht</span>
          </LegendItem>
          <LegendItem>
            <LegendColor theme={theme} status="selected" />
            <span>Ausgewählt</span>
          </LegendItem>
        </LegendContainer>
      </CalendarSection>
      <FormSection>
        <h2>Buchungsformular</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Namen"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <CheckboxContainer>
            <input
              type="checkbox"
              checked={formData.isGroup}
              onChange={(e) => {
                const isGroup = e.target.checked;
                setFormData({ ...formData, isGroup, participants: isGroup ? formData.participants : 1 });
              }}
            />
            Gruppentermin
          </CheckboxContainer>
          <Input
            type="number"
            placeholder="Anzahl Kunden"
            value={formData.participants}
            onChange={(e) => formData.isGroup && setFormData({ ...formData, participants: parseInt(e.target.value) || 1 })}
            min="1"
            disabled={!formData.isGroup}
            required
          />
          <Select
            value={formData.serviceId}
            onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
            required
          >
            <option value="">Wählen Sie einen Service</option>
            {services.map(service => (
              <option key={service._id} value={service._id}>
                {service.name} (${service.price})
              </option>
            ))}
          </Select>
          <SelectedDate>Datum: {formatSelectedDate(selectedDate)}</SelectedDate>
          <SubmitButton type="submit">Book Appointment</SubmitButton>
        </form>
      </FormSection>
    </BookingContainer>
  );
}