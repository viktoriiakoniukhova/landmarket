import React from "react";
import styles from "./AnnoFold.module.scss";
import like from "../../assets/icons/like.png";
import currencyFilter from "../../filter/currency.filter";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function AnnoFold({ data, type }) {
  const { price, images, cadastrInfo, _id } = data;
  const { area, address, cadnum, region_name } = cadastrInfo;
  const annoImgURL = images[0];

  return (
    <div
      className={
        type ? `${styles.cardWrapper} ${styles[type]}` : styles.cardWrapper
      }
    >
      <div className={styles.imgWrapper}>
        <img src={annoImgURL} alt="title" />
        <div className={styles.likeWrapper}>
          <img src={like} alt="like" />
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.mainInfo}>
          <h3>{currencyFilter(price)}</h3>
          <h3>{area} га</h3>
        </div>
        <div className={styles.secondaryInfo}>
          <p>{cadnum}</p>
          <p>{address ? address.slice(0, 50) + "..." : region_name}</p>
        </div>
        <div className={styles.unfoldButton}>
          <Link to={`${_id}`} className={styles.btn}>
            <p>Розгорнути</p> <BsArrowRight size={20} color="#000000" />
          </Link>
        </div>
      </div>
    </div>
  );
}
