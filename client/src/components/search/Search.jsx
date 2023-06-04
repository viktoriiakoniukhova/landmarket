import React from "react";
import { BiSearch } from "react-icons/bi";
import styles from "./Search.module.scss";

export default function Search({ type }) {
  return (
    <div
      className={
        type ? `${styles.searchWrapper} ${styles[type]}` : styles.searchWrapper
      }
    >
      <input type="text" placeholder="Введіть адресу..." />
      <button>
        <BiSearch color="white" size={27} />
      </button>
    </div>
  );
}
