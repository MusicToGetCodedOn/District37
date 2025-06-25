import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { GlobalStyle } from '../assets/GlobalStyle';
import { Link } from 'react-router-dom';

// Styled Components
const StyledSection = styled.section`
  padding: 2rem;
  text-align: center;
`;

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
`;

const StyledCard = styled.div`
  width: 250px;
  padding: 1.5rem;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.card};
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: background-color 0.3s ease, transform 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.accent};
    transform: translateY(-3px);
  }

  h3 {
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.3rem 0;
  }
`;

// Skeleton Styles
const SkeletonCard = styled(StyledCard)`
  background-color: #e2e2e2;
  animation: pulse 1.5s infinite ease-in-out;

  h3, p {
    background-color: #ccc;
    border-radius: 4px;
    height: 1em;
    width: 80%;
    margin: 0.5rem auto;
  }

  p:last-child {
    width: 50%;
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
  }
`;

export default function Angebote() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('/api/services');
        setServices(res.data);
      } catch (err) {
        console.error('Fehler beim Laden der Services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      <GlobalStyle />
      <StyledSection>
        <h2>Unsere Leistungen</h2>
        <StyledDiv>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i}><h3></h3><p></p><p></p></SkeletonCard>)
            : services.map((service, i) => (
                <StyledCard key={service._id || i}>
                  <h3>{service.name}</h3>
                  <p>{service.desc}</p>
                  <p><strong>{service.price} .-</strong></p>
                </StyledCard>
              ))
          }
        </StyledDiv>
        <br />
        <br />
        <Link to="/appointment" className='bookbutton'>Jetzt Buchen</Link>
      </StyledSection>
    </>
  );
}
