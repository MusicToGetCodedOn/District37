import React, { useState, useEffect } from "react";
import haircut1 from '../assets/haircut1.jpg';
import haircut2 from '../assets/haircut2.jpg';
import haircut3 from '../assets/haircut3.jpg';
import { motion, AnimatePresence } from "framer-motion";
const images = [haircut1, haircut2, haircut3];

export default function ImageSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence mode="wait">
            <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt="Barber Shop"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                style={{
                    width: '300px', height: '400px', objectFit: 'cover'
                }}
            />
        </AnimatePresence>

    );
}


