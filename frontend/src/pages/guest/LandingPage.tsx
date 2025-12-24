import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Input } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { SearchData } from '../../types/common.types';

const LandingPage: React.FC = () => {
  const history = useHistory();

  const handleBookNow = (): void => {
    history.push('/customer/search');
  };

  const handleExplore = (): void => {
    history.push('/customer/search');
  };

  return (
    <div className="relative w-full min-h-screen bg-white font-sans">
      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[149px] bg-transparent">
        <div className="max-w-[1497px] mx-auto px-[213px] h-full flex justify-between items-center">
          {/* Logo */}
          <div className="bg-gold px-5 py-3 flex flex-col items-center justify-center">
            <span className="font-serif font-bold text-[40px] leading-[48px] tracking-[0.15em] text-primary">
              LUXURY
            </span>
            <span className="font-serif font-bold text-[15px] leading-[18px] tracking-[0.6em] text-primary">
              HOTELS
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex gap-[60px] items-center">
            <a href="#home" className="text-white text-[25px] leading-[30px] font-bold relative after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-[85px] after:h-[2px] after:bg-white">
              Home
            </a>
            <a href="#facilities" className="text-white text-[25px] leading-[30px] font-normal">
              Facilities
            </a>
            <a href="#rooms" className="text-white text-[25px] leading-[30px] font-normal">
              Rooms
            </a>
            <a href="#contact" className="text-white text-[25px] leading-[30px] font-normal">
              Contact-us
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        id="home"
        className="relative w-full h-screen bg-cover bg-center flex items-center justify-start px-[213px]"
        style={{
          backgroundImage: 'linear-gradient(rgba(20, 39, 74, 0.5), rgba(20, 39, 74, 0.5)), url(https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&h=1080&fit=crop)',
        }}
      >
        <div className="max-w-[698px] text-white z-10">
          <p className="font-sans font-normal text-[50px] leading-[61px] mb-5">WELCOME TO</p>
          <h1 className="font-serif font-bold text-[154px] leading-[185px] tracking-[0.07em] mb-5">
            LUXURY
          </h1>
          <h2 className="font-serif font-bold text-[60px] leading-[72px] tracking-[0.4em] mb-5">
            HOTELS
          </h2>
          <p className="font-sans font-normal text-[25px] leading-[30px] tracking-[0.1em] mb-10">
            Book your stay and enjoy Luxury redefined at the most affordable rates.
          </p>
          <Button
            type="primary"
            size="large"
            onClick={handleBookNow}
            className="bg-gold border-gold hover:bg-gold/90 h-auto py-4 px-8 text-white font-bold text-[25px] leading-[30px] rounded-none"
          >
            BOOK NOW
          </Button>
          
          {/* Scroll Indicator */}
          <div className="mt-16 flex flex-col items-center gap-3">
            <span className="text-white font-bold text-[25px] leading-[30px] tracking-[0.05em]">
              Scroll
            </span>
            <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-xl">
              ↓
            </div>
          </div>
        </div>
      </section>

      {/* Breakfast Banner */}
      <div className="w-full py-20 text-center bg-white">
        <h2 className="font-sans font-normal text-[36px] leading-[44px] text-primary max-w-4xl mx-auto">
          All our room types are including complementary breakfast
        </h2>
      </div>

      {/* Luxury Redefined Section */}
      <section className="w-full py-20 px-[7.89%] bg-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="w-1 h-16 bg-primary mb-4"></div>
            <h3 className="font-serif font-bold text-[60px] leading-[72px] tracking-[0.02em] text-primary">
              Luxury redefined
            </h3>
            <p className="font-sans font-normal text-[25px] leading-[40px] text-primary">
              Our rooms are designed to transport you into an environment made for leisure. 
              Take your mind off the day-to-day of home life and find a private paradise for yourself.
            </p>
            <Button
              type="primary"
              size="large"
              onClick={handleExplore}
              className="bg-gold border-gold hover:bg-gold/90 h-auto py-3.5 px-8 text-white font-normal text-[20px] leading-[24px] tracking-[0.05em] rounded-none"
            >
              EXPLORE
            </Button>
          </div>

          {/* Image */}
          <div className="relative w-full h-[500px] overflow-hidden rounded-lg shadow-lg">
            <div className="absolute inset-0 bg-primary/20 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop" 
              alt="Luxury hotel room"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Leave Your Worries Section */}
      <section className="w-full py-20 px-[7.89%] bg-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative w-full h-[500px] overflow-hidden rounded-lg shadow-lg">
            <div className="absolute inset-0 bg-primary/20 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop" 
              alt="Beautiful beach"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <div className="w-1 h-16 bg-primary mb-4"></div>
            <h3 className="font-serif font-bold text-[60px] leading-[72px] tracking-[0.02em] text-primary">
              Leave your worries in the sand
            </h3>
            <p className="font-sans font-normal text-[25px] leading-[40px] text-primary">
              We love life at the beach. Being close to the ocean with access to endless sandy beach 
              ensures a relaxed state of mind. It seems like time stands still watching the ocean.
            </p>
            <Button
              type="primary"
              size="large"
              onClick={handleExplore}
              className="bg-gold border-gold hover:bg-gold/90 h-auto py-3.5 px-8 text-white font-normal text-[20px] leading-[24px] tracking-[0.05em] rounded-none"
            >
              EXPLORE
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-24 px-10 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif font-bold text-[60px] leading-[72px] text-primary mb-16">
            Testimonials
          </h2>
          <p className="font-sans font-normal italic text-[30px] leading-[37px] text-primary mb-6">
            "Calm, Serene, Retro – What a way to relax and enjoy"
          </p>
          <p className="font-sans font-normal text-[25px] leading-[30px] text-primary mb-8">
            Mr. and Mrs. Baxter, UK
          </p>
          <div className="flex justify-center gap-5">
            <Button
              shape="circle"
              size="large"
              className="w-[50px] h-[50px] bg-gold border-gold hover:bg-gold/90 flex items-center justify-center"
              icon={<ArrowLeftOutlined className="text-white" />}
            />
            <Button
              shape="circle"
              size="large"
              className="w-[50px] h-[50px] bg-gold border-gold hover:bg-gold/90 flex items-center justify-center"
              icon={<ArrowRightOutlined className="text-white" />}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-primary text-white py-16 px-[185px]">
        <div className="max-w-[1549px] mx-auto grid grid-cols-4 gap-10">
          {/* Column 1: Logo & Contact */}
          <div className="space-y-6">
            <div className="flex flex-col items-start">
              <span className="font-serif font-bold text-[25px] leading-[30px] tracking-[0.15em]">
                LUXURY
              </span>
              <span className="font-serif font-bold text-[9px] leading-[11px] tracking-[0.6em]">
                HOTELS
              </span>
            </div>
            <div className="font-sans font-normal text-[14px] leading-[17px] space-y-3 text-white/90">
              <p>497 Evergreen Rd. Roseville, CA 95673</p>
              <p>+44 345 678 903</p>
              <p>luxury.hotels@gmail.com</p>
            </div>
          </div>

          {/* Column 2: About Us */}
          <div className="space-y-4">
            <h4 className="font-sans font-normal text-[18px] leading-[20px] mb-5">
              About Us
            </h4>
            <a href="#contact" className="block font-sans font-normal text-[14px] leading-[20px] text-white/90 hover:text-white">
              Contact
            </a>
            <a href="#terms" className="block font-sans font-normal text-[14px] leading-[20px] text-white/90 hover:text-white">
              Terms & Conditions
            </a>
          </div>

          {/* Column 3: Social Media */}
          <div className="space-y-4">
            <h4 className="font-sans font-normal text-[18px] leading-[20px] mb-5">
              Social Media
            </h4>
            <div className="font-sans font-normal text-[16px] leading-[31px] text-white/90 space-y-2">
              <a href="#" className="block hover:text-white">Facebook</a>
              <a href="#" className="block hover:text-white">Twitter</a>
              <a href="#" className="block hover:text-white">Instagram</a>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="font-sans font-normal text-[18px] leading-[20px] mb-5">
              Subscribe to our newsletter
            </h4>
            <div className="flex gap-2">
              <Input
                placeholder="Email Address"
                className="flex-1 bg-transparent border-2 border-gold text-white placeholder:text-white/60"
              />
              <Button
                type="primary"
                className="bg-gold border-gold hover:bg-gold/90 text-primary font-normal text-[16px] leading-[20px] px-6"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
