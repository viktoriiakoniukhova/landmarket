import React, { useEffect, useState } from "react";
import styles from "./AnnoPage.module.scss";
import { useParams } from "react-router-dom";
import { useInfo } from "../../App";
import Map from "../../components/map/Map";
import currencyFilter from "../../filter/currency.filter";
import getDateDiffInDays from "../../hooks/getDateDiffInDays";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaShare } from "react-icons/fa";
import { FiPhoneCall, FiUser, FiMail, FiPhone } from "react-icons/fi";
import AnnoSwiper from "../../components/swiper/AnnoSwiper";
import useModal from "../../hooks/useModal";
import Modal from "../../components/modal/Modal";
import Loader from "../../components/loader/Loader";

function Form({ annoId, isUserLoggedIn }) {
  const [formData, setFormData] = React.useState({
    fname: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = React.useState({
    fname: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasErrors =
      errors.email.length ||
      errors.fname.length ||
      errors.phone.length ||
      errors.message.length;

    if (!isUserLoggedIn) {
      alert("Ви маєте бути авторизовані в системі для відправки повідомлень");
      return;
    }
    if (!hasErrors) {
      alert("Повідомлення успішно надіслано");
      const dataToPost = {
        name: formData.fname,
        from: formData.email,
        phone: formData.phone,
        text: formData.message,
      };
      sendData(dataToPost);
      setFormData({
        fname: "",
        email: "",
        phone: "",
        message: "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const regexp = () => {
      switch (name) {
        case "fname":
          return /^[а-яА-ЯІіЇїЄєҐґ'ў\s]+$/;
        case "email":
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        case "phone":
          return /^\+380\d{2}\d{3}\d{2}\d{2}$/;
        default:
          return;
      }
    };

    !value.match(regexp())
      ? setErrors((prevErrorsData) => {
          return {
            ...prevErrorsData,
            [name]: `${name} не валідне`,
          };
        })
      : setErrors((prevErrorsData) => {
          return {
            ...prevErrorsData,
            [name]: "",
          };
        });

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  };

  const sendData = (formData) => {
    fetch(`${process.env.REACT_APP_URL}/api/anno/${annoId}/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then()
      .catch((error) => console.error(error));
  };

  return (
    // <div className={styles.form}>
    <form onSubmit={handleSubmit}>
      <label>
        <FiUser size={20} color="#393939" className={styles.icon} />
        <input
          type="text"
          placeholder="Прізвище Ім'я"
          name="fname"
          value={formData.fname}
          onChange={handleChange}
          required
        />
        <span>{errors.fname}</span>
      </label>
      <label>
        <FiMail size={20} color="#393939" className={styles.icon} />
        <input
          type="text"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <span>{errors.email}</span>
      </label>
      <label>
        <FiPhoneCall size={20} color="#393939" className={styles.icon} />
        <input
          type="text"
          placeholder="Телефон"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <span>{errors.phone}</span>
      </label>
      <label className={styles.textareaInput}>
        <textarea
          type="text"
          placeholder="Мене зацікавила ваша пропозиція"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />
      </label>
      <button
        disabled={!isUserLoggedIn}
        className={!isUserLoggedIn ? styles.disabled : styles.submitBtn}
      >
        Надіслати
      </button>
    </form>
    // </div>
  );
}

export default function AnnoPage() {
  const { navbarHeight, user, setUser } = useInfo();
  const isUserLoggedIn = user.token !== "";
  const [isLoaded, setIsLoaded] = useState(false);

  const { annoId } = useParams();

  const [anno, setAnno] = useState({
    _id: "",
    title: "",
    description: "",
    price: 0,
    images: [],
    techFeatures: "",
    owner: "",
    likes: [],
    views: 0,
    createdAt: "",
    cadastrInfo: {},
  });

  const [cadInfo, setCadInfo] = useState([
    {
      cadnum: "",
      category: "",
      purpose: "",
      use: "",
      area: "",
      ownership: "",
      address: "",
      region_name: "",
      geometry: {},
    },
  ]);

  const [ownerInfo, setOwnerInfo] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    address: "",
    profileImg: "",
  });
  const [userWishlist, setUserWishlist] = useState([]);

  const {
    address: cadAddress,
    area,
    cadnum,
    category,
    ownership,
    purpose,
    region_name,
    use,
  } = cadInfo[0];

  const {
    firstname,
    lastname,
    email,
    mobile,
    address: ownerAddress,
    profileImg,
  } = ownerInfo;

  const {
    _id,
    title,
    description,
    price,
    images,
    techFeatures,
    owner,
    likes,
    views,
    createdAt,
    cadastrInfo,
  } = anno;

  const hasAdress = cadAddress.length;
  const newAddress = cadAddress.length ? cadAddress : region_name;
  const numOfLikes = likes ? likes.length : 0;
  const newTechFeatures = techFeatures === "" ? techFeatures : "Відстуні";

  useEffect(() => {
    fetchAnno();
    fetchUserWishlist();
  }, []);

  function fetchAnno() {
    fetch(`${process.env.REACT_APP_URL}/api/anno/${annoId}`)
      .then((res) => res.json())
      .then((data) => {
        setAnno(data);
        setCadInfo([data.cadastrInfo]);
        setOwnerInfo(data.owner);
      });
  }

  function fetchUserWishlist() {
    fetch(`${process.env.REACT_APP_URL}/api/user/wishlist`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((res) => res.json())
      .then(({ wishlist }) => {
        setUserWishlist(wishlist);
        setIsLoaded(true);
      });
  }

  const addedWhen = (createdAt) => {
    const createdAtD = new Date(createdAt);
    const currentDate = new Date();
    return getDateDiffInDays(createdAtD, currentDate);
  };

  // Modal window params
  const { isShowing, toggle } = useModal();

  const handleLikeClick = () => {
    if (isUserLoggedIn) {
      likeAnno();
      setIsLiked((prev) => !prev);
    }
    if (!isUserLoggedIn) toggle();
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: anno.title,
          text: anno.description,
          url: window.location.href, // URL to be shared
        })
        .then(() => {
          console.log("Sharing succeeded.");
        })
        .catch((error) => {
          console.error("Error sharing:", error);
        });
    } else {
      console.log("Web Share API is not supported in this browser.");
    }
  };

  const likeAnno = () => {
    fetch(`${process.env.REACT_APP_URL}/api/anno/like/${_id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAnno((prev) => ({ ...prev, likes: data.likes }));
      });
  };

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (userWishlist)
      setIsLiked(userWishlist.filter(({ _id: id }) => id === _id).length);
  }, [userWishlist]);

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.mapWrapper}
        style={{ height: `calc(100vh - ${navbarHeight}px)` }}
      >
        <Map landData={cadInfo} />
      </div>
      <div
        className={styles.annoWrapper}
        style={{ height: `calc(100vh - ${navbarHeight}px)` }}
      >
        {!isLoaded ? (
          <Loader />
        ) : (
          <>
            <header>
              <div className={styles.left}>
                <h3> {title}</h3>
                <div className={styles.secondaryInfo}>
                  <p>{cadnum}</p>
                  <p>{newAddress}</p>
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.mainInfo}>
                  <h3>{currencyFilter(price)}</h3>
                  <h3>{area} га</h3>
                </div>
                <div className={styles.stats}>
                  <p>Додано {addedWhen(createdAt)} днів назад</p>
                  <div className={styles.subStats}>
                    <div className={styles.stat}>
                      <AiOutlineHeart size={20} color="#393939" />
                      <p>{numOfLikes}</p>
                    </div>
                    <div className={styles.stat}>
                      <AiOutlineEye size={20} color="#393939" />
                      <p>{views}</p>
                    </div>
                  </div>
                  <div className={styles.buttons}>
                    <button onClick={handleShareClick}>
                      Поділитись
                      <FaShare size={20} color="#fff" />
                    </button>
                    <button
                      style={
                        isLiked
                          ? {
                              backgroundColor: "#c2c2dd",
                              borderColor: "#c2c2dd",
                            }
                          : {
                              backgroundColor: "#026670",
                              borderColor: "#026670",
                            }
                      }
                      onClick={handleLikeClick}
                      // disabled={!isUserLoggedIn}
                      // className={!isUserLoggedIn ? styles.disabled : ""}
                    >
                      <AiFillHeart size={20} color="#fff" />
                    </button>
                  </div>
                </div>
              </div>
            </header>
            <div className={styles.imagesContainer}>
              <AnnoSwiper images={images} />
              {/* <img src={imgURL} alt="land" /> */}
            </div>
            <div className={styles.main}>
              <div className={styles.left}>
                <p>{description}</p>
                <div className={styles.details}>
                  <header>
                    <h3>Деталі</h3>
                    <div className={styles.divider}></div>
                  </header>
                  <div className={styles.content}>
                    <p>
                      {hasAdress ? "адреса:" : "регіон:"}{" "}
                      <span>{newAddress}</span>
                    </p>
                    <p>
                      площа:<span>{area} га</span>
                    </p>
                    <p>
                      кадастровий номер:<span>{cadnum}</span>
                    </p>
                    <p>
                      вид угідь:<span>{category}</span>
                    </p>
                    <p>
                      цільове призначення:<span>{purpose}</span>
                    </p>
                    <p>
                      тип власності:<span>{ownership}</span>
                    </p>
                    <p>
                      технічні особливості:<span>{newTechFeatures}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.ownerCard}>
                  <h3>{`${firstname} ${lastname}`}</h3>
                  {ownerAddress && <p>{ownerAddress}</p>}
                  <div className={styles.phone}>
                    <FiPhoneCall size={20} color="#000" />
                    <a href={`tel:${mobile}`}>
                      <p>{mobile}</p>
                    </a>
                  </div>
                </div>
                <div className={styles.formWrapper}>
                  <header>
                    <h2>Написати власнику</h2>
                    <div className={styles.divider}></div>
                  </header>
                  <Form annoId={_id} isUserLoggedIn={isUserLoggedIn} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Modal hide={toggle} isShowing={isShowing} setUser={setUser} />
    </div>
  );
}
