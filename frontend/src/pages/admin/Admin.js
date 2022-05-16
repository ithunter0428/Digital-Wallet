
import * as React from 'react';
import './Admin.css';
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/Navbar';
import ActivitiesTable from './components/ActivitiesTable';
import { useDispatch } from 'react-redux';
import { getPendingRows } from './adminSlice';
import toast from 'react-hot-toast';

function Admin() {
  const navigate = useNavigate();
  const onLogOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getPendingRows({}));
  }, []);

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
