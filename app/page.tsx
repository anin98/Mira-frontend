"use client";

import React from 'react';
import Header from './components/header';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import Stats from './components/Stats';
import Contact from './components/Contact';
import Footer from './components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      {/* <Stats /> */}
      <Features />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;