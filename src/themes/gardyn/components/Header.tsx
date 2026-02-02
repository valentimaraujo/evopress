'use client';

import { useEffect } from 'react';

import { Menu } from './Menu';
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
                <Menu location="header" />
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
