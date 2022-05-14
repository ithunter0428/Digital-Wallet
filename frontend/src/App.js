import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import LogIn from "./components/auth/login";

import Balance from "./components/geninfo/balance";

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from "@stripe/stripe-js/pure";
import CheckoutForm from "./components/CheckoutForm";

const stripePromise = loadStripe('pk_test_51Kz7q2GskKmf1K7OjTLGeLXAlH2A4g5DeD2VTkbQfm3oz8uMmBTDFCMXmeV0rPwgUXKEluhFDv6IgRuvdY6BdDp200cUsFOTpf');

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Route exact path="/login" component={LogIn} />
          <Route exact path="/" render={() => <Redirect to="/balance" />} />
          <Route exact path="/balance" component={Balance} />
        </div>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </Provider>
    );
  }
}

export default App;
