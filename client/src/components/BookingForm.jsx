import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight, FaPlus } from 'react-icons/fa';
import Switch from './Switch';
import PersonForm from './PersonForm';

const formatDateToISO = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Breadcrumbs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Step = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'active'
})`
  padding: 0.5rem 1rem;
  color: ${({ active, theme }) => (active ? theme.primary : '#999')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  text-decoration: ${({ active }) => (active ? 'underline' : 'none')};
`;
const CalendarWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Day = styled.div`
  padding: 1rem;
  text-align: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

    
  background-color: ${({ selected, theme }) => (selected ? theme.primary : theme.body)};
  color: ${({ selected, theme }) => (selected ? '#fff' : theme.text)};
  border-radius: 6px;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  border: 2px solid ${({ selected, theme }) => (selected ? theme.primary : theme.surface)};
  transition: background-color 0.2s, border 0.2s;

  &.available-high {
    background-color: ${({ theme }) => theme.calendarFree};
    color: #fff;
  }

  &.available-medium {
    background-color: ${({ theme }) => theme.calendarSome};
    color: #fff;
  }

  &.available-low {
    background-color: ${({ theme }) => theme.calendarAlmost};
    color: #fff;
  }

  &.available-none {
    background-color: ${({ theme }) => theme.calendarFull};
    color: #fff;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
`;


const Button = styled.button`
  padding: 0.6rem 1.2rem;
  margin: 0.5rem;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const MonthTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 0.5rem;
`;

const SlotButton = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 2px solid ${({ selected, theme }) => (selected ? theme.primary : theme.surface)};
  background-color: ${({ selected, theme }) => (selected ? theme.primary : theme.body)};
  color: ${({ selected, theme }) => (selected ? "#fff" : theme.text)};
  cursor: pointer;
  transition: background-color 0.2s, border 0.2s;

  &:hover {
    background-color: ${({ selected, theme }) =>
    selected ? theme.hover : theme.accenthover};
  }

  &:focus {
    outline: none;
    border: none;
    box-shadow: 0 0 0 4px ${({ theme }) => theme.primary}66;
    background-color: ${({ theme }) => theme.accenthover};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
    background-color: #e0e0e0;
    border-color: #c0c0c0;
    color: #888;
  }
`;


const NavButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const SummaryWrapper = styled.div`
  background-color: ${({theme}) => theme.card};
  padding: 1rem;
  width: 40%;
  justify-self: center;
  border: 3px solid ${({theme}) => theme.border};
  border-radius: 10px;
  margin-bottom: 1rem;
