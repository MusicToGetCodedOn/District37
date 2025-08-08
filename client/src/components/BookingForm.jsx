import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight, FaPlus } from 'react-icons/fa';
import Switch from './Switch';
import PersonForm from './Personform';

const BookingContainer = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.card};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 2rem auto;
`;

const CalendarSection = styled.div`
  flex: 1;
`;

const FormSection = styled.div`
  flex: 1;
`;

const CalendarContainer = styled.div`
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CalendarHeader = styled.div`
  background-color: ${({ theme }) => theme.accent};
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MonthName = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.2rem;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const Day = styled.div`
  padding: 0.8rem;
  text-align: center;
  border: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
  color: ${({ theme }) => theme.text};

  &:hover {
    background-color: #f9f9f9;
  }

  &.selected {
    background-color: ${({ theme }) => theme.primary};
    color: white;
  }

  &.today {
    font-weight: bold;
  }

  &.available {
    color: ${({ theme }) => theme.primary};
  }

  &.booked {
    color: #aaa;
    cursor: not-allowed;
  }
`;

const TimeSlots = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TimeSlotButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.primary : theme.accent)};
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.primaryhover : theme.accenthover)};
  }

  &.disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SelectedDate = styled.div`
  margin-top: 1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.primaryhover};
  }
`;

const AddPersonButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.accent};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.accenthover};
  }
`;

