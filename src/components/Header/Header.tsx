import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "../ThemeToggle";

const Header = () => {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <li>
      <Link
        href={href}
        className="group relative inline-block transition-colors duration-200 hover:text-amber-800 dark:hover:text-amber-100"
      >
        {label}
        <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-amber-800 dark:bg-amber-100 transition-all duration-300 group-hover:w-full"></span>
      </Link>
    </li>
  );

  return (
    <header className="sticky top-0 z-50 pt-5 px-72">
      <div className="flex items-center justify-between bg-neutral-200/70 dark:bg-neutral-800/70 px-4 shadow-md rounded-2xl backdrop-blur">
        {/* Logo */}
        <div className="flex items-center dark:invert">
          <Image alt="Logo" src="/logo.png" width={50} height={50} />
          <p className="text-black dark:text-black text-2xl font-bold">
            UmarSidiki
          </p>
        </div>

        {/* Navigation */}
        <nav role="navigation" aria-label="Main Menu">
          <ul className="flex space-x-6 text-black dark:text-white">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </ul>
        </nav>

        {/* Theme Toggle */}
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
