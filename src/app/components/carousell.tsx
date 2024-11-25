"use client";
import React, { useState, useEffect } from "react";
import styles from "./components.module.css"; // Crie um arquivo CSS para o carrossel, ou ajuste a importação de estilos existente

type CarouselProps = {
  items: {
    image: string;
    title: string;
    description: string;
    donationGoals: string[];
  }[];
};

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevItem = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    const interval = setInterval(nextItem, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentItem = items[currentIndex];

  return (
    <div className={styles.carousel}>
      {/* Indicators */}
      <div className={styles.indicators}>
        {items.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>

      {/* Navigation buttons */}
      <button className={styles.navButton} onClick={prevItem}>
        &lt;
      </button>
      <div
        className={styles.imageTrain}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <img key={index} src={item.image} alt={item.title} />
        ))}
      </div>
      <button className={styles.navButton} onClick={nextItem}>
        &gt;
      </button>

      {/* Overlay content */}
      <div className={styles.overlay}>
        <h2 className={styles.title}>{currentItem.title}</h2>
        <p className={styles.description}>{currentItem.description}</p>
        <div className={styles.donationGoals}>
          {currentItem.donationGoals.map((goal, index) => (
            <p key={index}>{goal}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;