export default function BookingForm() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    isGroup: false,
    persons: [{ name: '', serviceId: '' }],
  });
  const [services, setServices] = useState([]);
  const theme = useTheme();

  // Aktuelles Datum und Zeit (12:49 PM CEST, 29. Juni 2025)
  const today = new Date('2025-06-29T12:49:00+02:00');

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (selectedDate) {
        const dateString = selectedDate.toISOString().split('T')[0];
        try {
          const response = await axios.get(`http://localhost:8080/api/appointments/available/${dateString}`);
          setAvailableSlots(response.data);
        } catch (error) {
          console.error('Error fetching available slots:', error);
          setAvailableSlots([]); // Fallback
        }
      }
    };

    fetchAvailableSlots();
  }, [selectedDate]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();

    let days = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDayStatus = (day) => {
    if (!day) return '';

    const isToday = day.toDateString() === today.toDateString();
    if (isToday) return 'today';

    const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
    if (isSelected) return 'selected';

    if (day < today) return 'booked';

    const dateString = day.toDateString();
    const selectedDateString = selectedDate?.toDateString();
    if (selectedDateString === dateString && availableSlots.length === 0) return 'booked';
    return 'available';
  };

  const handlePersonUpdate = (index, field, value) => {
    const updatedPersons = [...formData.persons];
    updatedPersons[index][field] = value;
    setFormData({ ...formData, persons: updatedPersons });
  };

  const addPerson = () => {
    setFormData({
      ...formData,
      persons: [...formData.persons, { name: '', serviceId: '' }]
    });
  };

  const removePerson = (index) => {
    if (formData.persons.length > 1) {
      const updatedPersons = formData.persons.filter((_, i) => i !== index);
      setFormData({ ...formData, persons: updatedPersons });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedDate || !selectedTime || !formData.customerName || !formData.customerEmail) {
    alert('Bitte füllen Sie alle Pflichtfelder aus.');
    return;
  }

  const invalidPerson = formData.persons.find(person => !person.name || !person.serviceId);
  if (invalidPerson) {
    alert('Bitte füllen Sie Name und Service für alle Personen aus.');
    return;
  }

  try {
    const dateString = selectedDate.toLocaleDateString('en-CA'); // Sicherstellen, dass YYYY-MM-DD
    const token = localStorage.getItem('token');
    let userId = null;
    if (token) {
      userId = null; // Ersetze mit gültiger ObjectId-Logik
    }

    const bookingData = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      date: dateString,
      time: selectedTime,
      isGroup: formData.isGroup,
      persons: formData.persons,
      userId: userId
    };
    console.log('Sending booking data:', bookingData);

    await axios.post('http://localhost:8080/api/appointments', bookingData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    alert('Buchung erfolgreich!');
    setFormData({
      customerName: '',
      customerEmail: '',
      isGroup: false,
      persons: [{ name: '', serviceId: '' }]
    });
    setSelectedDate(null);
    setSelectedTime(null);
    setAvailableSlots([]);
  } catch (err) {
    console.error('Buchung Fehler:', err.response ? err.response.data : err);
    alert('Buchung fehlgeschlagen: ' + (err.response?.data?.error || err.message));
  }
};

  const formatSelectedDate = (date) => {
    if (!date) return 'Kein Datum ausgewählt';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('de-DE', options);
  };

  return (
    <BookingContainer>
      <CalendarSection>
        <CalendarContainer>
          <CalendarHeader>
            <ArrowButton onClick={prevMonth}><FaArrowLeft /></ArrowButton>
            <MonthName>{currentDate.toLocaleString('de-DE', { month: 'long', year: 'numeric' })}</MonthName>
            <ArrowButton onClick={nextMonth}><FaArrowRight /></ArrowButton>
          </CalendarHeader>
          <DaysGrid>
            {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map(day => (
              <div key={day} style={{ textAlign: 'center', padding: '0.5rem', color: theme.text }}>{day}</div>
            ))}
            {getMonthDays(currentDate).map((day, index) => (
              <Day
                key={index}
                className={getDayStatus(day)}
                onClick={() => {
                  if (day && day >= today) {
                    setSelectedDate(day);
                  }
                }}
              >
                {day ? day.getDate() : ''}
              </Day>
            ))}
          </DaysGrid>
        </CalendarContainer>
        {selectedDate && (
          <TimeSlots>
            {availableSlots.map(slot => (
              <TimeSlotButton
                key={slot}
                $isSelected={selectedTime === slot}
                onClick={() => setSelectedTime(slot)}
              >
                {slot}
              </TimeSlotButton>
            ))}
          </TimeSlots>
        )}
      </CalendarSection>
      <FormSection>
        <h2>Buchungsformular</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Name"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Ihre E-Mail"
            value={formData.customerEmail}
            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            required
          />
          <Switch
            checked={formData.isGroup}
            onChange={(e) => setFormData({ ...formData, isGroup: e.target.checked })}
            label="Gruppentermin"
          />
          {formData.persons.map((person, index) => (
            <PersonForm
              key={index}
              person={person}
              index={index}
              services={services}
              onUpdate={handlePersonUpdate}
              onRemove={removePerson}
              canRemove={formData.persons.length > 1}
            />
          ))}
<<<<<<< Updated upstream
          <AddPersonButton type="button" onClick={addPerson}>
            <FaPlus /> Person hinzufügen
          </AddPersonButton>
          <SelectedDate>Datum: {formatSelectedDate(selectedDate)}</SelectedDate>
          <SubmitButton type="submit">Termin buchen</SubmitButton>
        </form>
      </FormSection>
    </BookingContainer>
=======

          {formData.isGroup && (
            <Button type="button" onClick={() => {
              setFormData({ ...formData, persons: [...formData.persons, { name: '', serviceId: '', notes: '' }] });
            }}>
              <FaPlus /> Person hinzufügen
            </Button>
          )}

          

          <div>
            <Button type="button" onClick={() => setStep(1)}><FaArrowLeft /> Zurück</Button>
            <Button type="button" onClick={() => setStep(3)} disabled={false}>Weiter <FaArrowRight /></Button>
          </div>
        </form>
      )}

      {/* Schritt 3: Zeit auswählen */}
      {step === 3 && (
        <StepContainer>
          <h2>Wähle eine Uhrzeit</h2>

          {loadingSlots ? (
            <p>Lade verfügbare Slots...</p>
          ) : (
            <SlotGrid>
              {slots.map((slot, idx) => {
                const personCount = formData.isGroup ? formData.persons.length : 1;
                const sequence = slots.slice(idx, idx + personCount);

                // Prüfen, ob für Gruppentermine alle benötigten Slots verfügbar sind
                const isAvailable = sequence.length === personCount && sequence.every(s => s.availableSpots > 0);

                const isSelected = selectedSlots.length > 0
                  ? selectedSlots.includes(slot.time)
                  : selectedTime && !Array.isArray(selectedTime) && selectedTime.time === slot.time;

                return (


                  console.log(selectedDate.toISOString().split('T')[0]),


                  <SlotButton
                    key={slot.time}
                    selected={isSelected}
                    disabled={!isAvailable}
                    onClick={() => {
                      if (!isAvailable) return;

                      if (formData.isGroup) {
                        const newSelected = sequence.map(s => s.time);
                        setSelectedSlots(newSelected);
                        setSelectedTime(sequence);
                      } else {
                        setSelectedSlots([slot.time]);
                        setSelectedTime(slot);
                      }
                    }}
                  >
                    {slot.time}
                  </SlotButton>
                );
              })}
            </SlotGrid>
          )}

          <NavButtons>
            <Button type="button" onClick={() => setStep(2)}><FaArrowLeft /> Zurück</Button>
            <Button type="button" onClick={() => setStep(4)} disabled={!selectedTime}><FaArrowRight /> Weiter</Button>
          </NavButtons>
        </StepContainer>
      )}

      {step === 4 && (
        <>
          <h3>Buchungsübersicht</h3>

          {/* Basisdaten der Buchung */}
          <p><strong>Name:</strong> {formData.customerName}</p>
          <p><strong>E-Mail:</strong> {formData.customerEmail}</p>
          <p><strong>Datum:</strong> {selectedDate?.toLocaleDateString('de-DE')}</p>
          <p>
            <strong>Uhrzeit:</strong>{' '}
            {Array.isArray(selectedTime)
              ? `${selectedTime[0].time} – ${selectedTime[selectedTime.length - 1].time}`
              : selectedTime?.time}
          </p>

          {/* Unterscheidung zwischen Einzel- und Gruppenbuchung */}
          {formData.isGroup ? (
            <>
              <p><strong>Teilnehmer & Leistungen:</strong></p>
              <ul>
                {formData.persons.map((p, i) => {
                  const service = services.find(s => s._id === p.serviceId);
                  const serviceName = service?.name || 'Unbekannt';
                  const servicePrice = service?.price?.toFixed(2) || '?';
                  return (
                    <li key={i}>
                      {p.name} – {serviceName} ({servicePrice} CHF)
                    </li>
                  );
                })}
              </ul>

              {/* Gesamtpreis aller Personen */}
              <p>
                <strong>Total:</strong>{' '}
                {formData.persons.reduce((sum, p) => {
                  const service = services.find(s => s._id === p.serviceId);
                  return sum + (service?.price || 0);
                }, 0).toFixed(2)} CHF
              </p>
            </>
          ) : (
            <>
              {/* Einzelbuchung: Leistung + Preis */}
              <p>
                <strong>Leistung:</strong>{' '}
                {services.find(s => s._id === formData.persons[0].serviceId)?.name || 'Unbekannt'} (
                {services.find(s => s._id === formData.persons[0].serviceId)?.price.toFixed(2) || '?'} CHF)
              </p>
            </>
          )}

          

          {/* Navigation */}
          <div>
            <Button type="button" onClick={() => setStep(3)}>
              <FaArrowLeft /> Zurück
            </Button>
            <Button type="submit" onClick={handleSubmit}>Termin buchen</Button>
          </div>
        </>
      )}


    </div>
>>>>>>> Stashed changes
  );
}