
import React from 'react';
import styled from 'styled-components';

const SwitchContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const SwitchTrack = styled.div`
  width: 50px;
  height: 24px;
  background-color: ${({ checked, theme }) => checked ? theme.accent : '#ccc'};
  border-radius: 12px;
  position: relative;
  transition: background-color 0.3s ease;
`;

const SwitchThumb = styled.div`
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: ${({ checked }) => checked ? '28px' : '2px'};
  transition: left 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const HiddenInput = styled.input`
  display: none;
`;

const SwitchLabel = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

export default function Switch({ checked, onChange, label }) {
  return (
    <SwitchContainer>
      <HiddenInput
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <SwitchTrack checked={checked}>
        <SwitchThumb checked={checked} />
      </SwitchTrack>
      <SwitchLabel>{label}</SwitchLabel>
    </SwitchContainer>
  );
}