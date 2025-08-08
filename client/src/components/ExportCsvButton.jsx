import React from 'react';
import Papa from 'papaparse';

export default function ExportCsvButton({ data }) {
  const handleExport = () => {
    const csv = Papa.unparse(data); // erzeugt CSV-String aus data

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;

    // Dateiname mit aktuellem Monat (z.B. "Umsatz-2025-08.csv")
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    link.setAttribute('download', `Umsatz-${year}-${month}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleExport}>
      CSV herunterladen
    </button>
  );
}
