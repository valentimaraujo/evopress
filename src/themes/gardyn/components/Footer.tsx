import React from 'react';

export function Footer() {
  return (
    <footer className="section-dark">
      <div className="container relative z-2">
        <div className="row gx-5">
          {/* Column 1: Logo and Description */}
          <div className="col-lg-4 col-sm-6">
            <img
              src="https://madebydesignesia.com/themes/gardyn/images/logo-white.webp"
              className="w-150px"
              alt="Gardyn Logo"
            />
            <div className="spacer-20"></div>
            <p>
              Transform your outdoor space with our expert garden services! From design to
              maintenance, we create beautiful, thriving gardens tailored to your vision. Let us
              bring your dream garden to life—professional, reliable, and passionate about nature.
            </p>

            <div className="social-icons mb-sm-30">
              <a href="#">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="col-lg-4 col-sm-12 order-lg-1 order-sm-2">
            <div className="row">
              <div className="col-lg-6 col-sm-6">
                <div className="widget">
                  <h5>Company</h5>
                  <ul>
                    <li>
                      <a href="/">Home</a>
                    </li>
                    <li>
                      <a href="/services">Our Services</a>
                    </li>
                    <li>
                      <a href="/projects">Projects</a>
                    </li>
                    <li>
                      <a href="/about">About Us</a>
                    </li>
                    <li>
                      <a href="/blog">Blog</a>
                    </li>
                    <li>
                      <a href="/contact">Contact</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 col-sm-6">
                <div className="widget">
                  <h5>Our Services</h5>
                  <ul>
                    <li>
                      <a href="/service-single">Garden Design</a>
                    </li>
                    <li>
                      <a href="/service-single">Garden Maintenance</a>
                    </li>
                    <li>
                      <a href="/service-single">Planting Services</a>
                    </li>
                    <li>
                      <a href="/service-single">Tree Care</a>
                    </li>
                    <li>
                      <a href="/service-single">Irrigation Services</a>
                    </li>
                    <li>
                      <a href="/service-single">Specialty Services</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Contact Info */}
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
                <div className="de-flex-col">Copyright 2024 - Gardyn by Designesia</div>
                <ul className="menu-simple">
                  <li>
                    <a href="#">Terms & Conditions</a>
                  </li>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Image */}
      <img
        src="https://madebydesignesia.com/themes/gardyn/images/misc/silhuette-1-black.webp"
        className="abs bottom-0 op-3"
        alt=""
      />
    </footer>
  );
}
