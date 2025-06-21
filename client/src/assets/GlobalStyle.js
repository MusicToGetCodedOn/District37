import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    transition: background 0.3s ease, color 0.3s ease;
  }

  button, input {
    font-family: inherit;
  }

  .shadow {
    background-color: ${({ theme }) => theme.card}
  }
    .textp{
    margin-top: 10%;
    background-color: ${({ theme }) => theme.nav};
    border-radius: 8px;
}
    .textp:hover{
    box-shadow}

    .bookbutton{
    padding: 0.75rem 1.5rem;
    margin-top: 2%;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.accent};
  color: white;
  transition: background-color 0.3s ease, transform 0.2s ease;
  text-decoration: none;

  &:hover {
    background-color: ${({ theme }) => theme.accent + 'cc'}; // leicht transparenter
    transform: translateY(-2px);
    color: #fff
  }

  &:active {
    transform: translateY(0);
  }


  .locationsection{
  padding: 2rem
  background-color:${({theme}) => theme.card}
  align-text: center
  }
  .mapcontainer{
  margin-top: 1rem
  width: 100%
  maxWidth: 800px
  margin: 0 auto}

  

  `;



