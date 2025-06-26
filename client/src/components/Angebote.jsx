import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


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
  const isNewService = (createdAt) => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffInDays = (now - createdDate) / (1000 * 60 * 60 * 24);
  return diffInDays < 7;
};

  return (
    <>
      <div className='servicesection'>
        <h2>Unsere Leistungen</h2>
        <div className='servicecontainer'>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <div className="skeletonservice" key={i}><h3></h3><p></p><p></p></div>)
            : services.map((service, i) => (
                <div className='servicecard' key={service._id || i}>
                  <h3>
                    {service.name}
                    {isNewService(service.createdAt) && (
                      <span style={{
                        backgroundColor: '#ff4d4f',
                        color: 'white',
                        fontSize: '0.7rem',
                        padding: '2px 6px',
                        marginLeft: '8px',
                        borderRadius: '4px',
                        verticalAlign: 'middle',
                      }}>
                        Neu
                      </span>
                    )}
                  </h3>
                  <p>{service.desc}</p>
                  <p><strong>{service.price} .-</strong></p>
                </div>
              ))
          }
        </div>
        <br />
        <br />
        <Link to="/appointment" className='bookbutton'>Jetzt Buchen</Link>
      </div>
    </>
  );
}
