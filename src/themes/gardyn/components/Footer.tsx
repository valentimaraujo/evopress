'use client';

import Link from 'next/link';
import React from 'react';

export function Footer() {
    return (
        <footer className="bg-zinc-900 pt-16 pb-8 text-zinc-400">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                    <div className="col-lg-1">
                        <Link href="/" className="mb-6 block text-2xl font-black uppercase tracking-tighter text-white">
                            Gardyn<span className="text-primary">.</span>
                        </Link>
                        <p className="mb-6 text-sm leading-relaxed">
                            Transform your outdoor space with our expert garden services! From design to maintenance,
                            we create beautiful, thriving gardens tailored to your vision.
                        </p>
                        <div className="flex space-x-4">
                            {/* Social icons could go here */}
                            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 
                            text-white transition-colors hover:bg-primary">
                                F
                            </a>
                            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 
                            text-white transition-colors hover:bg-primary">
                                X
                            </a>
                            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 
                            text-white transition-colors hover:bg-primary">
                                I
                            </a>
                        </div>
                    </div>

                    <div>
                        <h5 className="mb-6 font-bold uppercase tracking-wider text-white">Company</h5>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="/services" className="hover:text-primary transition-colors">Our Services</Link></li>
                            <li><Link href="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="mb-6 font-bold uppercase tracking-wider text-white">Our Services</h5>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">Garden Design</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Garden Maintenance</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Planting Services</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Tree Care</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="mb-6 font-bold uppercase tracking-wider text-white">Contact Us</h5>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-start gap-3">
                                <span className="text-primary mt-1">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                                <div>
                                    <div className="font-semibold text-white">We're Open</div>
                                    Monday - Friday 08.00 - 18.00
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-primary mt-1">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                </span>
                                <div>
                                    <div className="font-semibold text-white">Location</div>
                                    100 S Main St, New York, NY
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-zinc-800 pt-8 text-center text-xs">
                    <p>© 2025 Gardyn by EvoDev. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
