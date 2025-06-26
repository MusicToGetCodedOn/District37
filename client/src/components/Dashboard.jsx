import React, { useState } from 'react';
import ServiceList from './ServiceList';
import ServiceForm from './ServiceForm';
import AppointmentList from './AppointmentList';

const Dashboard = () => {
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setReloadFlag(!reloadFlag);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>

      {showForm ? (
        <ServiceForm
          initialData={editingService}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          <ServiceList
            key={reloadFlag} 
            onEdit={handleEdit}
            onCreate={handleCreate}
          />
          <h3 style={{ marginTop: '2rem' }}>Terminübersicht</h3>
          <AppointmentList />
        </>
      )}
    </div>
  );
};

export default Dashboard;