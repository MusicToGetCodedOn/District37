import React from "react";
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.nav};
  color: ${({ theme }) => theme.text};
  padding: 2rem 1rem;
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.border};
  margin-top: 2rem;
`;

const SocialLinks = styled.div`
  margin-bottom: 1rem;
`;

const SocialIcon = styled.a`
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
  margin: 0 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const ImpressumLink = styled.a`
  color: ${({ theme }) => theme.text};
  text-decoration: underline;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const Footer = () =>{
    return (
         <FooterContainer>
      <SocialLinks>
        <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter"></i>
        </SocialIcon>
        <SocialIcon href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook-f"></i>
        </SocialIcon>
        <SocialIcon href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram"></i>
        </SocialIcon>
        <SocialIcon href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-linkedin-in"></i>
        </SocialIcon>
      </SocialLinks>
      <p>
        &copy; {new Date().getFullYear()} Dein Unternehmen. Alle Rechte vorbehalten.
        <br />
        <ImpressumLink href="/impressum">Impressum</ImpressumLink>
      </p>
    </FooterContainer>
    );
};

export default Footer;