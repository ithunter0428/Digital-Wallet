import React, { Component, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";

import Header from "../../part_ui/header";
import Footer from "../../part_ui/smallpart/footer";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { Dialog } from "primereact/dialog";

import {
  getBalance,
  topUpMoney,
  transferMoney,
} from "../../actions/balanceActions";
import { logoutUser, loadUser } from "../../actions/authActions";

import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./style.css";
import FormTransfer from "./formgeninfo/formtransfer";
import FormTopUp from "./formgeninfo/formtopup";

class Balance extends Component {
  componentDidMount() {
    this.props.loadUser();
    this.props.getBalance(this.props.auth.token, this.props.auth.userID);
  }
  logout = () => {
    this.props.logoutUser(this.props.auth.token, this.props.auth.userID);
  };
  submitData = (data, type) => {
    console.log("data", data);
    console.log("Type", type);
    if (type == 1) {
      this.props.topUpMoney(
        this.props.auth.token,
        this.props.auth.userID,
        data
      );
    } else {
      this.props.transferMoney(
        this.props.auth.token,
        this.props.auth.userID,
        data
      );
    }
  };
  render() {
    if (!this.props.auth.isAuthenticated) {
      return <Redirect to="/login" />;
    }

    return (
      <MyBalance
        balance={this.props.balance}
        submitData={this.submitData}
        logout={this.logout}
        username={this.props.auth.userName}
      />
    );
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 650,
    margin: "auto",
  },
  media: {
    minHeight: 250,
  },
}));

export function MyBalance(props) {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  let [showDialog, setShowDialog] = useState(false);
  let [headerText, setHeaderText] = useState(t("answers.title"));
  let [transferHide, setTransferHide] = useState(false);
  let [topUpHide, setTopUpHide] = useState(false);
  let [type, setType] = useState(0);

  function logout() {
    props.logout();
  }

  function changeLang(lang) {
    console.log("lang ", lang);
    i18n.changeLanguage(lang);
  }

  function closeDialog() {
    console.log("CLOSE Data");
    setShowDialog(false);
  }

  function topUpMoney() {
    console.log("topUpMoney");
    setShowDialog(true);
    setHeaderText(t("balance.item.topUp"));
    setTransferHide(true);
    setTopUpHide(false);
    setType(1);
  }

  function transferMoney() {
    console.log("transferMoney");
    setShowDialog(true);
    setHeaderText(t("balance.item.transfer"));
    setTransferHide(false);
    setTopUpHide(true);
    setType(2);
  }

  function submitData(data, type) {
    props.submitData(data, type);
    setTimeout(function () {
      closeDialog();
    }, 500);
  }

  return (
    <div>
      <Header changeLang={changeLang} logout={logout} />
      <div className="bodyDiv">
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={require("./img/butterfly.jpg")}
              title="User Image"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Balance: {props.balance.balance}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {props.username}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary" onClick={topUpMoney.bind()}>
              {t("balance.item.topUp")}
            </Button>
            <Button size="small" color="primary" onClick={transferMoney.bind()}>
              {t("balance.item.transfer")}
            </Button>
          </CardActions>
        </Card>

        <Dialog
          header={headerText}
          visible={showDialog}
          style={{ width: "50vw" }}
          onHide={closeDialog.bind()}
        >
          <div className={transferHide ? "hidden" : ""}>
            <FormTransfer
              dropdownBankUser={props.balance.dropdownBankUser}
              dropdownBank={props.balance.dropdownBank}
              // data={data}
              submitData={submitData}
              // deleteDataForm={deleteDataForm}
              type={type}
            />
          </div>
          <div className={topUpHide ? "hidden" : ""}>
            <FormTopUp
              dropdownBankUser={props.balance.dropdownBank}
              // data={data}
              submitData={submitData}
              // deleteDataForm={deleteDataForm}
              type={type}
            />
          </div>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
}

Balance.propTypes = {
  getBalance: PropTypes.func.isRequired,
  topUpMoney: PropTypes.func.isRequired,
  transferMoney: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,
  balance: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  balance: state.balance,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  logoutUser,
  loadUser,
  getBalance,
  topUpMoney,
  transferMoney,
})(Balance);
