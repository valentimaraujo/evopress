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
          <section className="bg-dark section-dark text-light no-top no-bottom overflow-hidden">
            <div className="container-fluid position-relative half-fluid">
              <div className="container">
                <div className="row">

                  <div className="col-lg-6 position-lg-absolute right-half h-100">
                    <div className="de-gradient-edge-top dark"></div>
                    <div
                      className="image"
                      data-bgimage="url(https://madebydesignesia.com/themes/gardyn/images/background/6.webp) center"
                    ></div>

                    <div className="abs bg-color-2 p-3 py-3 bottom-0 start-0 w-120px text-center m-5 z-2 rounded-1 wow fadeIn" data-wow-delay=".5s">
                      <h2 className="fs-72 mb-1">25</h2>
                      <div className="fw-500 text-uppercase lh-1-5 fs-12">
                        Year of Experience
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 relative">
                    <div className="me-lg-3">
                      <div className="spacer-double"></div>
                      <div className="spacer-double sm-hide"></div>
                      <div className="spacer-single sm-hide"></div>
                      <div className="subtitle s2 mb-3 wow fadeInUp" data-wow-delay=".0s">Outdoor Elegance</div>
                      <h1 className="text-uppercase wow fadeInUp" data-wow-delay=".2s">Beautiful Garden <span className="id-color-2">Our Expertise</span></h1>
                      <p className="wow fadeInUp" data-wow-delay=".4s">Transform your outdoor space with our expert garden services! From design to maintenance, we create beautiful, thriving gardens tailored to your vision. Let us bring your dream garden to life—professional, reliable, and passionate about nature.</p>

                      <ul className="ul-style-2 fw-600 text-white mb-4 wow fadeInUp" data-wow-delay=".6s">
                        <li>Sustainable Landscaping Practices</li>
                        <li>Tailored Design and Solutions</li>
                        <li>Competitive and Transparent Pricing</li>
                      </ul>

                      <a className="btn-main btn-line wow fadeInUp" data-wow-delay=".8s" href="contact.html">Get In Touch</a>
                      <div className="spacer-double"></div>
                      <div className="spacer-single sm-hide"></div>
                    </div>

                    <img src="https://madebydesignesia.com/themes/gardyn/images/logo-wm.webp" className="abs end-0 bottom-0 z-2 w-40" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="container relative z-1">
              <div className="row g-4 gx-5 align-items-center">
                <div className="col-lg-6">
                  <div className="row g-4">
                    <div className="col-sm-6">
                      <div className="row g-4">
                        <div className="col-lg-12">
                          <div className=" rounded-1 overflow-hidden wow zoomIn">
                            <img src="https://madebydesignesia.com/themes/gardyn/images/misc/3.webp" className="w-100 wow scaleIn" alt="" />
                          </div>
                        </div>

                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="row g-4">
                        <div className="spacer-single sm-hide"></div>

                        <div className="col-lg-12">
                          <div className=" rounded-1 overflow-hidden wow zoomIn" data-wow-delay=".3s">
                            <img src="https://madebydesignesia.com/themes/gardyn/images/misc/4.webp" className="w-100 wow scaleIn" alt="" data-wow-delay=".3s" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="subtitle id-color wow fadeInUp" data-wow-delay=".2s">Welcome to Gardyn</div>
                  <h2 className="text-uppercase wow fadeInUp" data-wow-delay=".4s">Crafting Living <span className="id-color-2">Masterpieces</span></h2>
                  <p className="wow fadeInUp" data-wow-delay=".6s">At Gardyn, we’re passionate about turning your garden into a true reflection of your personal style and a haven for relaxation and enjoyment. Whether you’re dreaming of a vibrant floral display, a serene outdoor retreat, or a stunning landscape transformation.</p>
                  <a className="btn-main wow fadeInUp" href="services.html" data-wow-delay=".6s">Our Services</a>
                </div>
              </div>
            </div>

          </section>

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



