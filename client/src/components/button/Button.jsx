import React from "react";
import styles from "./Button.module.scss";

export default function Button({ text, type, onClick }) {
  return (
    <button className={styles[type]} onClick={onClick}>
      {text}
    </button>
  );
}
