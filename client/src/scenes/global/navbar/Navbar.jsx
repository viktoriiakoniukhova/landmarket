import React, { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.scss";
import logo from "../../../assets/logo.svg";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { RiCloseLine, RiMenu3Line } from "react-icons/ri";
import { BiMoon } from "react-icons/bi";
import Button from "../../../components/button/Button";
import useModal from "../../../hooks/useModal";
import Modal from "../../../components/modal/Modal";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Loader from "../../../components/loader/Loader";

function Nav() {
  return (
    <nav>
      <NavLink
        to="/annos"
        style={({ isActive }) => ({
          color: isActive ? "#026670" : "#000",
          textDecoration: isActive ? "underline" : "none",
          textUnderlineOffset: isActive ? "5px" : "unset",
        })}
      >
        Ділянки
      </NavLink>
    </nav>
  );
}

export default function Navbar({ user, setUser, setNavbarHeight }) {
  const navbarRef = useRef(null);
  const isUserLoggedIn = user.token !== "";
  const [isLoaded, setIsLoaded] = useState(false);

  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleUserMenu, setToggleUserMenu] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fname: "",
    lname: "",
    imgURL: "",
  });

  const { fname, lname, imgURL } = userInfo;

  useEffect(() => {
    const containerHeight = navbarRef.current.clientHeight;
    setNavbarHeight(containerHeight);
  }, []);

  //Fetch user info
  useEffect(() => {
    if (isUserLoggedIn) fetchUser();
  }, [isUserLoggedIn]);

  //Logout
  const logout = () => {
    localStorage.clear();
    setUser({ token: "", id: "" });
    setToggleUserMenu((prevState) => !prevState);
  };

  //Link click
  const handleLinkClick = () => {
    setToggleUserMenu(false);
  };

  function fetchUser() {
    fetch(`${process.env.REACT_APP_URL}/api/user/${user.id}`)
      .then((res) => res.json())
      .then(({ firstname, lastname, profileImg }) => {
        setUserInfo({
          fname: firstname,
          lname: lastname,
          imgURL: profileImg,
        });
        setIsLoaded(true);
      });
  }

  // Modal window params
  const { isShowing, toggle } = useModal();

  //Redirect to create anno page
  const navigate = useNavigate();

  const handleCreateAnnoClick = () => {
    if (isUserLoggedIn) navigate("/create");
    else toggle();
  };

  return (
    <div className={styles.nav} ref={navbarRef}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <Link to="/">
            <img src={logo}></img>
          </Link>
        </div>
        <div className={styles.navLinks}>
          <Nav />
        </div>
      </div>
      <div className={styles.right}>
        <Button
          text="Додати оголошення"
          type="lightPurple"
          onClick={handleCreateAnnoClick}
        />
        {isUserLoggedIn ? (
          <div className={styles.userPanel}>
            {!isLoaded ? (
              <Loader
                width="25px"
                height="25px"
                border="3px solid #f3f4f6"
                borderTop="3px solid #026670"
              />
            ) : (
              <>
                <div className={styles.content}>
                  <div className={styles.imgContainer}>
                    <img src={imgURL} alt="user" />
                  </div>
                  <div className={styles.name}>
                    <p>{fname}</p>
                    <p>{lname}</p>
                  </div>
                </div>{" "}
                {toggleUserMenu ? (
                  <span className={styles.changeColor}>
                    <IoIosArrowUp
                      onMouseOver={({ target }) =>
                        (target.style.color = "#026670")
                      }
                      onMouseOut={({ target }) => (target.style.color = "#000")}
                      size={20}
                      color="#000"
                      onClick={() =>
                        setToggleUserMenu((prevToggle) => !prevToggle)
                      }
                    />
                  </span>
                ) : (
                  <span className={styles.changeColor}>
                    <IoIosArrowDown
                      onMouseOver={({ target }) =>
                        (target.style.color = "#026670")
                      }
                      onMouseOut={({ target }) => (target.style.color = "#000")}
                      size={20}
                      color="#000"
                      onClick={() =>
                        setToggleUserMenu((prevToggle) => !prevToggle)
                      }
                    />
                  </span>
                )}
              </>
            )}
            {toggleUserMenu && (
              <div className={styles.userMenu}>
                <Link to="/profile" onClick={handleLinkClick}>
                  Мій акаунт
                </Link>
                <Link
                  to="/"
                  style={{ color: "#999ac6", fontWeight: 800 }}
                  onClick={logout}
                >
                  Вийти
                </Link>
              </div>
            )}
          </div>
        ) : (
          <p onClick={toggle}>Увійти</p>
        )}
        <BiMoon color="#fffffff" size={27} />
      </div>
      <div className={styles.burgerMenu}>
        {toggleMenu ? (
          <RiCloseLine
            color="#fffffff"
            size={27}
            onClick={() => setToggleMenu((prevToggle) => !prevToggle)}
          />
        ) : (
          <RiMenu3Line
            color="#fffffff"
            size={27}
            onClick={() => setToggleMenu((prevToggle) => !prevToggle)}
          />
        )}
        {toggleMenu && (
          <div className={styles.menu}>
            <div className={styles.navLinks}>
              <Nav />
            </div>
            <div className={styles.right}>
              <Button text="Додати оголошення" type="lightPurple" />
              {isUserLoggedIn ? (
                <div className={styles.userPanel}>
                  <Link to="/profile">
                    <div className={styles.content}>
                      <div className={styles.imgContainer}>
                        <img src={imgURL} alt="user" />
                      </div>
                      <div className={styles.name}>
                        <p>{fname}</p>
                        <p>{lname}</p>
                      </div>
                    </div>
                  </Link>
                  <div className={styles.userBurgerMenu}>
                    {/* <Link to="/">Мій акаунт</Link> */}
                    <Link
                      to="/"
                      style={{ color: "#999ac6", fontWeight: 800 }}
                      onClick={logout}
                    >
                      Вийти
                    </Link>
                  </div>
                </div>
              ) : (
                <p onClick={toggle}>Увійти</p>
              )}
              <BiMoon color="#fffffff" size={27} />
            </div>
          </div>
        )}
      </div>
      <Modal hide={toggle} isShowing={isShowing} setUser={setUser} />
    </div>
  );
}
