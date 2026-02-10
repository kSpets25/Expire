// pages/savedFoods.js
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import styles from "../styles/Home.module.css";
import Header from "../components/header";
import useLogout from "../hooks/useLogout";
import dbConnect from "../db/connection";
import Food from "../db/models/foods";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (!user) {
      return {
        redirect: { destination: "/login", permanent: false },
      };
    }

    await dbConnect();

    const foods = await Food.find({ userId: user.id || user._id }).lean();

    return {
      props: {
        user,
        isLoggedIn: true,
        foods: JSON.parse(JSON.stringify(foods)), // serialize dates for Next.js
      },
    };
  },
  sessionOptions
);

export default function SavedFoods({ foods, user, isLoggedIn }) {
  const router = useRouter();
  const logout = useLogout();

  // Remove product (delete from DB)
  const removeProduct = async (id) => {
    try {
      const res = await fetch(`/api/foods/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      router.replace(router.asPath); // refresh page
    } catch (err) {
      console.error(err);
      alert("Error removing food: " + err.message);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Saved Foods</title>
        <meta name="description" content="View your saved foods" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={isLoggedIn} username={user?.username} onLogout={logout} />

      <main className={styles.main}>
        <h1 className={styles.title}>Saved Foods</h1>

        {foods.length === 0 ? (
          <p>You have no saved foods yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1rem",
              width: "100%",
              marginTop: "1rem",
            }}
          >
            {foods.map((food) => (
              <div
                key={food._id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {food.image_small_url && (
                  <img
                    src={food.image_small_url}
                    alt={food.product_name}
                    style={{
                      width: "100%",
                      borderRadius: "4px",
                      marginBottom: "0.5rem",
                    }}
                  />
                )}

                <h3>{food.product_name}</h3>
                <p>Brand: {food.brands || "Unknown"}</p>
                <p>Quantity: {food.quantity} {food.unit}</p>
                <p>Expiration Date: {new Date(food.expirationDate).toLocaleDateString()}</p>
                <p>Saved At: {new Date(food.createdAt).toLocaleString()}</p>

                <button
                  onClick={() => removeProduct(food._id)}
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#F44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
