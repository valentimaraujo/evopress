import React from 'react';

interface TopbarProps {
    phone?: string;
    address?: string;
    email?: string;
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        youtube?: string;
        pinterest?: string;
        whatsapp?: string;
    };
}

export function Topbar({ phone, address, email, socialLinks }: TopbarProps) {
    return (
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
    );
}
