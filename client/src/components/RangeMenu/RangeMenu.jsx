import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./RangeMenu.module.scss";

export default function RangeMenu({
  initialValues,
  setRange,
  toggleRange,
  isActive,
  activity,
}) {
  const validationSchema = Yup.object({
    minValue: Yup.number()
      .typeError("Поле повинне бути числом")
      .positive("Поле повинне бути додатнім"),
    maxValue: Yup.number()
      .typeError("Поле повинне бути числом")
      .positive("Поле повинне бути додатнім")
      .moreThan(Yup.ref("minValue"), "MIN повинне бути менше за MAX"),
  });

  const handleInputChange = (e) => {
    formik.setFieldTouched(e.target.name, true);
    formik.handleChange(e);
  };

  const onSubmit = (values) => {
    const { minValue, maxValue } = values;
    setRange({
      minValue: minValue,
      maxValue: maxValue,
    });
    toggleRange(false);
    isActive(true);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className={styles.wrapper}>
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.fieldsWrapper}>
          <div className={styles.field}>
            <input
              type="number"
              id="minValue"
              name="minValue"
              value={formik.values.minValue}
              onChange={handleInputChange}
              onBlur={formik.handleBlur}
              placeholder="MIN"
            />
            {formik.touched.minValue && formik.errors.minValue && (
              <span>{formik.errors.minValue}</span>
            )}
          </div>
          <div className={styles.separator}></div>
          <div className={styles.field}>
            <input
              type="number"
              id="maxValue"
              name="maxValue"
              value={formik.values.maxValue}
              onChange={handleInputChange}
              onBlur={formik.handleBlur}
              placeholder="MAX"
            />
            {formik.touched.maxValue && formik.errors.maxValue && (
              <span>{formik.errors.maxValue}</span>
            )}
          </div>
        </div>

        <div className={styles.buttonsWrapper}>
          <button type="submit" disabled={!formik.isValid}>
            Знайти
          </button>
          <p
            onClick={() => {
              toggleRange(false);
              setRange({
                minValue: "",
                maxValue: "",
              });
              isActive(false);
            }}
            style={activity ? { color: "red" } : { color: "black" }}
          >
            Скинути
          </p>
        </div>
      </form>
    </div>
  );
}
