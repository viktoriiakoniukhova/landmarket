import React from "react";
import styles from "./AnnoSwiper.module.scss";
import { v4 as uuidv4 } from "uuid";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/scss";
import "swiper/scss/pagination";
import "swiper/css/navigation";

export default function AnnoSwiper({ images }) {
  return (
    <Swiper
      pagination={true}
      modules={[Navigation, Pagination]}
      loop={true}
      className={styles.tSwiper}
      navigation
    >
      {images.map((imgURL) => {
        return (
          <SwiperSlide key={uuidv4()} className={styles.tSwiperSlide}>
            <img src={imgURL} alt="land-photo" />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
