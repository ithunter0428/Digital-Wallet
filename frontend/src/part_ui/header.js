import React from "react";

import PropTypes from "prop-types";

import { Divider } from "@material-ui/core";

import NavBar from "./smallpart/navbar";

export default function Header(props) {
  return (
    <div>
      <NavBar changeLang={props.changeLang} logout={props.logout} />
      <Divider />
    </div>
  );
}

//PropTypes
Header.propTypes = {
  changeLang: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};
