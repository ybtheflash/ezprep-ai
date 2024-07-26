import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [screenSize, setScreenSize] = useState("large");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1210) {
        setScreenSize("large");
      } else if (window.innerWidth > 920) {
        setScreenSize("medium");
      } else if (window.innerWidth > 810) {
        setScreenSize("small");
      } else {
        setScreenSize("xsmall");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Topics", path: "/topics" },
    { name: "Generate", path: "/generate" },
    { name: "Donate", path: "/donate" },
    { name: "Account", path: "/account" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={`${styles.navbar} ${styles[screenSize]}`}>
      {screenSize === "xsmall" ? (
        <>
          <div
            className={`${styles.hamburger} ${isMenuOpen ? styles.open : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          {isMenuOpen && (
            <ul className={styles.mobileNavList}>
              {navItems.map((item) => (
                <li key={item.name} className={styles.mobileNavItem}>
                  <Link href={item.path}>
                    <span
                      className={`${styles.mobileNavLink} ${
                        router.pathname === item.path ? styles.active : ""
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.name} className={styles.navItem}>
              <Link href={item.path}>
                <span
                  className={`${styles.navLink} ${
                    router.pathname === item.path ? styles.active : ""
                  }`}
                >
                  {item.name}
                  {router.pathname === item.path && (
                    <span className={styles.activeIndicator}></span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
