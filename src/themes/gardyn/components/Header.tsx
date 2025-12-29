'use client';

import Link from 'next/link';
import React from 'react';

import { Menu } from './Menu';

export function Header() {
  return (
    <header className="transparent">
      <div id="topbar">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="d-flex justify-content-between xs-hide">
                <div className="d-flex">
                  <div className="topbar-widget me-3"><a href="#"><i className="icofont-clock-time"></i>Monday - Friday 08.00 - 18.00</a></div>
                  <div className="topbar-widget me-3"><a href="#"><i className="icofont-location-pin"></i>100 S Main St, New York, NY</a></div>
                  <div className="topbar-widget me-3"><a href="#"><i className="icofont-envelope"></i>contact@gardyn.com</a></div>
                </div>

                <div className="d-flex">
                  <div className="social-icons">
                    <a href="#"><i className="fa-brands fa-facebook fa-lg"></i></a>
                    <a href="#"><i className="fa-brands fa-x-twitter fa-lg"></i></a>
                    <a href="#"><i className="fa-brands fa-youtube fa-lg"></i></a>
                    <a href="#"><i className="fa-brands fa-pinterest fa-lg"></i></a>
                    <a href="#"><i className="fa-brands fa-instagram fa-lg"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="clearfix"></div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="de-flex sm-pt10">
              <div className="de-flex-col">
                {/* logo begin */}
                <div id="logo">
                  <Link href="/">
                    <img className="logo-main" src="/themes/gardyn/images/logo-white.webp" alt="" />
                    <img className="logo-mobile" src="/themes/gardyn/images/logo-white.webp" alt="" />
                  </Link>
                </div>
                {/* logo end */}
              </div>
              <div className="de-flex-col header-col-mid">
                {/* mainemenu begin */}
                <Menu location="header" />
                {/* mainmenu end */}
              </div>
              <div className="de-flex-col">
                <div className="menu_side_area">
                  <Link href="/contact" className="btn-main btn-line">Get In Touch</Link>
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

export default Header;
