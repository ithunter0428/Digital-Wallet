import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, authSelector, clearState } from './authSlice';
import Navbar from '../../components/Navbar';

function Login() {
  const navigate  = useNavigate();
  const dispatch = useDispatch();
  const { register, errors, control, handleSubmit } = useForm();
  const { isFetching, isSuccess, isError, errorMessage } = useSelector(
    authSelector
  );

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  React.useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  React.useEffect(() => {
    if (isError) {
      toast.error(errorMessage);
      dispatch(clearState());
    }
    if (isSuccess) {
      dispatch(clearState());
      navigate("/");
    }
  }, [isError, isSuccess]);

  return (
    <React.Fragment>
      <nav className="navbar">
        <Navbar/>
      </nav>
      <Box sx={{ textAlign: 'center', marginTop: "60px" }}>
        <Box
          component="img"
          sx={{
            height: 120,
            width: 120,
            maxHeight: { xs: 120, md: 90 },
            maxWidth: { xs: 120, md: 90 },
          }}
          alt="MyWallet"
          src="img/logo.webp"
        />
        <Typography component="h4" variant="h4" sx={{ marginTop: "20px", fontWeight: 700 }}>Welcome Back!</Typography>
        <Typography sx={{ marginTop: "10px"}}>
          {/* The decentralized web awaits */}
        </Typography>
        <Stack
          component="form"
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: "50px"
          }}
          spacing={3}
          noValidate
          autoComplete="off"
          method="POST"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => <TextField
              label="username"
              defaultValue=""
              variant="standard"
              size="small"
              sx={{ width: "300px" }}
              required
              autoComplete="email"
              {...field}
            />}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => <TextField
              label="password"
              defaultValue=""
              type="password"
              variant="standard"
              sx={{ width: "300px" }}
              autoComplete="password"
              {...field}
            />}
          />  
          <Button variant="contained" size="large" type="submit" sx={{ width: "290px", padding: "20px", borderRadius: "50px"}}>
            {isFetching ? '...Waiting': 'Sign In'}
          </Button>
          <Link href="/register">Create account</Link>
        </Stack>
      </Box>
    </React.Fragment>
  );
}

export default Login;
