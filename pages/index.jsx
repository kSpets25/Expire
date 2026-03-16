import Head from "next/head";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import styles from "../styles/Home.module.css";
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

export default function Home(props) {
  const router = useRouter();
  const logout = useLogout();
  return (
    <div className={styles.container}>
      <Head>
        <title>Home Page</title>
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

      <main className={styles.mainHome}>
        <div className={styles.titleBackground}>
        <h1 className={styles.title}>
          Welcome to expire! 
          <br></br>Your Food Expiration Tracker
        </h1>
       </div>

        {/* Landing page content */}
        <div className= {styles.homeContent}
        
          >
          <h2>Eat it While it's Fresh!!</h2>
          <p>Search for foods and save them with expiration dates.</p>
          <button className ={styles.buttonSearch}
            onClick={() => {
              if (props.isLoggedIn) {
                router.push("/searchFoods");
              } else { 
                router.push("/login");
              }
            }}
            
          >
            Search Foods
          </button>
        </div>
      </main>

      
      <Footer className={styles.footer}/>
      
    </div>
  );
}