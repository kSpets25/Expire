// pages/search-products.js
import Head from "next/head";
import Header from "../components/header";
import Search from "../components/search";
import styles from "../styles/Home.module.css";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";

// Server-side props
export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, query }) {
    const user = req.session.user;
    const props = {};

    // Add session info
    if (user) {
      props.user = user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }

    // Optional: fetch initial products based on query parameter
    // e.g., /search-products?term=laptop
    const searchTerm = query.term || "";
    try {
      let products = [];
      if (searchTerm) {
        // Replace with your real API/database call
        const res = await fetch(`https://fakestoreapi.com/products`);
        const allProducts = await res.json();
        products = allProducts.filter((p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      props.products = products;
    } catch (err) {
      console.error("Failed to fetch products:", err);
      props.products = [];
    }

    return { props };
  },
  sessionOptions
);

export default function SearchProducts(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Search Products</title>
        <meta name="description" content="Search products" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <main className={styles.main}>
        <h1 className={styles.title}>Search Products</h1>

        <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
          <Search initialProducts={props.products || []} />
        </div>
      </main>
    </div>
  );
}
