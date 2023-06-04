import React from "react";
import logo from "../../../assets/logo.svg";
import { SlArrowRight } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import importAll from "../../../hooks/importAll";
import styles from "./Footer.module.scss";

const iconURLs = importAll(
  require.context("../../../assets/icons", false, /\.(png|jpe?g|svg)$/)
);

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer>
      <div className={`${styles.col} ${styles.first}`}>
        <div className={styles.imgContainer}>
          <img src={logo} alt="logo" />
        </div>
        <p>
          український ринок землі - купуйте та продавайте земельні ділянки
          зручно та безпечно.
        </p>
        <p>&copy;Landmarket, 2023. All rights reserved</p>
      </div>
      <div className={`${styles.col} ${styles.second}`}>
        <div className={styles.newsletterWrapper}>
          <p>ОТРИМУЙТЕ ДАЙДЖЕСТ НОВИН ТА ОГОЛОШЕНЬ</p>
          <div className={styles.inputWrapper}>
            <input type="text" placeholder="Введіть e-mail..." />
            <button>
              <SlArrowRight color="#026670" size={27} />
            </button>
          </div>
        </div>
        <div className={styles.navWrapper}>
          <nav>
            <Link>Про нас</Link>
            <Link>Зв'яжіться з нами</Link>
            <Link>Ми наймаємо</Link>
          </nav>
          <nav>
            <Link>Ділянки</Link>
            <Link>Агенти</Link>
            <Link to="/info">Q & A</Link>
          </nav>
        </div>
      </div>
      <div className={`${styles.col} ${styles.third}`}>
        <div className={styles.socialsWrapper}>
          <p>Ми в соціальних мережах</p>
          <div className={styles.socials}>
            <div className={styles.imgContainer}>
              <img src={iconURLs["tw.svg"]} alt="tw" />
            </div>
            <div className={styles.imgContainer}>
              <img src={iconURLs["fb.svg"]} alt="fb" />
            </div>
            <div className={styles.imgContainer}>
              <img src={iconURLs["ig.svg"]} alt="ig" />
            </div>
            <div className={styles.imgContainer}>
              <img src={iconURLs["ln.svg"]} alt="ln" />
            </div>
          </div>
        </div>
        <div className={styles.contactWrapper}>
          <div className={styles.contact}>
            <div className={styles.imgContainer}>
              <img src={iconURLs["ph.svg"]} alt="ph" />
            </div>
            <a href="tel:+380567891234">+380567891234</a>
          </div>
          <div className={styles.contact}>
            <div className={styles.imgContainer}>
              <img src={iconURLs["tg.svg"]} alt="tg" />
            </div>
            <a href="https://t.me/vikssesss">@LANDMARKET_HELP</a>
          </div>
          <div className={styles.contact}>
            <div className={styles.imgContainer}>
              <img src={iconURLs["mail.svg"]} alt="mail" />
            </div>
            <a href="mailTo:support@landmarket.ua">support@landmarket.ua</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
