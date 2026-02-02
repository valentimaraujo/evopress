'use client';

import Script from 'next/script';
import React from 'react';

import type { Post } from '@/core/services/posts.service';

import '../assets/styles/bootstrap.min.css';
import '../assets/styles/plugins.css';
import '../assets/styles/style.css';
import '../assets/styles/coloring.css';
import '../assets/styles/colors/scheme-01.css';

import { Footer } from './Footer';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: {
    recentPosts?: Post[];
  };
}

export function Layout({ children: _children, sidebar: _sidebar }: LayoutProps) {

  return (
    <div>
      {/* Original Theme Scripts */}
      <Script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/themes/gardyn/js/plugins.js"
        strategy="afterInteractive"
      />
      <Script
        src="/themes/gardyn/js/designesia.js"
        strategy="afterInteractive"
      />

      <div id="wrapper">
        <a href="#" id="back-to-top"></a>

        <div id="de-loader"></div>
        <Header />

        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          {_children}
        </div>

        <Footer />
      </div>

      {/* overlay content begin */}
      <div id="extra-wrap" className="text-light">
        <div id="btn-close">
          <span></span>
          <span></span>
        </div>

        <div id="extra-content">
          <img src="https://madebydesignesia.com/themes/gardyn/images/logo-white.webp" className="w-150px" alt="" />

          <div className="spacer-30-line"></div>

          <h5>Our Services</h5>
          <ul className="no-style">
            <li><a href="service-single.html">Garden Design</a></li>
            <li><a href="service-single.html">Garden Maintenance</a></li>
            <li><a href="service-single.html">Planting Services</a></li>
            <li><a href="service-single.html">Tree Care</a></li>
            <li><a href="service-single.html">Irrigation Services</a></li>
            <li><a href="service-single.html">Specialty Services</a></li>
          </ul>

          <div className="spacer-30-line"></div>

          <h5>Contact Us</h5>
          <div><i className="icofont-clock-time me-2 op-5"></i>Monday - Friday 08.00 - 18.00</div>
          <div><i className="icofont-location-pin me-2 op-5"></i>100 S Main St, New York, </div>
          <div><i className="icofont-envelope me-2 op-5"></i>contact@gardyn.com</div>

          <div className="spacer-30-line"></div>

          <h5>About Us</h5>
          <p>
            Transform your outdoor space with our expert garden services! From design to
            maintenance, we create beautiful, thriving gardens tailored to your vision. Let us
            bring your dream garden to life—professional, reliable, and passionate about nature.
          </p>

          <div className="social-icons">
            <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#"><i className="fa-brands fa-x-twitter"></i></a>
            <a href="#"><i className="fa-brands fa-instagram"></i></a>
            <a href="#"><i className="fa-brands fa-youtube"></i></a>
            <a href="#"><i className="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>
      </div>
      {/* overlay content end */}

      <div id="buy-now" className="show-on-scroll">
        <a className="btn-buy" href="https://themeforest.net/cart/configure_before_adding/54233145" target="_blank">
          Buy on <img src="https://madebydesignesia.com/themes/gardyn/demo/envato.png" className="" alt="" />
        </a>
      </div>
    </div>
  );
}



