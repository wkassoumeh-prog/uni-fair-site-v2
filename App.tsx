
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import WhyExhibit from './components/WhyExhibit';
import ForVisitors from './components/ForVisitors';
import ExhibitorRegistration from './components/ExhibitorRegistration';
import Sponsors from './components/Sponsors';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Stats from './components/Stats';
import FeaturedUniversities from './components/FeaturedUniversities';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Threshold for header transition (typically the height of the hero)
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={isScrolled} />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <About />
        <WhyExhibit />
        <ForVisitors />
        <ExhibitorRegistration />
        <FeaturedUniversities />
        <Sponsors />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
