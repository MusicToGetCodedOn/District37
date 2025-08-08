// components/PersonForm.jsx
import React from 'react';
import styled from 'styled-components';
import { FaTrash } from 'react-icons/fa';

const Wrapper = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.surface};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.body};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 0.5rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 0.5rem;
`;

const RemoveButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
`;

export default function PersonForm({ index, person, services, onUpdate, onRemove, canRemove }) {
  return (
    <Wrapper>
      <h4>Person {index + 1}</h4>
      <Input
        type="text"
        placeholder="Name"
        value={person.name}
        onChange={(e) => onUpdate(index, 'name', e.target.value)}
        required
      />
      <Select
        value={person.serviceId}
        onChange={(e) => onUpdate(index, 'serviceId', e.target.value)}
        required
      >
        <option value="">Service wählen</option>
        {services.map(service => (
          <option key={service._id} value={service._id}>
            {service.name} – {service.price}€
          </option>
        ))}
      </Select>
      <Textarea
        placeholder="Notizen (optional)"
        value={person.notes}
        onChange={(e) => onUpdate(index, 'notes', e.target.value)}
      />
      {canRemove && (
        <RemoveButton type="button" onClick={() => onRemove(index)}>
          <FaTrash /> Entfernen
        </RemoveButton>
      )}
    </Wrapper>
  );
}
