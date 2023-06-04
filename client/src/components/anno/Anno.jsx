import React from "react";
import styles from "./Anno.module.scss";

export default function Anno({ data }) {
  const {
    title,
    description,
    price,
    images,
    techFeatures,
    owner,
    likes,
    views,
    cadastrInfo,
    createdAt,
  } = data;
  console.log(cadastrInfo);
  const {
    area,
    address,
    cadnum,
    category,
    purpose,
    use,
    ownership,
    region_name,
  } = cadastrInfo;
  const annoImgURL = images[0];

  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.left}>
          <h3>{title}</h3>
        </div>
        <div className={styles.right}></div>
      </div>
    </>
  );
}
