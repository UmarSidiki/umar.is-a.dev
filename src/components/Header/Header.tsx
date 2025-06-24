"use client";
import Link from "next/link";
import React, { useState } from "react";
import { ModeToggle } from "../ThemeToggle";
import { Button } from "../ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ];
  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <li>
      <Link
        href={href}
        className="group relative inline-block px-3 py-2 rounded-lg transition-all duration-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 font-medium text-sm"
        onClick={() => setIsMenuOpen(false)}
      >
        {label}
        <span className="absolute left-3 -bottom-0.5 h-[2px] w-0 bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 group-hover:w-[calc(100%-24px)] rounded-full"></span>
      </Link>
    </li>
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4
             transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between bg-white/80 dark:bg-neutral-900/80 px-6 py-4 shadow-lg shadow-neutral-200/20 dark:shadow-neutral-900/40 rounded-2xl backdrop-blur-md border border-neutral-200/30 dark:border-neutral-700/30">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg md:text-xl">U</span>
            </div>
            <div className="ml-3">
              <h1 className="text-neutral-900 dark:text-white text-lg md:text-xl font-bold tracking-tight">
                UmarSidiki
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Full-Stack Developer
              </p>
            </div>
          </div>{" "}
          {/* Desktop Navigation */}
          <nav
            role="navigation"
            aria-label="Main Menu"
            className="hidden md:block"
          >
            <ul className="flex space-x-2 text-neutral-700 dark:text-neutral-300">
              {navItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </ul>
          </nav>
          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-3">
            <ModeToggle />
            <Button
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get in Touch
            </Button>
          </div>{" "}
          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div
              className={`w-5 h-0.5 bg-neutral-700 dark:bg-neutral-300 transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-1" : ""
              }`}
            ></div>
            <div
              className={`w-5 h-0.5 bg-neutral-700 dark:bg-neutral-300 transition-all duration-300 my-1 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            ></div>
            <div
              className={`w-5 h-0.5 bg-neutral-700 dark:bg-neutral-300 transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-1" : ""
              }`}
            ></div>
          </button>
        </div>{" "}
        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-80 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl shadow-lg border border-neutral-200/30 dark:border-neutral-700/30">
            <nav role="navigation" aria-label="Mobile Menu" className="p-6">
              <ul className="flex flex-col space-y-2 text-neutral-700 dark:text-neutral-300 mb-6">
                {navItems.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </ul>
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row gap-3">
                <ModeToggle />
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                >
                  Get in Touch
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
