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
    background-color: ${({ theme }) => theme.card};
  }

  .textp {
    margin-top: 10%;
    background-color: ${({ theme }) => theme.nav};
    border-radius: 8px;
  }

  .textp:hover {
    box-shadow: 0px 4px 8px rgba(0,0,0,0.2); /* Optionaler Hover-Shadow */
  }

  .bookbutton {
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
  }

  .bookbutton:hover {
    background-color: ${({ theme }) => theme.accent + 'cc'};
    transform: translateY(-2px);
    color: #fff;
  }

  .bookbutton:active {
    transform: translateY(0);
  }

  .locationsection {
    padding: 2rem;
    background-color: ${({ theme }) => theme.card};
    text-align: center;
  }

  .mapcontainer {
    margin-top: 1rem;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

 /* Kalender Container */


//ServiceList
.service-list-container {
  padding: 2rem;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text}
}

.service-list-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  background: ${({ theme }) => theme.body};
  border: none;
  color:${({ theme }) => theme.accent};
}

.add-button {
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.accent};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.add-button:hover {
  background-color: ${({ theme }) => theme.accenthover};
}

.service-table {
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.body};
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}

.service-table th,
.service-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-button,
.delete-button {
  border: none;
  background:  ${({ theme }) => theme.card};
  cursor: pointer;
  font-size: 1rem;
  color: ${({ theme }) => theme.accent};
}

.edit-button:hover {
  color: ${({ theme }) => theme.body};
  background: #8fa3ff; 
}

.delete-button:hover {
  color: ${({ theme }) => theme.body};
  background: #d25858
}

.no-results {
  text-align: center;
  color: #888;
}


//forms
.inputfield{
width: 90%;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  transition: border-color 0.3s ease;
  }

 .formcontainer{
 display: block;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
background-color: ${({ theme }) => theme.nav};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 100%;
  transition: all 0.3s ease;
  }
`;
