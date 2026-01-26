"use client";

import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Hero from '../../../components/Hero';
import About from '../../../components/About';
import WhyExhibit from '../../../components/WhyExhibit';
import ForVisitors from '../../../components/ForVisitors';
import ExhibitorRegistration from '../../../components/ExhibitorRegistration';
import Sponsors from '../../../components/Sponsors';
import FAQ from '../../../components/FAQ';
import Contact from '../../../components/Contact';
import Stats from '../../../components/Stats';
import Countdown from '../../../components/Countdown';
import FeaturedUniversities from '../../../components/FeaturedUniversities';
import Footer from '../../../components/Footer';
import { getCopy } from '../../../content/getCopy';

const locale = 'en';
const copy = getCopy(locale);

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
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
      <Header isScrolled={isScrolled} locale={locale} copy={copy} />
      <main className="flex-grow">
        <Hero locale={locale} copy={copy} />
        {/* <Stats /> */}
        <Countdown copy={copy} />
        <About locale={locale} copy={copy} />
        <WhyExhibit locale={locale} copy={copy} />
        <ForVisitors copy={copy} />
        <ExhibitorRegistration locale={locale} copy={copy} />
        {/* <FeaturedUniversities /> */}
        <Sponsors copy={copy} />
        <FAQ locale={locale} copy={copy} />
        <Contact copy={copy} />
      </main>
      <Footer copy={copy} />
    </div>
  );
}
