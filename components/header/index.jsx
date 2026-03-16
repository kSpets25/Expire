import { useState } from "react";
import styles from "./style.module.css";
import Link from "next/link";
import useLogout from "../../hooks/useLogout";
import Image from "next/image";

export default function Header(props) {
  const logout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
  setMenuOpen(!menuOpen);
  };
  return (
    <header className={styles.container}>

      {/* Logo */}
      <Link href="/">
        <Image
          src="/images/logo-2white4.png"
          alt="Home"
          width={170}
          height={45}
          className={styles.homeImg}
        />
      </Link>

      {/* Hamburger (always exists, only visible on mobile via CSS) */}
      <div className={styles.hamburger} onClick={toggleMenu}>
        ☰
      </div>

      {/* Navigation Links */}
      <nav className={`${styles.navigation} ${menuOpen ? styles.active : ""}`}>
        <Link href="/about">About</Link>
        <Link href="/searchFoods">Search</Link>
        <Link href="/savedFoods">Saved</Link>
        <Link href="/expiringFoods">Expiring</Link>
      </nav>

      {/* User Info (only when logged in) */}
      {props.isLoggedIn && (
        <div className={styles.container1}>
          <p>Welcome, {props.username}!</p>
          <p onClick={logout} style={{ cursor: "pointer" }}>
            Logout
          </p>
        </div>
      )}

    </header>
  );
}