export function generateICS({ customerName, date, time, persons, isGroup }) {
  // Basic ICS header/footer
  const CRLF = '\r\n';

  // Helper to format date/time as YYYYMMDDTHHmmssZ (UTC)
  const formatDateTime = (dateStr, timeStr) => {
    // dateStr is "YYYY-MM-DD"
    // timeStr is "HH:mm"
    // We'll parse local time and convert to UTC format

    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);
    const dt = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
    // Format YYYYMMDDTHHmmssZ
    const pad = (n) => (n < 10 ? '0' + n : n);
    return (
      dt.getUTCFullYear().toString() +
      pad(dt.getUTCMonth() + 1) +
      pad(dt.getUTCDate()) +
      'T' +
      pad(dt.getUTCHours()) +
      pad(dt.getUTCMinutes()) +
      '00Z'
    );
  };

  const start = formatDateTime(date, time);

  // Event duration: 30 minutes * number of persons if group, else 30 minutes
  const durationMinutes = isGroup ? persons.length * 30 : 30;
  const endDateObj = new Date(new Date(date + 'T' + time).getTime() + durationMinutes * 60000);
  const end = formatDateTime(
    endDateObj.toISOString().split('T')[0],
    endDateObj.toTimeString().slice(0, 5)
  );

  // UID for calendar event
  const uid = `appointment-${Date.now()}@district37.local`;

  // Description build with persons & notes
  let description = `Termin bei District 37 mit ${customerName}.`;
  if (isGroup) {
    description += CRLF + 'Teilnehmer:' + CRLF;
    persons.forEach((p, i) => {
      description += `- ${p.name}, Service: ${p.serviceName}`;
      if (p.notes && p.notes.trim()) {
        description += `, Notizen: ${p.notes.trim()}`;
      }
      description += CRLF;
    });
  }

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//District 37//Terminbuchung//DE',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:Termin bei District 37`,
    `DESCRIPTION:${description}`,
    'LOCATION:District 37 - Ihre Adresse hier',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join(CRLF);
}
