import React, { useEffect, useState } from "react";
import Search from "../../components/search/Search";
import gallery from "../../assets/gallery.png";
import styles from "./HomePage.module.scss";
import Button from "../../components/button/Button";
import { useInfo } from "../../App";
import importAll from "../../hooks/importAll";
import getDateDiffInDays from "../../hooks/getDateDiffInDays";
import AnnoFold from "../../components/annoFold/AnnoFold";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";

const regionsImgURLs = importAll(
  require.context("../../assets/regions", false, /\.(png|jpe?g|svg)$/)
);

const badgesImgURLs = importAll(
  require.context("../../assets/about", false, /\.(png|jpe?g|svg)$/)
);

const regionsTitles = [
  { imgURL: regionsImgURLs["od.png"], title: "Одеські землі", code: "001" },
  { imgURL: regionsImgURLs["dp.png"], title: "Дніпровські землі", code: "001" },
  {
    imgURL: regionsImgURLs["ch.png"],
    title: "Чернігівські землі",
    code: "001",
  },
  { imgURL: regionsImgURLs["kh.png"], title: "Харківські землі", code: "012" },
  { imgURL: regionsImgURLs["zh.png"], title: "Житомирські землі", code: "014" },
  { imgURL: regionsImgURLs["pl.png"], title: "Полтавські землі", code: "015" },
  {
    imgURL: regionsImgURLs["kher.png"],
    title: "Херсонські землі",
    code: "012",
  },
  { imgURL: regionsImgURLs["kyiv.png"], title: "Київські землі", code: "002" },
];

const regionsList = [
  "Вінницька область",
  "Волинська область",
  "Донецька область",
  "Закарпатська область",
  "Запорізька область",
  "Івано-Франківська область",
  "м. Київ",
  "м. Севастополь",
  "Кіровоградська область",
  "Луганська область",
  "Львівська область",
  "Миколаївська область",
  "Рівненська область",
  "Сумська область",
  "Тернопільська область",
  "Хмельницька область",
  "Черкаська область",
  "Чернівецька область",
];

function RegionCard({ imgURL, title, code }) {
  const { regionClicked, setRegionClicked } = useInfo();

  const navigate = useNavigate();

  const handleRegionClick = () => {
    setRegionClicked({ code: code, title: title });
    navigate("/annos");
  };

  return (
    <div className={styles.regionCard} onClick={handleRegionClick}>
      <div className={styles.imgContainer}>
        <img src={imgURL} alt={title} />
      </div>
      <p>{title}</p>
    </div>
  );
}

export default function HomePage() {
  const { stats, annos } = useInfo();
  const [isLoaded, setIsLoaded] = useState(false);

  const hotDeals = annos.filter((anno) => {
    const createdAt = new Date(anno.createdAt);
    const currentDate = new Date();
    return getDateDiffInDays(createdAt, currentDate) <= 1000;
  });

  useEffect(() => {
    if (annos.length) setIsLoaded(true);
  }, [annos]);

  const hotDealCards = hotDeals.map((hotDeal) => (
    <AnnoFold data={hotDeal} key={uuidv4()} />
  ));

  //Track size of window
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 375) setIsSmallDevice(true);
      else setIsSmallDevice(false);
    };

    // Attach the event listener
    window.addEventListener("resize", handleResize);
    handleResize();
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.homeWrapper}>
      <header>
        <div className={styles.content}>
          <h1>Знайдіть свою земельну ділянку серед мільйонів гектарів</h1>
          <Search />
        </div>
        <div className={styles.gallery}>
          <img src={gallery} alt="gallery" />
        </div>
      </header>
      <section className={styles.regionsWrapper}>
        <h2>не знаєте звідки почати пошук?</h2>
        <div
          className={isSmallDevice ? styles.smallRegionsWrapper : styles.hide}
        >
          {regionsTitles.map(({ title, imgURL, code }) => {
            return (
              <RegionCard
                title={title}
                imgURL={imgURL}
                code={code}
                key={uuidv4()}
              />
            );
          })}
        </div>
        <div className={styles.regionsContent}>
          <div className={isSmallDevice ? styles.hide : styles.regionCards}>
            {regionsTitles.map(({ title, imgURL, code }) => {
              return (
                <RegionCard
                  title={title}
                  imgURL={imgURL}
                  code={code}
                  key={uuidv4()}
                />
              );
            })}
          </div>
          <div className={styles.regionList}>
            {regionsList.map((regionTitle) => {
              return <p key={uuidv4()}>{regionTitle}</p>;
            })}
          </div>
          <Button type="indigo" text="Оголошення поруч зі мною" />
        </div>
      </section>
      <section className={styles.aboutWrapper}>
        <div className={styles.main}>
          <h2>Земельний маркетплейс</h2>
          <p>
            Ласкаво просимо на український ринок землі - купуйте та продавайте
            земельні ділянки зручно та безпечно не виходячи з дому.{" "}
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <h2>{stats.annos}+</h2>
              <p>оголошень</p>
            </div>
            <div className={styles.stat}>
              <h2>{stats.agents}+</h2>
              <p>агентів</p>
            </div>
            <div className={styles.stat}>
              <h2>{stats.visits}+</h2>
              <p>відвідувань/місяць</p>
            </div>
          </div>
        </div>
        <div className={styles.badges}>
          <div className={styles.badge}>
            <div className={styles.iconWrapper}>
              <img src={badgesImgURLs["tag.svg"]} alt="tag" />
            </div>
            <h3>Ділянки</h3>
            <p>Знайдіть свій клаптик землі серед мільйонів гектарів</p>
          </div>
          <div className={styles.badge}>
            <div className={styles.iconWrapper}>
              <img src={badgesImgURLs["agent.svg"]} alt="agent" />
            </div>
            <h3>Агенти</h3>
            <p>Агенти поблизу допоможуть з купівлею-продажом землі</p>
          </div>
          <div className={styles.badge}>
            <div className={styles.iconWrapper}>
              <img src={badgesImgURLs["security.svg"]} alt="security" />
            </div>
            <h3>Зручність</h3>
            <p>
              Для розміщення оголошення потрібен лише ваш акаунт і кадастровий
              номер ділянки
            </p>
          </div>
          <div className={styles.badge}>
            <div className={styles.iconWrapper}>
              <img src={badgesImgURLs["safety.svg"]} alt="safety" />
            </div>
            <h3>Безпека</h3>
            <p>Перевірка покупців та продавців, підготовка всіх документів</p>
          </div>
        </div>
      </section>
      <section className={styles.hotDealsWrapper}>
        <h2>Гарячі новинки</h2>
        <div className={styles.annosWrapper}>
          {!isLoaded ? <Loader /> : hotDealCards}
        </div>
      </section>
    </div>
  );
}
