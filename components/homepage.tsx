'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Import local images
import logoImg from '../assets/logo/logo.png';
import dashboardImg from '../assets/images/home/dashboard.png';
import googleLogo from '../assets/images/brand-logos/google.svg';
import microsoftLogo from '../assets/images/brand-logos/microsoft.svg';
import adobeLogo from '../assets/images/brand-logos/adobe.svg';
import airbnbLogo from '../assets/images/brand-logos/airbnb.svg';
import stripeLogo from '../assets/images/brand-logos/stripe.svg';
import redditLogo from '../assets/images/brand-logos/reddit.svg';
import sampleImg from '../assets/images/home/sample.jpg';
import womanImg from '../assets/images/people/women.jpg';
import manImg from '../assets/images/people/man.jpg';
import man2Img from '../assets/images/people/man2.jpg';

// Header Component
const Header: React.FC = () => {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsHeaderCollapsed(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleHeader = () => {
    setIsHeaderCollapsed(!isHeaderCollapsed);
  };

  return (
    <header className="absolute top-0 z-20 flex h-[60px] w-full bg-opacity-0 px-[5%] lg:justify-around">
      <Link href="/" className="h-[50px] w-[50px] p-[4px]">
        <Image 
          src={logoImg} 
          alt="logo" 
          width={50} 
          height={50} 
          className="object-contain" 
          sizes="(max-width: 768px) 40px, 50px"
        />
      </Link>
      
      <div id="collapsed-header-items" className={`collapsible-header animated-collapse max-lg:tw-shadow-md ${isHeaderCollapsed ? 'tw-w-0' : 'tw-w-60vw'}`}>
        <nav className="tw-flex tw-h-full tw-w-max tw-gap-5 tw-text-base max-lg:tw-mt-[30px] max-lg:tw-flex-col max-lg:tw-place-items-end max-lg:tw-gap-5 lg:tw-mx-auto lg:tw-place-items-center">
          <Link href="/about" className="header-links">About us</Link>
          <Link href="#pricing" className="header-links">Pricing</Link>
          <Link href="/solutions" className="header-links">Solutions</Link>
          <Link href="/features" className="header-links">Features</Link>
          <Link href="/company" className="header-links">Company</Link>
        </nav>
        
        <div className="tw-mx-4 tw-flex tw-place-items-center tw-gap-[20px] tw-text-base max-md:tw-w-full max-md:tw-flex-col max-md:tw-place-content-center">
          <Link href="/signup" className="tw-rounded-full tw-bg-white tw-px-3 tw-py-2 tw-text-black tw-transition-transform tw-duration-[0.3s] hover:tw-translate-x-2" aria-label="signup">
            Get started
          </Link>
        </div>
      </div>
      
      <button onClick={toggleHeader} className="tw-text-white lg:tw-hidden">
        {isHeaderCollapsed ? 'Menu' : 'Close'}
      </button>
    </header>
  );
};

// Hero Section Component
const HeroSection: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <section id="hero-section" className="section hero-section tw-relative tw-flex tw-min-h-[100vh] tw-w-full tw-max-w-[100vw] tw-flex-col tw-overflow-hidden max-md:tw-mt-[50px]">
      <div className="tw-flex tw-h-full tw-min-h-[100vh] tw-w-full tw-flex-col tw-place-content-center tw-gap-6 tw-p-[5%] max-xl:tw-place-items-center max-lg:tw-p-4">
        <motion.div
          ref={ref}
          animate={controls}
          initial="hidden"
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 100 },
          }}
          transition={{ duration: 0.5 }}
          className="tw-flex tw-flex-col tw-place-content-center tw-items-center"
        >
          <h1 className="gradient-text tw-text-center tw-text-6xl tw-font-semibold tw-uppercase tw-leading-[80px] max-lg:tw-text-4xl max-md:tw-leading-snug">
            Ship more <br />with SaaS templates
          </h1>
          <p className="tw-mt-10 tw-max-w-[450px] tw-p-2 tw-text-center tw-text-gray-300 max-lg:tw-max-w-full">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit Lorem ipsum dolor sit amet.
          </p>
          <div className="tw-mt-10 tw-flex tw-place-items-center tw-gap-4">
            <Link href="/get-started" className="btn tw-bg-[#7e22ce85] tw-shadow-lg tw-shadow-primary tw-transition-transform tw-duration-[0.3s] hover:tw-scale-x-[1.03]">
              Get started
            </Link>
            <Link href="/learn-more" className="btn tw-flex tw-gap-2 !tw-bg-black !tw-text-white tw-transition-colors tw-duration-[0.3s] hover:!tw-bg-white hover:!tw-text-black">
              Learn more
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          animate={controls}
          initial="hidden"
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 100 },
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          id="dashboard-container"
          className="relative mt-8 flex w-full place-content-center place-items-center"
        >
          <div id="dashboard" className="relative w-full max-w-[80%] overflow-hidden rounded-xl bg-transparent max-md:max-w-full">
            <Image 
              src={dashboardImg} 
              alt="dashboard" 
              width={1200} 
              height={675} 
              className="h-auto w-full object-cover opacity-90"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
          <div className="hero-img-bg-grad absolute left-[20%] top-5 h-[200px] w-[200px]"></div>
        </motion.div>
      </div>
    </section>
  );
};

