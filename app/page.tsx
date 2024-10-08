"use client"

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion'
import { Camera, ArrowRight, Check, ChevronDown, Facebook, Twitter, Instagram, Palette, Sliders, Shield, ChevronLeft, ChevronRight, X } from 'lucide-react'
import styles from './page.module.css'
import VideoSection from './VideoSection';
import Footer from './Footer';


interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Do you keep my pictures?",
    answer: "Nope, We're all about privacy here."
  },
  {
    question: "Does this tool cost anything?",
    answer: "No, free as in \"no strings attached\"."
  },
  {
    question: "How many times can I use this tool?",
    answer: "As many as you want. Go crazy!!"
  }
]

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, toggleOpen }) => (
  <div className="mb-4">
    <button
      className="flex justify-between items-center w-full py-4 text-left focus:outline-none transition-colors duration-300 hover:text-[#c6ffb1]"
      onClick={toggleOpen}
    >
      <span className="text-base md:text-lg font-medium">{question}</span>
      <motion.svg
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="w-5 h-5 md:w-6 md:h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </motion.svg>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <p className="text-sm md:text-base text-gray-300 pt-2 pb-4">{answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }
  return (
    <section className="py-12 md:py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12">
        {/* <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12" style={{ fontFamily: 'Recoleta, serif' }}> */}
          Frequently <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c6ffb1] to-[#b4eef5]">Avoided</span> Questions
        </h2>
        <div className="max-w-2xl mx-auto">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              toggleOpen={() => toggleOpen(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface PricingCardProps {
  title: string;
  description: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex flex-col p-4 md:p-6 space-y-4 md:space-y-6 bg-gradient-to-br from-[#0c0c0c] to-[#000000] rounded-xl shadow-xl border-0.5 border-[#c6ffb1] overflow-hidden"
  >
    <h2 className="text-xl md:text-2xl font-bold text-[#c6ffb1] opacity-80 hover:opacity-100">
      {title}
    </h2>
    <p className="text-sm md:text-base text-white">{description}</p>
  </motion.div>
)

function PricingSection() {
  return (
    <section className="py-12 md:py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12"
          // className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12" style={{ fontFamily: 'Recoleta, serif' }}
        >
          <span className="bg-gradient-to-r from-[#c6ffb1] to-[#b4eef5] text-transparent bg-clip-text">Subscription Tiers:</span> From 'Ouch'<br className="hidden md:inline" />to 'Why did I Agree to This?'
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8" color='white'>
          <PricingCard
            title="Free Forever"
            description="No hidden fees, no fine print - because we're too lazy to charge you."
          />
          <PricingCard
            title="Pay What You Want"
            description="(Just kidding, It's Free) Because who needs money when you've got awesome images?"
          />
          <PricingCard
            title="Unlimited Free Plan"
            description="Imagine all the features, and now imagine not paying for any of them. That's it."
          />
        </div>
        <div className="mt-8 md:mt-16 text-center">
          <p className="text-lg md:text-xl text-[#c6ffb1] opacity-90">Still not convinced? Neither are we!</p>
          <motion.button onClick={() => window.location.href = "/dashboard"} 
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
            className="px-6 md:px-8 py-3 md:py-4 mt-4 text-base md:text-lg font-bold text-white bg-gradient-to-r from-[#000000] to-[#000000] border-2 border-[#c6ffb1] border-opacity-70 hover:border-opacity-100 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Go Wild Now!
          </motion.button>
        </div>
      </div>
    </section>
  )
}

interface ReviewData {
  text: string;
  author: string;
}

interface ReviewProps extends ReviewData {
  position: "center" | "left" | "right" | "hidden";
  onClick: () => void;
}

const reviews: ReviewData[] = [
  {
    text: "Honestly, I didn't expect it to be this good. it's hilarious how easy it is",
    author: "Alex P., Meme Creator"
  },
  {
    text: "I came for free tool, stayed for the ridiculously cool gradients!",
    author: "Jamie K., Digital Artist"
  },
  {
    text: "I love the instant magical suggestions, makes my life so much easier",
    author: "Chris W., Entrepreneur"
  },
  {
    text: "This tool has transformed how I present my images/ Screenshots - so easy & intuitive",
    author: "Sarah J., Graphic Designer"
  }
];

const Review: React.FC<ReviewProps> = ({ text, author, position, onClick }) => {
  const variants = {
    center: { 
      x: 0, 
      opacity: 1, 
      scale: 1, 
      zIndex: 3,
      transition: { duration: 0.5 }
    },
    left: { 
      x: "-50%", 
      opacity: 0.3, 
      scale: 0.9, 
      zIndex: 2,
      transition: { duration: 0.5 }
    },
    right: { 
      x: "50%", 
      opacity: 0.3, 
      scale: 0.9, 
      zIndex: 2,
      transition: { duration: 0.5 }
    },
    hidden: { 
      x: "100%", 
      opacity: 0, 
      scale: 0.8, 
      zIndex: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={position}
      onClick={onClick}
      className={`absolute top-0 left-0 right-0 p-6 md:p-10 mx-auto text-white bg-black rounded-lg shadow-lg w-full max-w-lg md:max-w-3xl lg:max-w-4xl cursor-pointer
                  ${position === 'center' ? 'pointer-events-none' : 'hover:opacity-80'}
                  before:content-[''] before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-[#c6ffb1] before:to-[#b4eef5] before:opacity-5 before:z-[-1]
                  after:content-[''] after:absolute after:inset-[-2px] after:rounded-lg after:bg-gradient-to-br after:from-[#c6ffb1] after:to-[#b4eef5] after:opacity-10 after:z-[-2]`}
    >
      <p className="mb-4 md:mb-6 text-base md:text-xl lg:text-2xl">{text}</p>
      <p className="text-sm md:text-lg lg:text-xl text-[#b4eef5]">- {author}</p>
    </motion.div>
  );
};

function ReviewSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleReviewClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  return (
    <div className="w-full md:py-4 bg-black text-white flex flex-col justify-center items-center p-10 md:p-10">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12">
      {/* <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12" style={{ fontFamily: 'Recoleta, serif' }}> */}
        Our <span className="bg-gradient-to-r from-[#c6ffb1] to-[#b4eef5] text-transparent bg-clip-text">Paid Actors</span> Say...
      </h2>
      <div className="relative w-full max-w-lg md:max-w-3xl lg:max-w-4xl h-52 md:h-64 lg:h-72">
        <AnimatePresence initial={false}>
          {reviews.map((review, index) => {
            let position = "hidden";
            if (index === currentIndex) position = "center";
            else if (index === (currentIndex - 1 + reviews.length) % reviews.length) position = "left";
            else if (index === (currentIndex + 1) % reviews.length) position = "right";

            return (
              <Review
                key={index}
                {...review}
                position={position as "center" | "left" | "right" | "hidden"}
                onClick={() => handleReviewClick(index)}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface Feature {
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    title: "So Easy, Your Grandma Could Do It",
    description: "Seriously, Upload, tweak, done - pro level edits with just a few clicks.",
  },
  {
    title: "All the tools, One Screen, No Nonsense",
    description: "Everything you need, right where you need it - no extra tabs, no fluff.",
  },
  {
    title: "See it before you believe it",
    description: "Instant edits, real-time results - what you see is what you get.",
  }
]

function FeaturesSection() {
  return (
    <section className="py-12 md:py-16 bg-black text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-16">
        {/* <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-16" style={{ fontFamily: 'Recoleta, serif' }}> */}
          Creative <span className="bg-gradient-to-r from-[#c6ffb1] to-[#b4eef5] text-transparent bg-clip-text">Superpowers</span>
        </h2>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 md:w-1 bg-gradient-to-b from-[#c6ffb1] via-[#b4eef5] to-[#c6ffb1] transform md:-translate-x-1/2"></div>
          {features.map((feature, index) => (
            <FeatureItem key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface FeatureItemProps {
  feature: Feature;
  index: number;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ feature, index }) => {
  return (
    <div className={`flex flex-col md:flex-row items-start md:items-center mb-12 md:mb-16`}>
      <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right order-1' : 'md:pl-12 md:text-left order-3'} mb-4 md:mb-0 pl-12 md:pl-0`}>
        <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">{feature.title}</h3>
        <p className="text-sm md:text-base text-gray-300">{feature.description}</p>
      </div>
      <div className="w-8 h-8 absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 flex items-center justify-center order-2">
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#c6ffb1] to-[#b4eef5] shadow-lg shadow-[#c6ffb1]/50"></div>
      </div>
      <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pl-12 order-3' : 'md:pr-12 order-1'}`}></div>
    </div>
  )
}

const benefits = [
  {
    title: "Magical Gradient Suggestions",
    description: "Who's got time to pick colors? Not you. Our tool auto-generates cool gradients based on your uploaded Image.",
    icon: Palette,
    color: "from-[#c6ffb1] to-[#b4eef5]"
  },
  {
    title: "Dynamic Customisation",
    description: "Adjust the thickness, shadow, padding, etc. to your heart's content. You're in charge here.",
    icon: Sliders,
    color: "from-[#c6ffb1] to-[#b4eef5]"
  },
  {
    title: "We don't care about your data",
    description: "Upload your image, tweak it, download it. That's it. We don't care who you are or what you upload. No login, No data storage, just image fun.",
    icon: Shield,
    color: "from-[#c6ffb1] to-[#b4eef5]"
  }
]

function BenefitsSection() {
  return (
    <section className="py-12 md:py-16 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12">
        {/* <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12" style={{ fontFamily: 'Recoleta, serif' }}> */}
          Why Choose <span className="bg-gradient-to-r from-[#c6ffb1] to-[#b4eef5] text-transparent bg-clip-text">ShotBeautifier</span>?
        </h2>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="relative bg-black bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#c6ffb1]/20 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-lg"></div>
              <div className="relative z-10">
                <div className={`w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-6 rounded-full bg-gradient-to-br ${benefit.color} flex items-center justify-center`}>
                  <benefit.icon className="w-6 h-6 md:w-8 md:h-8 text-black" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">{benefit.title}</h3>
                <p className="text-sm md:text-base text-gray-300">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const carouselLogos = Array(6).fill('/api/placeholder/150/30')

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.fadeInUp);
        }
      });
    }, { threshold: 0.1 });
  
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
  
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
  };
  
  return (
    <div className={`${styles.landingPage} min-h-screen bg-black text-white overflow-hidden`}>
      <header className={`${styles.header} fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-md`}>
        <div className="container mx-auto px-4 pt-6 flex justify-between items-center">
        <Link href="/" className={styles.logoContainer}>
          <img
            src="https://i.ibb.co/FB89yxf/New-Project-3-removebg-preview.png"
            alt="logo"
            width={50}
            height={50}
            className={styles.logo}
          />
        </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li><Link href="/" className="hover:text-[#c6ffb1] transition-colors">Home</Link></li>
              <li><a href="#benefits" onClick={() => scrollToSection('benefits')} className="hover:text-[#c6ffb1] transition-colors">Fancy Features</a></li>
              <li><a href="#reviews" onClick={() => scrollToSection('reviews')} className="hover:text-[#c6ffb1] transition-colors">Reviews</a></li>
              <li><a href="#faq" onClick={() => scrollToSection('faq')} className="hover:text-[#c6ffb1] transition-colors">FAQs</a></li>
              <li><a href="mailto:contact@shotbeautifier.com" className="hover:text-[#c6ffb1] transition-colors">Contact</a></li>
            </ul>
          </nav>
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-black z-50 md:hidden"
          >
            <div className="flex flex-col h-full p-4">
              <div className="flex justify-end">
                <button onClick={toggleMenu} className="text-white">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-grow flex items-center">
                <ul className="space-y-4 w-full">
                  <li><Link href="/" onClick={closeMenu} className="text-3xl hover:text-[#c6ffb1] transition-colors">Home</Link></li>
                  <li><a href="#benefits" onClick={() => scrollToSection('benefits')} className="text-3xl hover:text-[#c6ffb1] transition-colors">Fancy Features</a></li>
                  <li><a href="#reviews" onClick={() => scrollToSection('reviews')} className="text-3xl hover:text-[#c6ffb1] transition-colors">Reviews</a></li>
                  <li><a href="#faq" onClick={() => scrollToSection('faq')} className="text-3xl hover:text-[#c6ffb1] transition-colors">FAQs</a></li>
                  <li><a href="mailto:contact@shotbeautifier.com" onClick={closeMenu} className="text-3xl hover:text-[#c6ffb1] transition-colors">Contact</a></li>
                </ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section id="hero-section" className={`${styles.heroSection} min-h-screen bg-black text-white overflow-hidden flex flex-col justify-between`}>
        <div className="container w-full mx-auto pt-40 md:pt-40 lg:pt-52 pb-12 md:pb-12 text-center">
          <motion.h1 
            className="text-4xl pb-1.5 sm:text-5xl md:text-6xl lg:text-7xl mb-2 md:mb-8 leading-tight"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
          {/* <motion.h1 
            className="text-5xl pb-1.5 sm:text-5xl md:text-6xl lg:text-7xl mb-2 md:mb-8 leading-tight"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontFamily: 'Recoleta, serif' }}
          > */}
            Make Screenshot stand out with <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#c6ffb1] to-[#b4eef5] text-transparent bg-clip-text">
              Dynamic Effects
            </span> in Seconds!
          </motion.h1>
          <motion.p 
            className="text-sm pb-10 sm:text-base md:text-xl lg:text-xl mb-4 md:mb-10 text-gray-300 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            FREE - NO LOGIN NEEDED - just pure image magic and some serious cool vibes!
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 md:gap-4 mb-6 md:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative group w-full h-full sm:w-auto">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#c6ffb1] to-[#b4eef5] rounded-full opacity-65 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <Link href="/dashboard" className="relative w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 md:py-4 bg-black text-white text-md sm:text-base md:text-lg font-bold rounded-full transition-all duration-300 inline-block">
                Make My Shot Cool
              </Link>
            </div>
            <div className="relative group w-full sm:w-auto">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-65 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <a href="mailto:contact@shotbeautifier.com" className="relative w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 md:py-4 bg-black text-white text-md sm:text-base md:text-lg font-bold rounded-full transition-all duration-300 inline-block">
                Request a Feature
              </a>
            </div>
          </motion.div>
        </div>
        <VideoSection />
      </section>

      {/* <section className={`${styles.trustedBrands} py-8 md:py-12`}>
        <h2 className={`${styles.sectionTitle} text-2xl md:text-3xl mb-6 md:mb-8`}>Trusted by brands you know</h2>
        <div className={styles.carouselContainer}>
          <div className={styles.carousel}>
            {carouselLogos.concat(carouselLogos).map((logo, index) => (
              <div key={index} className={styles.carouselImg}>
                <Image src={logo} alt={`Brand ${index + 1}`} width={100} height={20} className={styles.brandLogo} />
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <section id="benefits" className="py-12 md:py-16 bg-black text-white relative overflow-hidden">
        <BenefitsSection />
      </section>

      <FeaturesSection />

      <section id="reviews" className="py-12 md:py-24 bg-black text-white flex flex-col justify-center items-center p-4 md:p-10">
        <ReviewSection />
      </section>

      <PricingSection />

      <section id="faq" className="py-12 md:py-16 bg-black text-white">
        <FAQSection />
      </section>

      {/* <footer className={`${styles.footer} py-8 md:py-12`}>
        <div className={`${styles.footerContent} container mx-auto px-4 flex flex-col md:flex-row justify-between`}>
          <div className={`${styles.footerBrand} mb-8 md:mb-0`}>
          <Link href="/" className={styles.logoContainer}>
            <img
              src="https://i.ibb.co/FB89yxf/New-Project-3-removebg-preview.png"
              alt="logo"
              width={80}
              height={80}
              className={styles.footerLogo}
            />
          </Link>
            <div className={`${styles.footerAddress} mt-4 text-sm`}>
              2 Lord Edward St,<br />
              D02 P634,<br />
              United States
            </div>
            <div className={`${styles.footerSocial} mt-4`}>
              <div className={`${styles.socialTitle} mb-2`}>Follow us</div>
              <div className={styles.socialIcons}>
                <Link href="#" aria-label="Facebook"><Facebook className={`${styles.socialIcon} w-6 h-6`} /></Link>
                <Link href="https://twitter.com/@pauls_freeman" aria-label="Twitter"><Twitter className={`${styles.socialIcon} w-6 h-6`} /></Link>
                <Link href="https://instagram.com/" aria-label="Instagram"><Instagram className={`${styles.socialIcon} w-6 h-6`} /></Link>
              </div>
            </div>
          </div>
          <div className={`${styles.footerLinks} grid grid-cols-2 gap-8`}>
            <div className={styles.footerLinkColumn}>
              <h2 className={`${styles.footerLinkTitle} text-lg font-semibold mb-4`}>Company</h2>
              <div className={`${styles.footerLinkList} space-y-2`}>
                <Link href="#" className={styles.footerLink}>Use cases</Link>
                <Link href="#" className={styles.footerLink}>Integrations</Link>
                <Link href="#" className={styles.footerLink}>Change logs</Link>
                <Link href="#" className={styles.footerLink}>Blogs</Link>
                <Link href="#" className={styles.footerLink}>Contact</Link>
              </div>
            </div>
            <div className={styles.footerLinkColumn}>
              <h2 className={`${styles.footerLinkTitle} text-lg font-semibold mb-4`}>Resources</h2>
              <div className={`${styles.footerLinkList} space-y-2`}>
                <Link href="#" className={styles.footerLink}>About us</Link>
                <Link href="#" className={styles.footerLink}>FAQ</Link>
                <Link href="#" className={styles.footerLink}>Contact Us</Link>
                <Link href="#" className={styles.footerLink}>Blogs</Link>
                <Link href="#" className={styles.footerLink}>Privacy policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer> */}

      <Footer />
    </div>
  )
}