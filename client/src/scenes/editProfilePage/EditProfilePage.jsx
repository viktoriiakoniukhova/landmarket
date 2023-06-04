import React, { useEffect, useState } from "react";
import { useInfo } from "../../App";
import styles from "./EditProfilePage.module.scss";
import { useNavigate } from "react-router-dom";
import { IoIosAddCircle } from "react-icons/io";
import Loader from "../../components/loader/Loader";

function FormEdit({ userData, setUserData }) {
  const navigate = useNavigate();
  const { firstname, lastname, email, mobile, address, profileImg } = userData;
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    address: "",
  });
  const [imgURL, setImgURL] = useState("");

  useEffect(() => {
    setFormData({
      fname: firstname,
      lname: lastname,
      email: email,
      phone: mobile,
      address: address,
    });
    setImgURL(profileImg);
  }, [userData]);

  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    address: "",
  });

  const [imgFile, setImgFile] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasErrors =
      errors.email.length ||
      errors.fname.length ||
      errors.lname.length ||
      errors.phone.length ||
      errors.address.length;

    if (!hasErrors) {
      const dataToPost = {
        firstname: formData.fname,
        lastname: formData.lname,
        email: formData.email,
        mobile: formData.phone,
        address: formData.address,
      };

      sendData(dataToPost);
      if (imgFile.name.length) {
        uploadProfileImage(imgFile);
        setImgFile({});
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const regexp = () => {
      switch (name) {
        case "fname":
          return /^[А-ЩЬЮЯЇІЄҐ][а-щьюяїієґ']*$/;
        case "lname":
          return /^[А-ЩЬЮЯЇІЄҐ][а-щьюяїієґ']*$/;
        case "email":
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        case "phone":
          return /^\+380\d{3}\d{2}\d{2}\d{2}$/;
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Check each selected file
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    // Check if the file is an image
    if (allowedTypes.includes(file.type) && file.name) {
      setImgFile(file);
    }
  };

  const [serverErrMessage, setServerErrMessage] = useState("");

  const sendData = (data) => {
    fetch(`${process.env.REACT_APP_URL}/api/user/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) setServerErrMessage(data.message);
        else {
          setUserData(data);
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const uploadProfileImage = (file) => {
    const formDataX = new FormData();
    formDataX.append(`image`, file);
    console.log(formDataX.get("image"));
    fetch(`${process.env.REACT_APP_URL}/api/user/upload`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: formDataX,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // setUserData((prev) => ({
        //   ...prev,
        //   profileImg: data.profileImg,
        // }));
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    // <div className={styles.form}>
    <form onSubmit={handleSubmit}>
      <div className={styles.photoUploadCont}>
        <img src={imgURL} alt="user" />
        <label className={styles.uploadButton}>
          <IoIosAddCircle size={56} color="#fff" />
          <input type="file" onChange={handleImageChange} />
        </label>
      </div>
      <div className={styles.nameCont}>
        <label>
          <p>Ім'я:</p>
          <input
            type="text"
            placeholder="Ім'я"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            required
          />
          <span>{errors.fname}</span>
        </label>
        <label>
          <p>Прізвище:</p>
          <input
            type="text"
            placeholder="Прізвище"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            required
          />
          <span>{errors.lname}</span>
        </label>
      </div>
      <label>
        <p>Email:</p>
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
        <p>Телефон:</p>
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
      <label>
        <p>Адреса:</p>
        <input
          type="text"
          placeholder="Адреса"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <span>{errors.address}</span>
      </label>
      <button className={styles.submitBtn}>Оновити</button>
      {serverErrMessage === "" ? "" : <p>{serverErrMessage}</p>}
    </form>
    // </div>
  );
}

export default function EditProfilePage() {
  const { user } = useInfo();
  const [isLoaded, setIsLoaded] = useState(false);
  const [userData, setUserData] = React.useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    profileImg: "",
    address: "",
  });
  const { address, email, firstname, lastname, mobile, profileImg } = userData;

  useEffect(() => {
    fetchUser();
  }, []);

  function fetchUser() {
    fetch(`${process.env.REACT_APP_URL}/api/user/${user.id}`)
      .then((res) => res.json())
      .then(({ firstname, lastname, email, mobile, profileImg, address }) => {
        setUserData(() => ({
          firstname: firstname,
          lastname: lastname,
          email: email,
          mobile: mobile,
          profileImg: profileImg,
          address: address ? address : "",
        }));
        setIsLoaded(true);
      });
  }

  return (
    <div className={styles.wrapper}>
      <header>
        <h2>Редагувати особисті дані</h2>
        <div className={styles.divider}></div>
      </header>
      {!isLoaded ? (
        <Loader />
      ) : (
        <FormEdit userData={userData} setUserData={setUserData} />
      )}
    </div>
  );
}
