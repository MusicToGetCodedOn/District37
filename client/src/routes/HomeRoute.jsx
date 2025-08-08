import { GlobalStyle } from "../assets/GlobalStyle";
import AboutSection from "../components/AboutSection";
import Angebote from "../components/Angebote";
import ImageSlider from "../components/ImageSlider";
import LocationSection from "../components/LocationSection";
import Styles from "../routes/HomeRoute.module.css"





export default function HomeRoute() {

    return (
        <>
            <GlobalStyle />
            <main>
                <div>
                    <h1>Welcome to District37</h1>
                </div>
                <div className={Styles.container}>
                    <ImageSlider />
                    <AboutSection />
                </div>
                <div className={Styles.container2}>
                    <Angebote />
                    <LocationSection />
                </div>

            </main>
        </>
    )

}