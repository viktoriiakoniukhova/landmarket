import React, { useState } from "react";
import styles from "./InfoPage.module.scss";
import infoData from "../../assets/qa.json";
import { v4 as uuidv4 } from "uuid";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./acc.css";
function QuestionCard({ title, desc }) {
  const [toggleAnswer, setToggleAnswer] = useState(false);

  //Handle expand click
  const handleClick = () => {
    setToggleAnswer((prev) => !prev);
  };

  return (
    <Accordion className={styles.questionWrapper}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h3>{title}</h3>
      </AccordionSummary>

      <AccordionDetails>
        <div
          dangerouslySetInnerHTML={{ __html: desc }}
          className={styles.descWrapper}
        ></div>
      </AccordionDetails>
    </Accordion>
  );
}

function InfoSectionCard({ title, questionsArr }) {
  return (
    <div className={styles.infoSectionWrapper}>
      <header>
        <h2>{title}</h2>
        <div className={styles.divider}></div>
      </header>
      {questionsArr.map((question) => (
        <QuestionCard
          key={uuidv4()}
          title={question.title}
          desc={question.descriptionHtml}
        />
      ))}
    </div>
  );
}

export default function InfoPage() {
  return (
    <div className={styles.wrapper}>
      {infoData.categories.map((category) => (
        <InfoSectionCard
          key={uuidv4()}
          title={category.categoryName}
          questionsArr={category.questions}
        />
      ))}
    </div>
  );
}
