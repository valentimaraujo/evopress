import Link from 'next/link';
import React from 'react';

import { getAppVersionFormatted } from '@/core/utils/app-version';

export function Footer() {
  return (
    <footer className="section-dark">
      <div className="container relative z-2">
        <div className="row gx-5">
          {/* Coluna 1: Logo e Descrição */}
          <div className="col-lg-4 col-sm-6">
            <img src="/images/logo-white.webp" className="w-150px" alt="EvoPress Logo" />
            <div className="spacer-20"></div>
            <p>
              Transform your outdoor space with our expert garden services! From design to
              maintenance, we create beautiful, thriving gardens tailored to your vision. Let us
              bring your dream garden to life—professional, reliable, and passionate about nature.
            </p>

            <div className="social-icons mb-sm-30">
              <a href="#" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" aria-label="YouTube">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="#" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </div>

          {/* Coluna 2: Links */}
          <div className="col-lg-4 col-sm-12 order-lg-1 order-sm-2">
            <div className="row">
              <div className="col-lg-6 col-sm-6">
                <div className="widget">
                  <h5>Company</h5>
                  <ul>
                    <li>
                      <Link href="/">Home</Link>
                    </li>
                    <li>
                      <Link href="/services">Our Services</Link>
                    </li>
                    <li>
                      <Link href="/projects">Projects</Link>
                    </li>
                    <li>
                      <Link href="/about">About Us</Link>
                    </li>
                    <li>
                      <Link href="/blog">Blog</Link>
                    </li>
                    <li>
                      <Link href="/contact">Contact</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 col-sm-6">
                <div className="widget">
                  <h5>Our Services</h5>
                  <ul>
                    <li>
                      <Link href="/service/garden-design">Garden Design</Link>
                    </li>
                    <li>
                      <Link href="/service/maintenance">Garden Maintenance</Link>
                    </li>
                    <li>
                      <Link href="/service/planting">Planting Services</Link>
                    </li>
                    <li>
                      <Link href="/service/tree-care">Tree Care</Link>
                    </li>
                    <li>
                      <Link href="/service/irrigation">Irrigation Services</Link>
                    </li>
                    <li>
                      <Link href="/service/specialty">Specialty Services</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 3: Informações de Contato */}
          <div className="col-lg-4 col-sm-6 order-lg-2 order-sm-1">
            <div className="widget">
              <div className="fw-bold text-white">
                <i className="icofont-clock-time me-2 id-color-2"></i>We're Open
              </div>
              Monday - Friday 08.00 - 18.00
              <div className="spacer-20"></div>
              <div className="fw-bold text-white">
                <i className="icofont-location-pin me-2 id-color-2"></i>Office Location
              </div>
              100 S Main St, New York, NY
              <div className="spacer-20"></div>
              <div className="fw-bold text-white">
                <i className="icofont-envelope me-2 id-color-2"></i>Send a Message
              </div>
              contact@gardyn.com
            </div>
          </div>
        </div>
      </div>

      {/* Subfooter */}
      <div className="subfooter">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="de-flex">
                <div className="de-flex-col">
                  Copyright {new Date().getFullYear()} - EvoPress {getAppVersionFormatted()}
                </div>
                <ul className="menu-simple">
                  <li>
                    <Link href="/terms">Terms & Conditions</Link>
                  </li>
                  <li>
                    <Link href="/privacy">Privacy Policy</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


