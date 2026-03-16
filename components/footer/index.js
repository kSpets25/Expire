import styles from "./style.footer.module.css";
//import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    
    return (
      <div className={styles.container}>
        <footer className={styles.footer}>
       <h5>Food information provided by: world.openfoodfacts.org</h5>
      </footer>
      </div>
    );
}