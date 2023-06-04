import React, { useEffect, useState } from "react";
import { useInfo } from "../../App";
import styles from "./ProfilePage.module.scss";
import Button from "../../components/button/Button";
import getDateDiffInDays from "../../hooks/getDateDiffInDays";
import { SlLocationPin } from "react-icons/sl";
import { FiPhoneCall, FiMail } from "react-icons/fi";
import { AiOutlineHeart } from "react-icons/ai";
import { CgList } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";

export default function ProfilePage() {
  const { user } = useInfo();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    profileImg: "",
    announcments: [],
    wishlist: [],
    createdAt: "",
    address: "",
  });
  const {
    address,
    announcments,
    createdAt,
    email,
    firstname,
    lastname,
    mobile,
    profileImg,
    wishlist,
  } = userData;
  const numOfAnnos = announcments.length || 0;
  const numOfDays = getDateDiffInDays(new Date(createdAt), new Date()) || 0;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  function fetchUser() {
    fetch(`${process.env.REACT_APP_URL}/api/user/${user.id}`)
      .then((res) => res.json())
      .then(
        ({
          firstname,
          lastname,
          email,
          mobile,
          profileImg,
          announcments,
          wishlist,
          createdAt,
          address,
        }) => {
          setUserData(() => ({
            firstname: firstname,
            lastname: lastname,
            email: email,
            mobile: mobile,
            profileImg: profileImg,
            announcments: announcments,
            wishlist: wishlist,
            createdAt: createdAt,
            address: address ? address : "",
          }));
          setIsLoaded(true);
        }
      );
  }

  const handleEditClick = () => {
    navigate("/profile/edit");
  };

  const handleWishlistClick = () => {
    navigate("/profile/wishlist");
  };

  const handleMyAnnosClick = () => {
    navigate("/profile/my-announcments");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.userCard}>
        <h3>Власник</h3>
        <div className={styles.userCardContent}>
          {!isLoaded ? (
            <Loader
              border="10px solid #ffffff"
              borderTop="10px solid #026670"
            />
          ) : (
            <>
              <div className={styles.row1}>
                <div className={styles.nameAndLogo}>
                  <div className={styles.imgContainer}>
                    <img src={profileImg} alt="user" />
                  </div>
                  <div className={styles.name}>
                    <p>{firstname}</p>
                    <p>{lastname}</p>
                  </div>
                </div>
                <div className={styles.userStats}>
                  <p>
                    <span>{numOfAnnos}</span> оголошень
                  </p>
                  <p>
                    <span>{numOfDays}</span> днів з нами
                  </p>
                </div>
              </div>
              <div className={styles.row2}>
                <div className={styles.line}>
                  <SlLocationPin size={20} color="#000" />
                  <p>{address ? address : "Не вказано"}</p>
                </div>
                <div className={styles.line}>
                  <FiPhoneCall size={20} color="#000" />
                  <p>{mobile}</p>
                </div>
                <div className={styles.line}>
                  <FiMail size={20} color="#000" />
                  <p>{email}</p>
                </div>
              </div>
            </>
          )}
        </div>
        <Button
          type={"purple"}
          text="Редагувати дані"
          onClick={handleEditClick}
        />
      </div>
      <div className={styles.userInfo}>
        <header>
          <h2>Мій акаунт</h2>
          <div className={styles.divider}></div>
        </header>
        <div className={styles.userAnnos}>
          <div className={styles.userAnnosCont} onClick={handleWishlistClick}>
            <AiOutlineHeart size={70} color="#026670" />
            <p>Обрані</p>
          </div>
          <div className={styles.userAnnosCont} onClick={handleMyAnnosClick}>
            <CgList size={70} color="#026670" />
            <p>Мої оголошення</p>
          </div>
        </div>
      </div>
    </div>
  );
}
