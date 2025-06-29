
import React from 'react';
import styled from 'styled-components';

const PersonContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.accent};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: ${({ theme }) => theme.card};
`;

const PersonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PersonTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.2rem;
  
  &:hover {
    color: #cc0000;
  }
`;

const Input = styled.input`
  width: 94%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
`;

export default function PersonForm({ person, index, services, onUpdate, onRemove, canRemove }) {
  return (
    <PersonContainer>
      <PersonHeader>
        <PersonTitle>Person {index + 1}</PersonTitle>
        {canRemove && (
          <RemoveButton onClick={() => onRemove(index)}>
            ×
          </RemoveButton>
        )}
      </PersonHeader>
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
            {service.name} - {service.price} .-
          </option>
        ))}
      </Select>
    </PersonContainer>
  );
}