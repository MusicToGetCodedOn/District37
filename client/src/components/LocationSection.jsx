import { GlobalStyle } from "../assets/GlobalStyle";
import styled from "styled-components";

    const StyledSection = styled.section`
`


export default function LocationSection(){

return (
    <>
        <GlobalStyle/>
            <section className='locationsection'>
                <div className='mapcontainer'>
                    <iframe 
                    title="Google maps"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2724.370498823837!2d7.431749311416853!3d46.93475687101572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478e39b4c79e33e3%3A0x660d766e3a2f33df!2sMorillonstrasse%2032%2C%203007%20Bern!5e0!3m2!1sde!2sch!4v1750421234783!5m2!1sde!2sch"
                    width='100%'
                    height="300"
                    style={{border: 0}}
                    allowFullScreen=""
                    loading="lazy"></iframe>
                </div>
            </section>
    </>
)
}