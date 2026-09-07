import { PHeading, PText } from "@porsche-design-system/components-react/ssr";
import { TicTacToe } from "@/components/TicTacToe";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <PHeading tag="h1" size="2xl">
        Tic-Tac-Toe
      </PHeading>
      <PText color="contrast-medium">
        Classic 3×3 grid — built with the Porsche Design System.
      </PText>
      <TicTacToe />
    </main>
  );
}
