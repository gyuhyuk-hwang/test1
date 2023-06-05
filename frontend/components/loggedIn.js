import styles from "../styles/Nft.module.css";
import GetNfts from "./getNfts";

export default function LoggedIn() {
  return (
    <section className={styles.loggedInMain}>
      <section className={styles.loggedInAccount}>
        <GetNfts />
      </section>
    </section>
  );
}