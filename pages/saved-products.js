import { useEffect, useState } from "react";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header"; // <- import Header
import styles from "../components/search.module.css"; // reuse existing styles

// Server-side props for session info
export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    return {
      props: {
        isLoggedIn: !!user,
        user: user || null,
      },
    };
  },
  sessionOptions
);

export default function SavedProducts(props) {
  const [savedProducts, setSavedProducts] = useState([]);

  useEffect(() => {
    // Read saved products directly from localStorage
    const saved = JSON.parse(localStorage.getItem("savedProducts")) || [];
    setSavedProducts(saved);
  }, []);

  const deleteProduct = (code) => {
    const updated = savedProducts.filter((p) => p.code !== code);
    localStorage.setItem("savedProducts", JSON.stringify(updated));
    setSavedProducts(updated);
  };
  
  return (
    
    <div className={styles.searchContainer}>
      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />
      <h1>Saved Products</h1>

      {/* Optional: Show username if logged in */}
      {props.isLoggedIn && props.user?.username && (
        <p>Welcome, {props.user.username}!</p>
      )}

      {/* Go back to search */}
      <Link href="/" className={styles.backLink}>
        ← Go back to search
      </Link>

      {savedProducts.length === 0 ? (
        <p>No saved products yet.</p>
      ) : (
        <div className={styles.productsGrid}>
          {savedProducts.map((product) => (
            <div key={product.code || product.id} className={styles.productCard}>
              {product.image_small_url && (
                <img src={product.image_small_url} alt={product.product_name} />
              )}
              <h3>{product.product_name}</h3>
              <p>Brand: {product.brands || "Unknown"}</p>
              <p>Barcode: {product.code || "N/A"}</p>
              <p>
                Expiration Date: {product.expirationDate} | Quantity: {product.quantity}{" "}
                {product.unitType === "case" ? `(Case of ${product.itemsPerCase})` : ""}
              </p>
              <button
                className={styles.button}
                onClick={() => deleteProduct(product.code)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
