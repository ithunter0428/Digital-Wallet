
import './App.css';
import * as React from 'react';
import { Outlet } from "react-router-dom";
import Home from './pages/home/Home';
import Admin from './pages/admin/Admin';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { PrivateRoute } from './helpers/PrivateRoute';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import {loadStripe} from "@stripe/stripe-js/pure";
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51KzGpXD2gb65mjKccMPrTHG4ljdgdcYjpcMcxkSsZ7na9R89p05XU4I9sBDfHBMXoxecsWAC7bPHSVwLlCJoCQD200wjuPICjD');


function App() {
  return (
    <div className="App">
      <Outlet />
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Elements stripe={stripePromise}>
                  <Home />
                </Elements>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
