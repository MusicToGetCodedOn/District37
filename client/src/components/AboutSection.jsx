import React from "react";
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle } from "../assets/GlobalStyle";




const StyledSection = styled.section`
background-color: ${({ theme }) => theme.body}
color: ${({ theme }) => theme.text}`



export default function AboutSection ({ darkMode }){

  
  return (
    <>
      <GlobalStyle />
        <StyledSection className="textp">
          <p > 
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
              Natus magni minima iusto obcaecati dolor ipsa ducimus veritatis perspiciatis adipisci blanditiis, 
              laboriosam maxime voluptatibus perferendis optio inventore, id aliquid! Dolores, saepe.
          </p>
        </StyledSection>
      
    </>
  );
};
