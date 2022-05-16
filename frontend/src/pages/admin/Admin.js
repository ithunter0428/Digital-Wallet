
import * as React from 'react';
import './Admin.css';
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/Navbar';
import Box from '@mui/material/Box';
import ActivitiesTable from './components/ActivitiesTable';
import { useDispatch, useSelector } from 'react-redux';
import { getPendingRows, accountSelector } from './accountSlice';

function Admin() {
  const navigate = useNavigate();
  const onLogOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  const { currency } = useSelector(
    accountSelector
  );
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getPendingRows({currency: currency.name}));
  }, [currency.name])

  return (
    <>
      <nav className="navbar">
        <Navbar onLogOut={onLogOut} />
      </nav>
      <React.Fragment>
        <ActivitiesTable/>
      </React.Fragment>
    </>
  );
}

export default Admin;
