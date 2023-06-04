import React from "react";
import { useState } from "react";
import styles from "./Dropdown.module.scss";
import { v4 as uuidv4 } from "uuid";

export default function Dropdown({ options, onSelectOption }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option, index) => {
    setSelectedOption(index);
    onSelectOption(index);
    setIsOpen(false);
  };

  return (
    <div className={styles.customDropdown}>
      <div className={styles.header} onClick={toggleDropdown}>
        <p>
          {options[selectedOption].text
            ? options[selectedOption].text
            : "Для вас"}
        </p>
      </div>
      <div className={styles.imgContainer}>
        {options[selectedOption].imgURL && (
          <img
            src={options[selectedOption].imgURL}
            alt={options[selectedOption].text}
          />
        )}
      </div>
      {isOpen && (
        <ul className={styles.optionsList}>
          {options.map((option, index) => (
            <li
              key={uuidv4()}
              className={styles.option}
              onClick={() => handleOptionSelect(option, index)}
            >
              <p>{option.text}</p>
              <div className={styles.imgContainer}>
                {options[index].imgURL && (
                  <img src={options[index].imgURL} alt={options[index].text} />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