`;

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [monthAvailability, setMonthAvailability] = useState({});
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    isGroup: false,
    persons: [{ name: '', serviceId: '', notes: '' }],
    notes: ''
  });
  const [services, setServices] = useState([]);
  const theme = useTheme();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleSelectSlot = (slot) => {
    const personsCount = formData.isGroup ? formData.persons.length : 1;
    const startindex = availableSlots.findIndex(s => s.time === slot.time);
    if (startindex === -1) return;

    const neededSlots = availableSlots.slice(startindex, startindex + personsCount);
    if (neededSlots.length < personsCount) {
      alert('Nicht genügend freie Slots für die Anzahl der Personen.');
      return;
    }

    setSelectedTime(neededSlots);
  };


  // Services laden
  useEffect(() => {
    axios.get('http://localhost:8080/api/services')
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  }, []);

  // Monatsverfügbarkeit laden
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    axios
      .get(`http://localhost:8080/api/appointments/available/month/${year}-${String(month).padStart(2, '0')}`)
      .then((res) => setMonthAvailability(res.data))
      .catch(() => setMonthAvailability({}));
  }, [currentDate]);

  // Funktion: Slots für ein Datum laden
  const fetchAvailableSlots = async (dateStr) => {
    try {
      const personsCount = formData.isGroup ? formData.persons.length : 1;
      const response = await axios.get(`http://localhost:8080/api/appointments/available/day/${dateStr}?requiredSpots=${personsCount}`);
      const slots = response.data;

      const filteredSlots = slots;
      setAvailableSlots(filteredSlots);
    } catch (err) {
      console.error('Fehler beim Laden der Slots:', err?.response?.data || err.message);
      alert('Fehler beim Laden der Zeiten: ' + (err?.response?.data?.error || err.message));
      setAvailableSlots([]);
    }
  };





  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      const dateStr = formatDateToISO(selectedDate);
      axios.get(`http://localhost:8080/api/appointments/available/day/${dateStr}`)
        .then(res => setSlots(res.data))
        .catch(err => console.error("Fehler beim Laden der Slots:", err))
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedDate]);

  // Lade Slots beim Schrittwechsel zu Schritt 2
  useEffect(() => {
    if (step === 2 && selectedDate) {
      fetchAvailableSlots(formatDateToISO(selectedDate));
    }
  }, [step]);

  // Helferfunktionen
  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: firstDay }, () => null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  function checkIfEnoughSlotsAvailable(startTime) {
    const index = availableSlots.findIndex(s => s.time === startTime);
    const needed = formData.isGroup ? formData.persons.length : 1;

    if (index === -1 || index + needed > availableSlots.length) return false;

    const sequence = availableSlots.slice(index, index + needed);
    return sequence.every(s => s.availableSpots > 0);
  }

  function isStartSlotAvailable(startTime) {
    const startIndex = availableSlots.findIndex(s => s.time === startTime);
    const needed = formData.isGroup ? formData.persons.length : 1;

    if (startIndex === -1 || startIndex + needed > availableSlots.length) return false;

    const sequence = availableSlots.slice(startIndex, startIndex + needed);
    return sequence.every(slot => slot.availableSpots > 0);
  }

  // Handler bei Slot-Klick (setzt Auswahl)
  const handleSlotClick = (slot) => {
    const startIndex = availableSlots.findIndex(s => s.time === slot.time);
    const needed = formData.isGroup ? formData.persons.length : 1;
    const selected = availableSlots.slice(startIndex, startIndex + needed);
    setSelectedTime(formData.isGroup ? selected : slot);
  };


  const isPast = (day) => {
    if (!day) return true;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);

    return dayStart < todayStart;
  };

  const getAvailabilityColor = (count) => {
    if (count >= 5) return 'available-high';    // Grün
    if (count >= 3) return 'available-medium';    // Gelb
    if (count >= 1) return 'available-low';    // Rot
    return 'available-none';                    // Grau
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { customerName, customerEmail, persons } = formData;
    if (!selectedDate || !selectedTime || !customerName || !customerEmail)
      return alert('Bitte alle Felder ausfüllen.');
    if (persons.some(p => !p.name || !p.serviceId)) return alert('Bitte alle Personen vollständig ausfüllen.');

    const dateString = selectedDate.toLocaleDateString('en-CA');

    // Wenn selectedTime ein Array ist (Gruppe), dann den ersten Slot auswählen
    const startTime = Array.isArray(selectedTime) ? selectedTime[0].time : selectedTime.time;

    const bookingData = {
      ...formData,
      date: dateString,
      time: startTime,
      userId: null
    };

    try {
      await axios.post('http://localhost:8080/api/appointments', bookingData);
      alert('Erfolgreich gebucht!');
      // Reset Formular etc.
      setStep(1);
      setFormData({
        customerName: '',
        customerEmail: '',
        isGroup: false,
        persons: [{ name: '', serviceId: '', notes: '' }],
        notes: ''
      });
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (err) {
      alert('Fehler: ' + (err.response?.data?.error || err.message));
    }
  };


  return (
    <div>
      <Breadcrumbs>
        <Step active={step === 1}>Datum wählen</Step>
        <Step active={step === 2}>Details</Step>
        <Step active={step === 3}>Uhrzeit</Step>
        <Step active={step === 4}>Übersicht</Step>
      </Breadcrumbs>

      {/* Schritt 1: Datum wählen */}
      {step === 1 && (
        <>
          <MonthTitle>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}><FaArrowLeft />  </button>
            <h2>{currentDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</h2>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>▶</button>
          </MonthTitle>
          <CalendarWrapper>
            {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map(day => <strong key={day}>{day}</strong>)}
            {getMonthDays(currentDate).map((day, index) => {
              const dateStr = day
                ? `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
                : null;

              const slots = monthAvailability[dateStr] || [];
              const availableSpots = slots.length ? slots.reduce((sum, slot) => sum + slot.availableSpots, 0) : 0;
              const dayColor = getAvailabilityColor(availableSpots);
              const disabled = !day || isPast(day) || availableSpots === 0;

              return (
                <Day
                  className={dayColor}
                  key={index}
                  disabled={disabled}
                  selected={selectedDate && day && day.toDateString() === selectedDate.toDateString()}
                  onClick={() => !disabled && setSelectedDate(day)}
                  title={`${availableSpots} freie Plätze`}
                >
                  {day ? day.getDate() : ''}
                </Day>
              );
            })}
          </CalendarWrapper>
          <Button onClick={() => setStep(2)} disabled={!selectedDate}>Weiter</Button>
        </>
      )}

      {/* Schritt 2: Details eingeben */}
      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Dein Name"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="E-Mail-Adresse"
            value={formData.customerEmail}
            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            required
          />

          <Switch
            checked={formData.isGroup}
            onChange={(e) => {
              const isGroup = e.target.checked;
              setFormData({
                ...formData,
                isGroup,
                persons: isGroup ? formData.persons : [formData.persons[0]]
              });
            }}
            label="Gruppentermin"
          />

          {formData.persons.map((person, index) => (
            <PersonForm
              key={index}
              index={index}
              person={person}
              services={services}
              onUpdate={(idx, field, value) => {
                const updated = [...formData.persons];
                updated[idx][field] = value;
                setFormData({ ...formData, persons: updated });
              }}
              onRemove={(idx) => {
                const updated = formData.persons.filter((_, i) => i !== idx);
                setFormData({ ...formData, persons: updated });
              }}
              canRemove={formData.persons.length > 1}
            />
          ))}

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


<SummaryWrapper>
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
</SummaryWrapper>
          

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
  );
}
