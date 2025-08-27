// components/PersonForm.jsx
import React from 'react';
import styled from 'styled-components';
import { FaTrash } from 'react-icons/fa';

const Wrapper = styled.div`
  width: 60%;
  justify-self: center; 
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.surface};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.body};
`;


const Input = styled.input`
  width: 80%;
  align-items: center;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.card};
  opacity: 0.8;
  border: 2px solid ${({ theme }) => theme.border};

  &:focus {
    outline: none;
    box-shadow: 0 0 4px 4px ${({ theme }) => theme.primary}66;
  }
`;

const Select = styled.select`
  width: 80%;
  align-items: center;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.card};
  opacity: 0.8;
  border: 2px solid ${({ theme }) => theme.border};

  &:focus {
    outline: none;
    box-shadow: 0 0 4px 4px ${({ theme }) => theme.primary}66;
  }
`;

const Textarea = styled.textarea`
  width: 80%;
  align-items: center;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.card};
  opacity: 0.8;
  border: 2px solid ${({ theme }) => theme.border};

  &:focus {
    outline: none;
    box-shadow: 0 0 4px 4px ${({ theme }) => theme.primary}66;
  }
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

const Option = styled.option`
  padding: 0.6rem 0.8rem;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.card};
  border: none;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.primaryhover}22;
  }

  &:checked {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.body};
  }
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
        <Option value="">Service wählen</Option>
        {services.map(service => (
          <Option key={service._id} value={service._id}>
            {service.name} – {service.price}€
          </Option>
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
