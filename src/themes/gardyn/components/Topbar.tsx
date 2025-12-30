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
                                {phone && (
                                    <div className="topbar-widget me-3">
                                        <a href="#">
                                            <i className="icofont-clock-time"></i>
                                            {phone}
                                        </a>
                                    </div>
                                )}
                                {address && (
                                    <div className="topbar-widget me-3">
                                        <a href="#">
                                            <i className="icofont-location-pin"></i>
                                            {address}
                                        </a>
                                    </div>
                                )}
                                {email && (
                                    <div className="topbar-widget me-3">
                                        <a href={`mailto:${email}`}>
                                            <i className="icofont-envelope"></i>
                                            {email}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {socialLinks && Object.keys(socialLinks).length > 0 && (
                                <div className="d-flex">
                                    <div className="social-icons">
                                        {socialLinks.facebook && (
                                            <a
                                                href={socialLinks.facebook}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Facebook"
                                            >
                                                <i className="fa-brands fa-facebook fa-lg"></i>
                                            </a>
                                        )}
                                        {socialLinks.twitter && (
                                            <a
                                                href={socialLinks.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Twitter"
                                            >
                                                <i className="fa-brands fa-x-twitter fa-lg"></i>
                                            </a>
                                        )}
                                        {socialLinks.youtube && (
                                            <a
                                                href={socialLinks.youtube}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="YouTube"
                                            >
                                                <i className="fa-brands fa-youtube fa-lg"></i>
                                            </a>
                                        )}
                                        {socialLinks.pinterest && (
                                            <a
                                                href={socialLinks.pinterest}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Pinterest"
                                            >
                                                <i className="fa-brands fa-pinterest fa-lg"></i>
                                            </a>
                                        )}
                                        {socialLinks.instagram && (
                                            <a
                                                href={socialLinks.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Instagram"
                                            >
                                                <i className="fa-brands fa-instagram fa-lg"></i>
                                            </a>
                                        )}
                                        {socialLinks.whatsapp && (
                                            <a
                                                href={socialLinks.whatsapp}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="WhatsApp"
                                            >
                                                <i className="fa-brands fa-whatsapp fa-lg"></i>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