// Trusted Brands Component
const TrustedBrands: React.FC = () => {
    const brands = [
      { name: 'Google', logo: googleLogo },
      { name: 'Microsoft', logo: microsoftLogo },
      { name: 'Adobe', logo: adobeLogo },
      { name: 'Airbnb', logo: airbnbLogo },
      { name: 'Stripe', logo: stripeLogo },
      { name: 'Reddit', logo: redditLogo },
    ];
  
    return (
      <section className="section relative flex w-full max-w-[100vw] flex-col place-content-center place-items-center overflow-hidden p-8">
        <h2 className="reveal-up text-3xl max-md:text-xl">Trusted by brands you know</h2>
        <div className="reveal-up carousel-container">
          <div className="carousel lg:w-place-content-center mt-6 flex w-full gap-5 max-md:gap-2">
            {brands.map((brand, index) => (
              <div key={index} className="carousel-img h-[30px] w-[150px]">
                <Image 
                  src={brand.logo} 
                  alt={brand.name} 
                  width={150} 
                  height={30} 
                  className="h-full w-full object-contain grayscale transition-colors hover:grayscale-0" 
                  sizes="(max-width: 768px) 100px, 150px"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

// Key Benefits Component
const KeyBenefits: React.FC = () => {
    const benefits = [
      {
        title: 'Minimize hours spent',
        description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
        image: sampleImg,
      },
      {
        title: 'Simple to use',
        description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
        image: sampleImg,
      },
      {
        title: 'Speed up your development',
        description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
        image: sampleImg,
      },
    ];
  
    return (
      <section className="section relative flex w-full max-w-[100vw] flex-col place-content-center place-items-center overflow-hidden p-6">
        <h2 className="reveal-up text-4xl font-medium text-gray-200 max-md:text-3xl">Key benefits</h2>
        <div className="mt-6 flex max-w-[80%] flex-wrap place-content-center gap-8 max-lg:flex-col">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex h-[400px] w-full max-w-[450px] flex-col gap-3 text-center max-md:w-[320px]"
            >
              <div className="border-gradient h-[200px] w-full overflow-hidden max-md:h-[150px]">
                <Image 
                  src={benefit.image} 
                  alt={benefit.title} 
                  width={450} 
                  height={200} 
                  className="h-full w-full object-cover" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 450px"
                />
              </div>
              <div className="flex flex-col gap-4 p-2">
                <h3 className="mt-8 text-2xl font-normal max-md:text-xl">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };

// Features Component
const Features: React.FC = () => {
  const features = [
    { title: 'Global', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi quasi consequuntur, distinctio' },
    { title: 'Insights', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi quasi consequuntur, distinctio laboriosam' },
    { title: 'Cloud backup', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi quasi consequuntur, distinctio laboriosam' },
    { title: '2 Factor Authentication', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi quasi consequuntur, distinctio laboriosam' },
    { title: '3rd party integrations', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi quasi consequuntur, distinctio laboriosam' },
    { title: 'Advanced configurations', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi quasi consequuntur, distinctio laboriosam' },
  ];

  return (
    <section className="section tw-relative tw-flex tw-min-h-[80vh] tw-w-full tw-max-w-[100vw] tw-flex-col tw-place-content-center tw-place-items-center tw-overflow-hidden tw-p-6">
      <h2 className="reveal-up tw-text-4xl tw-font-medium tw-text-gray-200 max-md:tw-text-2xl">Features loved by everyone</h2>
      <div className="tw-mt-6 tw-flex tw-max-w-[80%] tw-flex-wrap tw-place-content-center tw-gap-8 max-lg:tw-flex-col">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="tw-flex tw-h-[200px] tw-w-[450px] tw-gap-8 tw-rounded-xl tw-border-[1px] tw-border-outlineColor tw-bg-secondary tw-p-8 max-md:tw-w-[320px]"
          >
            <div className="tw-flex tw-flex-col tw-gap-4">
              <h3 className="tw-text-2xl max-md:tw-text-xl">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// Pricing Component (continued)
const Pricing: React.FC = () => {
    const plans = [
      { name: 'Basic', price: 9, features: ['Lorem ipsum dolor sit amet.', 'Lorem, ipsum.', 'Lorem, ipsum dolor.', 'Lorem ipsum dolor sit.'] },
      { name: 'Pro', price: 19, features: ['Lorem ipsum dolor sit amet.', 'Lorem, ipsum.', 'Lorem, ipsum dolor.', 'Lorem ipsum dolor sit.'] },
      { name: 'Enterprise', price: 49, features: ['Lorem ipsum dolor sit amet.', 'Lorem, ipsum.', 'Lorem, ipsum dolor.', 'Lorem ipsum dolor sit.'] },
    ];
  
    return (
      <section id="pricing" className="section tw-mt-5 tw-flex tw-w-full tw-flex-col tw-place-items-center tw-p-[2%]">
        <h2 className="tw-text-3xl tw-font-medium tw-text-gray-300 max-md:tw-text-2xl">Simple pricing</h2>
        <div className="tw-mt-10 tw-flex tw-flex-wrap tw-place-content-center tw-gap-8 max-lg:tw-flex-col">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`reveal-up tw-flex tw-w-[380px] tw-flex-col tw-place-items-center tw-gap-2 tw-rounded-lg tw-border-[1px] tw-border-outlineColor tw-bg-secondary tw-p-8 tw-shadow-xl max-lg:tw-w-[320px] ${index === 1 ? 'tw-border-2 tw-border-primary' : ''}`}
            >
              <h3 className="tw-text-5xl tw-font-semibold">${plan.price}<span className="tw-text-2xl tw-text-gray-400">/mo</span></h3>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, explicabo!</p>
              <hr className="tw-w-full" />
              <ul className="tw-mt-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="tw-mb-2">• {feature}</li>
                ))}
              </ul>
              <Link href={`/signup/${plan.name.toLowerCase()}`} className="btn tw-mt-8 !tw-w-full tw-transition-transform tw-duration-[0.3s] hover:tw-scale-x-[1.02]">
                Get now
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };
  
  // Testimonials Component
  const Testimonials: React.FC = () => {
    const testimonials = [
      { name: 'Trich B', role: 'AMI, CEO', image: womanImg, text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae, vero.' },
      { name: 'John B', role: 'ABC, CTO', image: manImg, text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore deserunt delectus consectetur enim cupiditate ab nemo voluptas repellendus qui quas.' },
      { name: 'Mante', role: 'XYZ, CTO', image: man2Img, text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, numquam.' },
      { name: 'Lara', role: 'XZ, CTO', image: womanImg, text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta, saepe illum. Dicta quisquam praesentium quod!' },
      { name: 'James', role: 'App, CTO', image: manImg, text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga accusamus non enim debitis rem neque beatae explicabo corrupti porro ullam?' },
      { name: 'Ron', role: 'Marketplace, CTO', image: man2Img, text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga accusamus non enim debitis rem neque beatae explicabo corrupti porro ullam?' },
    ];
  
    return (
      <section className="section mt-5 flex min-h-[80vh] w-full flex-col place-content-center place-items-center p-[2%]">
        <h2 className="text-4xl font-medium text-gray-200 max-md:text-2xl">You're in good hands</h2>
        <div className="mt-8 gap-10 space-y-8 max-md:columns-1 lg:columns-2 xl:columns-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="reveal-up flex h-fit w-full max-w-[350px] break-inside-avoid flex-col gap-4 rounded-lg border-[1px] border-outlineColor bg-secondary p-4 max-lg:w-[320px]"
            >
              <p>{testimonial.text}</p>
              <div className="flex place-items-center gap-3">
                <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                  <Image 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    width={50} 
                    height={50} 
                    className="h-full w-full object-cover" 
                    sizes="50px"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };
  
  // FAQ Component
  const FAQ: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
    const faqs = [
      { question: "What license are the source code?", answer: "All the templates are under MIT license" },
      { question: "Can I request new templates?", answer: "You can request a generic template from Github template request. If you are looking for Custom design you should contact here" },
      { question: "I need a custom template?", answer: "If you are looking for Custom design you can contact here" },
      { question: "Will you add new templates?", answer: "New templates are added every Friday. So star ⭐️ Github" },
    ];
  
    const toggleFAQ = (index: number) => {
      setActiveIndex(activeIndex === index ? null : index);
    };
  
    return (
      <section className="section tw-flex tw-w-full tw-flex-col tw-place-content-center tw-place-items-center tw-gap-[10%] tw-p-[5%] tw-px-[10%]">
        <h2 className="tw-text-4xl tw-font-medium tw-text-gray-300 max-md:tw-text-2xl">FAQ</h2>
        <div className="tw-mt-5 tw-flex tw-min-h-[300px] tw-w-full tw-max-w-[850px] tw-flex-col tw-gap-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{ height: activeIndex === index ? 'auto' : '60px' }}
              className="faq tw-w-full tw-rounded-md tw-border-[1px] tw-border-solid tw-border-[#1F2123] tw-bg-[#080808]"
            >
              <div
                className="faq-accordion tw-flex tw-w-full tw-select-none tw-text-xl max-md:tw-text-lg"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
              </div>
              <motion.div
                initial={false}
                animate={{ opacity: activeIndex === index ? 1 : 0 }}
                className="content"
              >
                {faq.answer}
              </motion.div>
            </motion.div>
          ))}
        </div>
        <div className="tw-mt-20 tw-flex tw-flex-col tw-place-items-center tw-gap-4">
          <p className="tw-text-3xl max-md:tw-text-2xl">Still have questions?</p>
          <Link href="/contact" className="btn !tw-rounded-full !tw-border-[1px] !tw-border-solid !tw-border-gray-300 !tw-bg-transparent tw-transition-colors tw-duration-[0.3s]">
            Contact
          </Link>
        </div>
      </section>
    );
  };
  
  // Newsletter Component
  const Newsletter: React.FC = () => {
    const [email, setEmail] = useState('');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Handle newsletter signup logic here
      console.log('Newsletter signup:', email);
      setEmail('');
    };
  
    return (
      <section className="section tw-flex tw-w-full tw-flex-col tw-place-content-center tw-place-items-center tw-gap-[10%] tw-p-[5%] tw-px-[10%] max-md:tw-px-2">
        <div className="tw-flex tw-w-full tw-max-w-[80%] tw-place-content-center tw-place-items-center tw-justify-between tw-gap-3 tw-rounded-lg tw-border-[1px] tw-border-outlineColor tw-bg-secondary tw-p-6 max-md:tw-max-w-full max-md:tw-flex-col">
          <div className="tw-flex tw-flex-col tw-gap-1">
            <h2 className="tw-text-3xl tw-text-gray-300 max-md:tw-text-xl">Join our newsletter</h2>
            <p className="tw-text-gray-300">Lorem ipsum dolor sit.</p>
          </div>
          <form onSubmit={handleSubmit} className="tw-flex tw-h-[60px] tw-place-items-center tw-gap-2 tw-overflow-hidden tw-p-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="tw-h-full tw-rounded-l-full tw-bg-transparent tw-px-4 tw-text-white tw-outline-none"
              required
            />
            <button type="submit" className="btn !tw-rounded-full !tw-border-[1px] !tw-border-solid !tw-border-gray-300 !tw-bg-transparent tw-transition-colors tw-duration-[0.3s]">
              Signup
            </button>
          </form>
        </div>
      </section>
    );
  };
  
  // Footer Component
  const Footer: React.FC = () => {
    return (
      <footer className="bg-secondary py-10">
        <div className="container mx-auto flex flex-wrap justify-between px-4">
          <div className="flex h-full w-[250px] flex-col place-items-center gap-6 max-md:w-full">
            <Image 
              src={logoImg} 
              alt="logo" 
              width={120} 
              height={120} 
              className="max-w-[120px]" 
              sizes="(max-width: 768px) 80px, 120px"
            />
            <div>
              2 Lord Edward St,<br />
              D02 P634,<br />
              United States
            </div>
            <div className="tw-mt-3 tw-text-lg tw-font-semibold">Follow us</div>
            <div className="tw-flex tw-gap-4 tw-text-2xl">
              <Link href="#" aria-label="Facebook">FB</Link>
              <Link href="https://twitter.com/@pauls_freeman" aria-label="Twitter">TW</Link>
              <Link href="https://instagram.com/" className="tw-h-[40px] tw-w-[40px]" aria-label="Instagram">IG</Link>
            </div>
          </div>
          
          <div className="tw-flex tw-h-full tw-w-[250px] tw-flex-col tw-gap-4">
            <h3 className="tw-text-3xl max-md:tw-text-xl">Company</h3>
            <div className="tw-flex tw-flex-col tw-gap-3 max-md:tw-text-sm">
              <Link href="/use-cases" className="footer-link">Use cases</Link>
              <Link href="/integrations" className="footer-link">Integrations</Link>
              <Link href="/changelog" className="footer-link">Change logs</Link>
              <Link href="/blog" className="footer-link">Blogs</Link>
              <Link href="/contact" className="footer-link">Contact</Link>
            </div>
          </div>
          
          <div className="tw-flex tw-h-full tw-w-[250px] tw-flex-col tw-gap-4">
            <h3 className="tw-text-3xl max-md:tw-text-xl">Resources</h3>
            <div className="tw-flex tw-flex-col tw-gap-3 max-md:tw-text-sm">
              <Link href="/about" className="footer-link">About us</Link>
              <Link href="/faq" className="footer-link">FAQ</Link>
              <Link href="/contact" className="footer-link">Contact Us</Link>
              <Link href="/blog" className="footer-link">Blogs</Link>
              <Link href="/privacy-policy" className="footer-link">Privacy policy</Link>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  // Main HomePage Component
  const HomePage: React.FC = () => {
    return (
      <div className="bg-black text-white">
        <Header />
        <main>
          <HeroSection />
          <TrustedBrands />
          <KeyBenefits />
          <Features />
          <Pricing />
          <Testimonials />
          <FAQ />
          <Newsletter />
        </main>
        <Footer />
      </div>
    );
  };
  
  export default HomePage;