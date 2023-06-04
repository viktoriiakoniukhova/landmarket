import React from "react";
import styles from "./Loader.module.scss";

export default function Loader({ border, borderTop, width, height }) {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.loader}
        style={{
          border: border,
          borderTop: borderTop,
          width: width,
          height: height,
        }}
      ></div>
    </div>
  );
}
