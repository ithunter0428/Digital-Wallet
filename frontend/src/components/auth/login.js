import React, { Component } from "react";
// import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { ErrorMessage, Formik, Form, Field } from "formik";
import { Redirect } from "react-router-dom";
import { object, string } from "yup";
import { TextField, FormGroup, Button } from "@material-ui/core/";
import "./style.css";
import { loginUser } from "../../actions/authActions";

class LogIn extends Component {
  submitData = (data) => {
    this.props.loginUser(data);
  };
  render() {
    if (this.props.auth.isAuthenticated) {
      return <Redirect to="/balance" />;
    }
    return (
      <div>
        <MyLogin submitData={this.submitData} />
      </div>
    );
  }
}

export function MyLogin(props) {
  // const { t } = useTranslation();
  const initialValues = {
    username: "",
    password: "",
  };

  return (
    <div className="bigBox">
      <div className="middleBox">
        <h1>Log In</h1>
        <Formik
          validationSchema={object({
            username: string().required(),
            password: string().required(),
          })}
          initialValues={initialValues}
          onSubmit={(values, formikHelpers) => {
            props.submitData(values);
          }}
        >
          {({ values, errors, isSubmitting, isValidating, isValid }) => (
            <Form>
              <FormGroup style={{ marginBottom: 10 }}>
                <Field
                  name="username"
                  as={TextField}
                  label="User Name"
                  variant="outlined"
                />
                <div className="errorDiv">
                  <ErrorMessage name="username" />
                </div>
              </FormGroup>
              <FormGroup style={{ marginBottom: 10 }}>
                <Field
                  name="password"
                  type="password"
                  as={TextField}
                  label="Password"
                  variant="outlined"
                />
                <div className="errorDiv">
                  <ErrorMessage name="password" />
                </div>
              </FormGroup>
              {/* <FormGroup style={{ marginBottom: 10 }}>
                <Link to="/register">{t("auth.register")}</Link>
              </FormGroup> */}

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
    </div>
  );
}

LogIn.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  loginUser,
})(LogIn);
