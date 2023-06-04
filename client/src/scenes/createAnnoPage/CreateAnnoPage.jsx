import React, { useEffect, useState } from "react";
import styles from "./CreateAnnoPage.module.scss";
import { Link } from "react-router-dom";
import { useInfo } from "../../App";
import Loader from "../../components/loader/Loader";

export default function CreateAnnoPage() {
  const { annos } = useInfo();

  const [currentStep, setCurrentStep] = useState(1);
  const [isFirstStepValidated, setIsFirstStepValidated] = useState(false);
  const [serverErrMessage, setServerErrMessage] = useState("");
  const [errMessage, setErrMessage] = useState("");

  const [cadInfo, setCadInfo] = useState({
    cadnum: "",
    category: "",
    purpose: "",
    use: "",
    area: "",
    ownership: "",
    address: "",
    region_name: "",
    geometry: {},
  });

  const {
    address,
    area,
    cadnum,
    category,
    ownership,
    purpose,
    region_name,
    use,
  } = cadInfo;

  const [formData, setFormData] = useState({
    cadnum: "",
    title: "",
    description: "",
    price: "",
    images: [],
    techFeatures: "",
  });

  const [errors, setErrors] = React.useState({
    cadnum: "",
    title: "",
    description: "",
    price: "",
    images: "",
    techFeatures: "",
  });

  const [isAnnoAdded, setIsAnnoAdded] = useState(false);
  const [isLandValid, setIsLandValid] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleChange = (e) => {
    setServerErrMessage("");
    setErrMessage("");
    setIsLandValid(false);
    const { name, value } = e.target;
    const regexp = () => {
      switch (name) {
        case "cadnum":
          return /^[0-9]{10}:[0-9]{2}:[0-9]{3}:[0-9]{4}$/;
        case "title":
          return /^.{15,}$/;
        case "description":
          return /^.{50,}$/;
        case "price":
          return /^\d+(\.\d{1,2})?$/;
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
    const files = e.target.files;

    // Check if any files are selected
    if (files.length === 0) {
      // Handle error: No files selected
      return;
    }

    // Check each selected file
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const selectedImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check if the file is an image
      if (!allowedTypes.includes(file.type)) {
        // Handle error: Invalid file type
        continue; // Skip this file and move to the next one
      }

      // Additional validation or processing can be added here

      selectedImages.push(file);
    }

    console.log("selected Images: ", selectedImages);
    // Update the component's state with the selected images
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        images: selectedImages,
      };
    });
  };

  const isAnnoInSystem = () => {
    return annos.filter(
      ({ cadastrInfo: cad }) => cad.cadnum === formData.cadnum
    ).length;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (isAnnoInSystem()) {
        setErrMessage(
          "Ділянка з даним кадастровим номером вже присутня в базі."
        );
      }
      const hasErrors = errors.cadnum;

      if (!hasErrors && formData.cadnum) {
        fetchLand();
        if (!isLandValid) {
          console.log(serverErrMessage);
        } else if (isAnnoInSystem()) setIsLandValid(false);
        else {
          setIsFirstStepValidated(true);
          setCurrentStep(2);
        }
      }
    } else if (currentStep === 2) {
      const hasErrors =
        errors.title ||
        errors.description ||
        errors.price ||
        errors.techFeatures;

      const isFilled =
        formData.description &&
        formData.price &&
        formData.techFeatures &&
        formData.title;
      if (!hasErrors && isFilled && !serverErrMessage.length) {
        const dataToPost = {
          title: formData.title,
          description: formData.description,
          price: +formData.price,
          // images: "",
          techFeatures: formData.techFeatures,
        };
        postAnno(dataToPost);
      } else {
        setErrMessage("Невірно заповнені поля.");
      }
    }
  };

  const fetchLand = () => {
    fetch(`${process.env.REACT_APP_URL}/api/land/${formData.cadnum}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) setServerErrMessage(data.message);
        else {
          setIsLandValid(true);
          const {
            cadnum,
            category,
            purpose,
            use,
            area,
            ownership,
            address,
            region_name,
          } = data;
          setCadInfo({
            cadnum: cadnum,
            category: category,
            purpose: purpose,
            use: use,
            area: area,
            ownership: ownership,
            address: address,
            region_name: region_name,
          });
          setIsLoaded(true);
        }
      })
      .catch((error) => {
        setServerErrMessage(error.message);
        console.log(error);
      });
  };

  const [createdPostId, setCreatedPostId] = useState("");

  const postAnno = (data) => {
    console.log(JSON.stringify(data));
    fetch(`${process.env.REACT_APP_URL}/api/anno/add/${formData.cadnum}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) setServerErrMessage(data.message);
        else {
          console.log(data);
          setCreatedPostId(data._id);
          setIsAnnoAdded(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (createdPostId !== "") uploadAnnoImages(formData.images);
  }, [createdPostId]);

  const uploadAnnoImages = (data) => {
    const formDataX = new FormData();

    // Add uploaded files to the FormData object
    Array.from(data).forEach((file, index) => {
      formDataX.append(`images`, file);
    });

    fetch(`${process.env.REACT_APP_URL}/api/anno/upload/${createdPostId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: formDataX,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.wrapper}>
      <header>
        <h2>Публікація оголошення</h2>
        <div className={styles.divider}></div>
      </header>

      {!isAnnoAdded ? (
        <div className={styles.content}>
          {currentStep === 1 && (
            <div className={styles.step}>
              <p>Введіть кадастровий номер для пошуку в реєстрі</p>
              <div className={styles.cadContainer}>
                <label>
                  <p>Кадастровий номер:</p>
                  <input
                    type="text"
                    name="cadnum"
                    placeholder="0000000000:00:000:0000"
                    value={formData.cadnum}
                    onChange={handleChange}
                    required
                  />
                  <span>{errors.cadnum}</span>
                </label>
              </div>
            </div>
          )}
          {currentStep === 2 && isFirstStepValidated && (
            <div className={styles.step}>
              {!isLoaded ? (
                <Loader />
              ) : (
                <>
                  {" "}
                  <div className={styles.cadContainer}>
                    <label>
                      <p>Кадастровий номер:</p>
                      <input
                        style={{ color: "#939393" }}
                        type="text"
                        name="cadnum"
                        placeholder="Кадастровий номер"
                        value={formData.cadnum}
                        disabled
                      />
                      <span>{errors.cadnum}</span>
                    </label>
                  </div>
                  <div className={styles.colWrapper}>
                    <div className={styles.col}>
                      <label>
                        <p>Назва (15+ символів):</p>
                        <input
                          type="text"
                          placeholder="Назва"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                        />
                        <span>{errors.title}</span>
                      </label>
                      <label>
                        <p>Опис (50+ символів):</p>
                        <textarea
                          type="text"
                          placeholder="Опис"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                        />
                        <span>{errors.description}</span>
                      </label>
                      <label>
                        <p>Ціна за продавану площу (грн):</p>
                        <input
                          type="text"
                          placeholder="100"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          required
                        />
                        <span>{errors.price}</span>
                      </label>
                      <label>
                        <p>Технічні особливості:</p>
                        <input
                          type="text"
                          placeholder="Технічні особливості"
                          name="techFeatures"
                          value={formData.techFeatures}
                          onChange={handleChange}
                          required
                        />
                        <span>{errors.techFeatures}</span>
                      </label>
                      <label>
                        <p>Зображення:</p>
                        <input
                          type="file"
                          multiple
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    <div className={styles.col}>
                      <div className={styles.row}>
                        <p>Адреса:</p>
                        <p>{address ? address : "Не вказано"}</p>
                      </div>
                      <div className={styles.row}>
                        <p>Тип власності:</p>
                        <p>{ownership}</p>
                      </div>
                      <div className={styles.row}>
                        <p>Площа:</p>
                        <p>{area} га</p>
                      </div>
                      <div className={styles.row}>
                        <p>Цільове призначення:</p>
                        <p>{purpose}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <button type="submit" onClick={handleNext}>
            {currentStep === 1 ? "Далі" : "Опублікувати"}
          </button>
          {!serverErrMessage ? (
            !errMessage ? (
              ""
            ) : (
              <p style={{ color: "red", alignSelf: "center" }}>{errMessage}</p>
            )
          ) : (
            <p style={{ color: "red", alignSelf: "center" }}>
              {serverErrMessage}
            </p>
          )}
        </div>
      ) : (
        <p className={styles.annoCreated}>
          Оголошення успішно створено.
          <Link to={`/${createdPostId}`}>Перейти до сторінки оголошення</Link>
        </p>
      )}
    </div>
  );
}

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isFirstStepValidated, setIsFirstStepValidated] = useState(false);
  const [formData, setFormData] = useState({
    // Initialize your form data fields here
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate the first step
      if (formData.firstName && formData.lastName && formData.email) {
        setIsFirstStepValidated(true);
        setCurrentStep(2);
      } else {
        // Display an error message or perform validation checks
        alert("Please fill in all the fields");
      }
    } else if (currentStep === 2) {
      // Perform any necessary actions for the second step
      // e.g., submit form data, make API calls, etc.
      // You can access all form data in the formData state object
      console.log(formData);
      alert("Form submitted successfully!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div>
      {currentStep === 1 && (
        <div>
          <h2>Step 1: Personal Information</h2>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      )}

      {currentStep === 2 && isFirstStepValidated && (
        <div>
          <h2>Step 2: Additional Information</h2>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
      )}

      <button onClick={handleNext}>
        {currentStep === 1 ? "Next" : "Submit"}
      </button>
    </div>
  );
};
