import Head from "next/head";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import styles from "../styles/about.module.css";
import Header from "../components/header";
import Footer from "../components/footer";
import useLogout from "../hooks/useLogout";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const props = {};
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }
    return { props };
  },
  sessionOptions
);

export default function About(props) {
  const router = useRouter();
  const logout = useLogout();
  return (
    <div className={styles.container}>
      <Head>
        <title>About Ua</title>
        <meta
          name="description"
          content="Search for foods and save them with expiration dates"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header with props */}
      <Header
        isLoggedIn={props.isLoggedIn}
        username={props?.user?.username}
        onLogout={logout}
      />

      <main className={styles.main}>
        <h1 className={styles.title}>
          About Expire!
        </h1>

        
          <h2>Just Eat It!!</h2>
          <p>Search, Save, and Track Expiring Foods
          <br></br>
          <br></br>
          expire! is a food expiration tracker! It's a simple, friendly and helpful platform designed specifically for food pantry coordinators to track expiring foods and to reduce food waste, ultimately saving time and money. Even though this application was inspired and designed with food pantries in mind, with expire!, any business with the need to search for specific foods, save those food items, and track all items expiring within the next 14 days could clearly benefit from this application. 
          <br></br>
          <br></br>
          The "expire!" application is designed to be straightforward,intuitive and user-friendly. Food pantry coordinators and staff can quickly search for a food item by entering it's barcode or try to locate the item by name, and a list of food items will appear.  After selecting an item, users simply input the expiration date and quantity (individual items or cases) and save it to the Saved Foods page.
          <br></br>
          <br></br> 
          The application automatically monitors all saved items and tracks those expiring within the next 14 days. Items approaching their expiration date are displayed on the Expiring Foods page, where each entry includes a countdown of the remaining days. To enhance visibility and notification, items are color-coded orange for approaching expiration and red for urgent use. If an item passes it's expiration date, it is clearly labeled "Expired". Users also have the option to delete items from the list at any time, ensuring accurate and up-to-date food management. 
          <br></br>
          <br></br>
          Using this application on a daily basis provides users with an organized system to track the expiration dates to see what needs attention and plan accordingly. Now, food pantry coordinators and staff have the ability to quickly check expiring foods, which increases intentional distribution of the foods before expiration, and not only prevents food waste but saves time and money.
          <br></br>
          <br></br>
          Don't let food expire! "Eat It While It's Fresh!" expire! makes it easier, faster, and even more fun!
          


        </p>
          <button className={styles.button}
            onClick={() => {
              if (props.isLoggedIn) {
                router.push("/searchFoods");
              } else { 
                router.push("/login");
              }
            }}
            
          >
            Go to Search Foods
          </button>
       
      </main>

      <Footer className={styles.footer}/>
    </div>
  );
}