import AboutSection from "../components/AboutSection";
import ImageSlider from "../components/ImageSlider";
import Styles from "../routes/HomeRoute.module.css"

        
    



export default function HomeRoute() {
    
    return(
        <main>
        <div>
            <h1>Welcome to District37</h1>
        </div>
            <div className={Styles.container}>
                
                
                <ImageSlider className={Styles.item} />
                <AboutSection className={Styles.item} />

            </div>
      
        </main>
    )

}