// components/Switch.jsx
import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;
  font-weight: bold;
`;

const Toggle = styled.input`
  accent-color: ${({ theme }) => theme.primary};
  transform: scale(1.3);
`;

export default function Switch({ checked, onChange, label }) {
  return (
    <Label>
      <Toggle type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </Label>
  );
}
