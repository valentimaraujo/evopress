'use client';

import { useEffect } from 'react';

import { Topbar } from "./Topbar";

export function Header() {
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      // Debounce with requestAnimationFrame
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Media query - desktop only (matching original)
          const mq = window.matchMedia("(min-width: 1200px)");
          if (!mq.matches) {
            ticking = false;
            return;
          }

          const header = document.querySelector('header');
          const topbar = document.getElementById('topbar');
          if (!header) {
            ticking = false;
            return;
          }

          // Use pageYOffset as in original
          const distanceY = window.pageYOffset || document.documentElement.scrollTop;
          const shrinkOn = 0; // Correct threshold from original!

          if (distanceY > shrinkOn) {
            // Add smaller class
            if (!header.classList.contains('smaller')) {
              header.classList.add('smaller');
            }

            // Topbar with inline transition (as original does)
            if (topbar && topbar.style.marginTop !== '-47px') {
              topbar.style.transition = 'margin-top 0.5s ease, overflow 0.5s ease';
              topbar.style.marginTop = '-47px';
              topbar.style.overflow = 'hidden';
            }
          } else {
            // Remove smaller class
            if (header.classList.contains('smaller')) {
              header.classList.remove('smaller');
            }

            // Topbar returns
            if (topbar && topbar.style.marginTop !== '0px') {
              topbar.style.transition = 'margin-top 0.5s ease, overflow 0.5s ease';
              topbar.style.marginTop = '0';
              topbar.style.overflow = 'visible';
            }
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    // Passive scroll for performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="transparent">
      <Topbar />
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="de-flex sm-pt10">
              <div className="de-flex-col">

                <div id="logo">
                  <a href="index.html">
                    <img className="logo-main" src="https://madebydesignesia.com/themes/gardyn/images/logo-white.webp" alt="" />
                    <img className="logo-mobile" src="https://madebydesignesia.com/themes/gardyn/images/logo-white.webp" alt="" />
                  </a>
                </div>
              </div>
              <div className="de-flex-col header-col-mid">

                <ul id="mainmenu">
                  <li><a className="menu-item" href="services.html">Services</a>
                    <ul>
                      <li><a href="services.html">All Services</a></li>
                      <li><a href="service-single.html">Service Single</a></li>
                      <li><a href="pricing-plans.html">Pricing Plans</a></li>
                      <li><a href="price-list.html">Price List</a></li>
                    </ul>
                  </li>
                  <li><a className="menu-item" href="projects.html">Projects</a>
                    <ul>
                      <li><a href="projects.html">Projects Default</a></li>
                      <li><a href="projects-2.html">Projects 3 Columns</a></li>
                      <li><a href="projects-3.html">Projects Parallax</a></li>
                      <li><a href="projects-4.html">Projects Carousel</a></li>
                      <li><a href="project-single.html">Project Single</a></li>
                    </ul>
                  </li>
                  <li><a className="menu-item" href="#">Pages</a>
                    <ul>
                      <li><a href="about.html">About Us</a></li>
                      <li><a href="team.html">Our Team</a></li>
                      <li><a href="gallery.html">Gallery</a></li>
                      <li><a href="gallery-carousel.html">Gallery Carousel</a></li>
                    </ul>
                  </li>
                  <li><a className="menu-item" href="shop-homepage.html">Shop</a></li>
                  <li><a className="menu-item" href="blog.html">Blog</a></li>
                  <li><a className="menu-item" href="contact.html">Contact</a></li>
                </ul>

              </div>
              <div className="de-flex-col">
                <div className="menu_side_area">
                  <a href="contact.html" className="btn-main btn-line">Get In Touch</a>
                  <span id="menu-btn"></span>
                </div>

                <div id="btn-extra">
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
