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

  .abouttext {
  display: block;
  justify-content: center;
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

  .cancelbutton{
      padding: 0.75rem 1.5rem;
    margin-top: 2%;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background-color: #d25858;
    color: white;
    transition: background-color 0.3s ease, transform 0.2s ease;
    text-decoration: none;
    }

    .cancelbutton:hover {
    background-color:red;
    transform: translateY(-2px);
    color: #fff;
  }

  .cancelbutton:active {
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
  border-radius:8px;
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

.servicecard{
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
}

.servicecontainer{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
  }

.servicesection{
  padding: 2rem;
  text-align: center;
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
  border-radius:8px;
  padding: 10%;
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
.inputfield {
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

//Skeletonloaders
.skeletonservice { 
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


//Buttons
.login {
  background-color: ${({ theme }) => theme.nav};
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0%;
    height: 2px;
    background: ${({ theme }) => theme.accent};
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
}

.themetoggler {
  background-color: ${({ theme }) => theme.nav};
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1.3rem;

  &:hover {
    color: ${({ theme }) => theme.accent};
  }
}




//header
.headercontainer {
  background-color: ${({ theme }) => theme.nav};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 10;
  border-radius: 30px;
  width: 1200px;
}

.navlink {
 text-decoration: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  font-weight: 600;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0%;
    height: 2px;
    background: ${({ theme }) => theme.accent};
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
}
.logo {
  font-size: 2rem;
  color: ${({ theme }) => theme.accent};
  margin: 0;
  }

.nav {
  display: flex;
  gap: 2rem;
  align-items: center;
  }¨


.new-badge {
  background-color: #ff4d4f;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  margin-left: 8px;
  border-radius: 4px;
  vertical-align: middle;
}


`;
