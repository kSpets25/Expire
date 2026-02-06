import Head from "next/head";
import Header from "../components/header";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import dbConnect from "../db/connection";
import Product from "../db/models/product";
import SavedProduct from "../db/models/savedProduct";
import styles from "../components/search.module.css";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (!user) {
      return { props: { isLoggedIn: false, user: null, expiringProducts: [] } };
    }

    await dbConnect();

    let expiringProducts = [];

    try {
      // Fetch saved products for this user and populate product details
      const savedDoc = await SavedProduct.findOne({ userId: user.id }).populate("products.product");

      if (savedDoc?.products) {
        const today = new Date();

        expiringProducts = savedDoc.products
          .map((p) => {
            if (!p.expirationDate || !p.product) return null;

            const expDate = new Date(p.expirationDate);
            const daysLeft = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

            return daysLeft >= 0 && daysLeft <= 30
              ? { ...p._doc, daysLeft } // include days left
              : null;
          })
          .filter(Boolean);
      }
    } catch (err) {
      console.error("Error fetching expiring products:", err);
    }

    return {
      props: { isLoggedIn: true, user, expiringProducts },
    };
  },
  sessionOptions
);

export default function ExpiringProducts({ isLoggedIn, user, expiringProducts }) {
  return (
    <div className={styles.searchContainer}>
      <Header isLoggedIn={isLoggedIn} username={user?.username} />

      <Head>
        <title>Expiring Products</title>
        <meta name="description" content="Products expiring soon" />
      </Head>

      <h1>Expiring Products</h1>

      {expiringProducts.length === 0 ? (
        <p>No saved products expiring within 30 days.</p>
      ) : (
        <div className={styles.productsGrid}>
          {expiringProducts.map((p) => {
            const product = p.product; // populated Product
            return (
              <div key={p._id} className={styles.productCard}>
                {product.image_small_url && (
                  <img src={product.image_small_url} alt={product.product_name} />
                )}
                <h3>{product.product_name}</h3>
                <p>Brand: {product.brands || "Unknown"}</p>
                {product.nutriscore_grade && (
                  <p>Nutriscore: {product.nutriscore_grade.toUpperCase()}</p>
                )}
                <p>Barcode: {product.code}</p>
                {product.nutriments && (
                  <ul>
                    <li>Energy (kcal): {product.nutriments.energy_kcal || 0}</li>
                    <li>Fat: {product.nutriments.fat || 0}g</li>
                    <li>Saturated Fat: {product.nutriments.saturated_fat || 0}g</li>
                    <li>Carbohydrates: {product.nutriments.carbohydrates || 0}g</li>
                    <li>Sugars: {product.nutriments.sugars || 0}g</li>
                    <li>Fiber: {product.nutriments.fiber || 0}g</li>
                    <li>Proteins: {product.nutriments.proteins || 0}g</li>
                    <li>Salt: {product.nutriments.salt || 0}g</li>
                  </ul>
                )}
                {p.expirationDate && (
                  <div>
                    <p>Expires on: {new Date(p.expirationDate).toLocaleDateString()}</p>
                    <p
                      style={{
                        fontWeight: "bold",
                        color: p.daysLeft <= 3 ? "#e53935" : "#ff9800",
                      }}
                    >
                      ⏰ {p.daysLeft} day{p.daysLeft !== 1 ? "s" : ""} left
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
