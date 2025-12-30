'use client';

import Link from 'next/link';
import React from 'react';

import { useHeaderSticky } from '../hooks/useHeaderSticky';
import { useMobileMenu } from '../hooks/useMobileMenu';
import { Menu } from './Menu';
import { Topbar } from './Topbar';

export function Header() {
  const isSticky = useHeaderSticky(50);
  const { isOpen, toggle } = useMobileMenu();

  return (
    <header className={`transparent ${isSticky ? 'smaller' : ''}`}>
      <Topbar
        phone="Monday - Friday 08.00 - 18.00"
        address="100 S Main St, New York, NY"
        email="contact@gardyn.com"
        socialLinks={{
          facebook: '#',
          twitter: '#',
          instagram: '#',
          youtube: '#',
        }}
      />

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="de-flex sm-pt10">
              {/* Logo */}
              <div className="de-flex-col">
                <div id="logo">
                  <Link href="/">
                    <img className="logo-main" src="/images/logo-white.webp" alt="EvoPress Logo" />
                    <img
                      className="logo-mobile"
                      src="/images/logo-white.webp"
                      alt="EvoPress Logo"
                    />
                  </Link>
                </div>
              </div>

              {/* Menu */}
              <div className="de-flex-col header-col-mid">
                <Menu location="header" />
              </div>

              {/* CTA e Menu Mobile */}
              <div className="de-flex-col">
                <div className="menu_side_area">
                  <Link href="/contact" className="btn-main btn-line">
                    Get In Touch
                  </Link>
                  <span
                    id="menu-btn"
                    onClick={toggle}
                    className={isOpen ? 'menu-open' : ''}
                    role="button"
                    aria-label="Toggle menu"
                    aria-expanded={isOpen}
                  >
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


