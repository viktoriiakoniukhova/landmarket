import React, { useState } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.scss";
import { IoMdClose } from "react-icons/io";

function FormLogin({ hide, setUser }) {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = React.useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasErrors = errors.email.length || errors.password.length;

    // if (!isUserLoggedIn) {
    //   alert("Ви маєте бути авторизовані в системі для відправки повідомлень");
    //   return;
    // }

    if (!hasErrors) {
      const dataToPost = {
        email: formData.email,
        password: formData.password,
      };
      sendData(dataToPost);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const regexp = () => {
      switch (name) {
        case "email":
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        case "pwd":
          return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
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

  const [serverErrMessage, setServerErrMessage] = useState("");

  function sendData(data) {
    fetch(`${process.env.REACT_APP_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) setServerErrMessage(data.message);
        else {
          hide();
          localStorage.setItem("token", JSON.stringify(data.token));
          localStorage.setItem("id", JSON.stringify(data._id));
          setUser({ token: data.token, id: data._id });
          setFormData({
            email: "",
            password: "",
          });
        }
      })
      .catch((error) => console.error(error));
  }

  return (
    // <div className={styles.form}>
    <form onSubmit={handleSubmit}>
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
        <p>Password:</p>
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <span>{errors.password}</span>
      </label>
      <button className={styles.submitBtn}>Увійти</button>
      {serverErrMessage === "" ? "" : <p>{serverErrMessage}</p>}
    </form>
    // </div>
  );
}

function FormRegister({ setType }) {
  const [formData, setFormData] = React.useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    pwd: "",
  });

  const [errors, setErrors] = React.useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    pwd: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasErrors =
      errors.email.length ||
      errors.fname.length ||
      errors.lname.length ||
      errors.phone.length ||
      errors.pwd.length;

    // if (!isUserLoggedIn) {
    //   alert("Ви маєте бути авторизовані в системі для відправки повідомлень");
    //   return;
    // }

    if (!hasErrors) {
      const dataToPost = {
        firstname: formData.fname,
        lastname: formData.lname,
        email: formData.email,
        mobile: formData.phone,
        password: formData.pwd,
      };
      sendData(dataToPost);
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
        case "pwd":
          return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
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

  const [serverErrMessage, setServerErrMessage] = useState("");

  const sendData = (data) => {
    fetch(`${process.env.REACT_APP_URL}/api/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) setServerErrMessage(data.message);
        else {
          setType("registered");
          setFormData({
            fname: "",
            lname: "",
            email: "",
            phone: "",
            pwd: "",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    // <div className={styles.form}>
    <form onSubmit={handleSubmit}>
      <div className={styles.nameCont}>
        <label>
          <p>Прізвище:</p>
          <input
            type="text"
            placeholder="Прізвище"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            required
          />
          <span>{errors.fname}</span>
        </label>
        <label>
          <p>Ім'я:</p>
          <input
            type="text"
            placeholder="Ім'я"
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
        <p>Password:</p>
        <input
          type="password"
          placeholder="Password"
          name="pwd"
          value={formData.pwd}
          onChange={handleChange}
          required
        />
        <span>{errors.pwd}</span>
      </label>
      <button className={styles.submitBtn}>Зареєструватись</button>
      {serverErrMessage === "" ? "" : <p>{serverErrMessage}</p>}
    </form>
    // </div>
  );
}

export default function Modal({ isShowing, hide, setUser }) {
  const [type, setType] = React.useState("login"); //Radiobutton

  return (
    <>
      {isShowing
        ? ReactDOM.createPortal(
            <React.Fragment>
              <div className={styles.modalOverlay} />
              <div className={styles.modalWrapper} tabIndex={-1} role="dialog">
                <div
                  className={styles.modal}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.modalHeader}>
                    <button
                      onClick={() => {
                        hide();
                        setType("login");
                      }}
                    >
                      <IoMdClose size={16} color="#fff" />
                    </button>
                  </div>
                  <div className={styles.modalContent}>
                    {/* <div className={styles.switcher}>
                      <input
                        type="radio"
                        name="login"
                        value="login"
                        id="login"
                        checked={type === "login"}
                        onChange={(e) => setType(e.target.value)}
                      />
                      <label
                        className={
                          type === "login" ? `${styles.active}` : undefined
                        }
                        htmlFor="login"
                      >
                        <h3>Login</h3>
                      </label>
                      <input
                        type="radio"
                        name="register"
                        value="register"
                        id="register"
                        checked={type === "register"}
                        onChange={(e) => setType(e.target.value)}
                      />
                      <label
                        className={
                          type === "register" ? `${styles.active}` : undefined
                        }
                        htmlFor="register"
                      >
                        <h3>Register</h3>
                      </label>
                    </div> */}
                    {type === "login" ? (
                      <div className={styles.loginWrapper}>
                        <FormLogin hide={hide} setUser={setUser} />
                        <div className={styles.divider}></div>
                        <footer>
                          Не маєте акаунту?
                          <span onClick={() => setType("register")}>
                            Зареєструватись
                          </span>
                        </footer>
                      </div>
                    ) : type === "registered" ? (
                      <div className={styles.registeredWrapper}>
                        Вітаю! Ви успішно зареєструвались в системі. Тепер ви
                        можете
                        <span onClick={() => setType("login")}>Увійти</span>.
                      </div>
                    ) : (
                      <div className={styles.registerWrapper}>
                        <FormRegister setType={setType} />
                        <div className={styles.divider}></div>
                        <footer>
                          Вже маєте акаунт?
                          <span onClick={() => setType("login")}>Увійти</span>
                        </footer>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>,
            document.body
          )
        : null}
    </>
  );
}
