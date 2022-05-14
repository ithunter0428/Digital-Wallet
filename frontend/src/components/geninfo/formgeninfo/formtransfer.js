import React from "react";
import { useTranslation } from "react-i18next";
import { ErrorMessage, Formik, Form, Field } from "formik";
import { object, string, number } from "yup";
import { TextField, FormGroup, Button, MenuItem } from "@material-ui/core/";

import "../style.css";

export default function FormTransfer(props) {
  const { t } = useTranslation();
  let initialValues = {
    user_agent: "",
    bank: 0,
    send_to_bank: 0,
    balance_after: 0,
  };
  return (
    <div className="bodyForm">
      <Formik
        validationSchema={object({
          user_agent: string().required(t("balance.error.required.user_agent")),
          bank: number().required().min(1, t("balance.error.min.bank")),
          send_to_bank: number()
            .required()
            .min(1, t("balance.error.min.sendToBank")),
          balance_after: number()
            .required()
            .min(5, t("balance.error.min.balanceAfter")),
        })}
        initialValues={initialValues}
        onSubmit={(values, formikHelpers) => {
          props.submitData(values, props.type);
        }}
      >
        {({ values, errors, isSubmitting, isValidating, isValid }) => (
          <Form>
            <h2>{t("balance.item.userInfo")}</h2>
            <FormGroup style={{ marginBottom: 10 }}>
              <Field
                name="bank"
                as={TextField}
                label={t("balance.item.bank")}
                variant="outlined"
                select
              >
                <MenuItem value={0}>{t("balance.item.selectBank")}</MenuItem>
                {props.dropdownBankUser.map((item) => (
                  <MenuItem key={item.bank} value={item.bank}>
                    {item.bank_name}
                  </MenuItem>
                ))}
              </Field>
            </FormGroup>
            <h2>{t("balance.item.sendInfo")}</h2>
            <FormGroup style={{ marginBottom: 10 }}>
              <Field
                name="user_agent"
                as={TextField}
                label={t("balance.item.user_agent")}
                variant="outlined"
              />
              <div className="errorDiv">
                <ErrorMessage name="user_agent" />
              </div>
            </FormGroup>
            <FormGroup style={{ marginBottom: 10 }}>
              <Field
                name="send_to_bank"
                as={TextField}
                label={t("balance.item.send_to_bank")}
                variant="outlined"
                select
              >
                <MenuItem value={0}>
                  {t("balance.item.selectSendBank")}
                </MenuItem>
                {props.dropdownBank.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.code}
                  </MenuItem>
                ))}
              </Field>
            </FormGroup>
            <FormGroup style={{ marginBottom: 10 }}>
              <Field
                name="balance_after"
                as={TextField}
                label={t("balance.item.balance_after")}
                variant="outlined"
                type="number"
              />
              <div className="errorDiv">
                <ErrorMessage name="balance_after" />
              </div>
            </FormGroup>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isValid}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
