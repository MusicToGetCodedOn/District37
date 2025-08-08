import React, { useEffect, useState } from 'react';
import ExportCsvButton from './ExportCsvButton';
import styled, { useTheme } from 'styled-components';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';



const ChartGrid = styled(CartesianGrid)`
  stroke: ${({ theme }) => theme.text};
`;



const RevenueChart = () => {
  const [data, setData] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Kein Token vorhanden, bitte als Admin anmelden.');
          return;
        }

        const res = await axios.get(`http://localhost:8080/api/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const appointments = res.data;

        // Heutiges Datum minus 30 Tage
        const startDate = dayjs().subtract(29, 'day').startOf('day');

        // Einnahmen pro Tag berechnen
        const revenueMap = {};
        for (let i = 0; i < 30; i++) {
          const date = startDate.add(i, 'day').format('YYYY-MM-DD');
          revenueMap[date] = 0;
        }

        appointments.forEach(appt => {
          const dateStr = dayjs(appt.date).format('YYYY-MM-DD');
          if (revenueMap[dateStr] !== undefined) {
            revenueMap[dateStr] += appt.price || 0; // hier gehst du davon aus, dass `price` im Termin enthalten ist
          }
        });

        const chartData = Object.keys(revenueMap).map(date => ({
          date,
          revenue: revenueMap[date]
        }));

        setData(chartData);
      } catch (err) {
        console.error('Fehler beim Laden der Einnahmen:', err);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <div style={{ width: '100%', height: 400, marginTop: '2rem' }}>
      <h3>Einnahmen der letzten 30 Tage</h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <ChartGrid />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={theme.accent}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      <ExportCsvButton data={data} />

    </div>
  );
};

export default RevenueChart;
