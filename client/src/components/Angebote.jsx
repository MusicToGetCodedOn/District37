import styled, { ThemeProvider, useTheme } from 'styled-components';
import { GlobalStyle } from '../assets/GlobalStyle';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const services = [
  { title: "Haarschnitt", desc: "Modern oder klassisch – perfekt gestylt.", price: "15.-" },
  { title: "Bartpflege", desc: "Sauber, scharf und gepflegt.", price: "10.-" },
  { title: "Kombi-Angebot", desc: "Haircut + Beard Trim", price: "25.-" },
];

// Section styling
const StyledSection = styled.section`
  padding: 2rem;
  background-color: none;
  text-align: center;
`;

// Container for the row of cards
const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
  background-color:none;
`;

// Card styling
const StyledCard = styled.div`
  width: 250px;
  padding: 1.5rem;
  border-radius: 12px;  
  transition: background-color 0.3s ease, color 0.3s ease;

  h3 {
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.3rem 0;
  }
`;


export default function Angebote() {

    return (
        <>
            <GlobalStyle />
            <StyledSection>
                <h2>Unsere Leistungen</h2>
                <StyledDiv>
                {services.map((service, i) => (
                    <StyledCard key={i} className='shadow'>
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                    <p><strong>{service.price}</strong></p>
                    </StyledCard>
                ))}
                </StyledDiv>
                <br />
                <br />
                <Link to="/appointment" className='bookbutton'>Buchen</Link>
            </StyledSection>
        </>
    );
}
