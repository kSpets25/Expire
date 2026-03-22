import styles from "./style.module.css";
import Link from "next/link";
import useLogout from "../../hooks/useLogout";
import Image from "next/image";
import { useState } from "react";

export default function Header(props) {
  const logout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    
    <header className={styles.container}>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src="/images/logo-2white4.png"
            alt="Home"
            width={170}
            height={45}
            className={styles.homeImg}
          />
        </Link>
      </div>

      {props.isLoggedIn && (
        <>
          <button
            className={styles.menuButton}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          <nav className={`${styles.navigation} ${menuOpen ? styles.open : ""}`}>
            <Link href="/about">About</Link>
            <Link href="/searchFoods">Search</Link>
            <Link href="/savedFoods">Saved</Link>
            <Link href="/expiringFoods">Expiring</Link>
          </nav>

          <div className={styles.container1}>
            <p>Welcome, {props.username}!</p>
            <p onClick={logout} style={{ cursor: "pointer" }}>
              Logout
            </p>
          </div>
        </>
      )}

      {!props.isLoggedIn && (
        <div className={styles.auth}>
          <Link href="/login">Login</Link>
        </div>
      )}
    </header>
  );
}