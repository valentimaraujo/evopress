'use client';

import React from 'react';

import { Menu } from './Menu';
import { Topbar } from "./Topbar";

export function Header() {
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
