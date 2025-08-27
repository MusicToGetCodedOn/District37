// components/Switch.jsx
import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
  display: flex;
  justify-content: center;
  margin-right: 40%;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;
  font-weight: bold;
  transition: all 0.3s ease;
  color: ${({ theme }) => theme.text};
`;

const Toggle = styled.input`
  accent-color: ${({ theme }) => theme.primary};
  transform: scale(1.3);
  transition: transform 0.2s ease;

  &:checked {
    transform: scale(1.5);
    box-shadow: 0 0 4px 2px ${({ theme }) => theme.primary}66;
  }
`;

export default function Switch({ checked, onChange, label }) {
  return (
    <Label>
      <Toggle type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </Label>
  );
}
