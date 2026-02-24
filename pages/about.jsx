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
          expire! is a food expiration tracker!  It is a simple, friendly and helpful application designed specifically for food pantries to track expiring foods and help reduce food waste, ultimately saving time and money.  With expire! pantry coordinators, staff, and volunteers can quickly search for products, save those food items to inventory, and view items expiring within the next 14 days. 
          <br></br>
          <br></br>
          The expire application is designed to be straightforward and extremely easy to use. Just search by  entering a food item barcode or name, and a list of food options will appear.  Select an item and choose  an expiration date and the number of items or cases, and save the item to the saved foods page. The application will automatically keep track of all the foods expiring within the next 14 days. Each food item on the expiring page displays a days left count down notification and is color coded with orange or red, indicating the urgency of use before expiring. In the event of a missed expiration date, the word Expired will appear at the bottom of the food item on the expiring foods page. Delete a food item on the list at any time.
          <br></br>
          <br></br>
          Using this application on a daily basis provides coordinators with an organized system to track the expiration dates to see what needs attention and plan accordingly. This gives food pantry coordinators and staff the ability to quickly check expiring foods, which increases intentional distribution of the foods before expiration, and not only prevents food waste but saves money.
          <br></br>
          <br></br>
          expire! makes this process easier, faster, more engaging, and even more fun!


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