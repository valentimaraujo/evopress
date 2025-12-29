'use client';

import Script from 'next/script';
import React, { useEffect } from 'react';

import { Footer } from './Footer';
import { Header } from './Header';

// Assets are managed in src/themes/gardyn/assets and synced to public/themes/gardyn/
// via consolidate_theme.sh. We use link tags here to ensure legacy CSS references
// (fonts, images) work correctly without complex build-time resolution.

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    useEffect(() => {
        // Fallback: hide the loader after a short delay if the script doesn't handle it
        const timer = setTimeout(() => {
            const loader = document.getElementById('de-loader');
            if (loader) {
                loader.style.display = 'none';
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="gardyn-theme-root">
            {/* CSS Assets served from /public/themes/gardyn/css/ */}
            <link href="/themes/gardyn/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
            <link href="/themes/gardyn/css/plugins.css" rel="stylesheet" type="text/css" />
            <link href="/themes/gardyn/css/style.css" rel="stylesheet" type="text/css" />
            <link href="/themes/gardyn/css/coloring.css" rel="stylesheet" type="text/css" />
            <link href="/themes/gardyn/css/colors/scheme-01.css" rel="stylesheet" type="text/css" />

            <div id="wrapper">
                <a href="#" id="back-to-top"></a>
                <div id="de-loader"></div>

                <Header />

                <div className="no-bottom no-top" id="content">
                    <div id="top"></div>
                    {children}
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
                    <img src="/themes/gardyn/images/logo-white.webp" className="w-150px" alt="" />
                    <div className="spacer-30-line"></div>
                    <h5>Our Services</h5>
                    <ul className="no-style">
                        <li><a href="#">Garden Design</a></li>
                        <li><a href="#">Garden Maintenance</a></li>
                        <li><a href="#">Planting Services</a></li>
                        <li><a href="#">Tree Care</a></li>
                        <li><a href="#">Irrigation Services</a></li>
                        <li><a href="#">Specialty Services</a></li>
                    </ul>
                    <div className="spacer-30-line"></div>
                    <h5>Contact Us</h5>
                    <div><i className="icofont-clock-time me-2 op-5"></i>Monday - Friday 08.00 - 18.00</div>
                    <div><i className="icofont-location-pin me-2 op-5"></i>100 S Main St, New York, </div>
                    <div><i className="icofont-envelope me-2 op-5"></i>contact@gardyn.com</div>
                    <div className="spacer-30-line"></div>
                    <h5>About Us</h5>
                    <p>Transform your outdoor space with our expert garden services! From design to maintenance,
                        we create beautiful, thriving gardens tailored to your vision.</p>
                </div>
            </div>
            {/* overlay content end */}

            <div id="buy-now" className="show-on-scroll">
                <a className="btn-buy" href="#" target="_blank">Buy on <img src="/themes/gardyn/demo/envato.png" alt="" /></a>
            </div>

            {/* JS Assets - serve from public folder synced by consolidate_theme.sh */}
            <Script src="/themes/gardyn/js/plugins.js" strategy="afterInteractive" />
            <Script src="/themes/gardyn/js/designesia.js" strategy="afterInteractive" />
        </div>
    );
}

export default Layout;
