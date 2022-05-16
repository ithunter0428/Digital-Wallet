
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
import { signupUser, authSelector, clearState } from './authSlice';
import Navbar from '../../components/Navbar';

function Register() {
  const navigate  = useNavigate();
  const dispatch = useDispatch();
  const { register, errors, control, handleSubmit } = useForm();
  const { isFetching, isSuccess, isError, errorMessage } = useSelector(
    authSelector
  );

  const onSubmit = (data) => {
    dispatch(signupUser(data));
  };

  React.useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  React.useEffect(() => {
    if (isSuccess) {
      dispatch(clearState());
      navigate('/');
    }

    if (isError) {
      toast.error(errorMessage);
      dispatch(clearState());
    }
  }, [isSuccess, isError]);

  return (
    <React.Fragment>
      <nav className="navbar">
        <Navbar/>
      </nav>
      <Box sx={{ textAlign: 'center', marginTop: "60px" }}>
        <Typography component="h4" variant="h4" sx={{ fontWeight: 700 }}>Create Wallet Account</Typography>
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
            name="username"
            control={control}
            render={({ field }) => <TextField
              label="username"
              defaultValue=""
              variant="standard"
              size="small"
              sx={{ width: "300px" }}
              required
              autoComplete="username"
              {...field}
            />}
          />
          <Box sx={{ display: "flex" }}>
            <Controller
              name="firstname"
              control={control}
              render={({ field }) => <TextField
                label="first name"
                defaultValue=""
                variant="standard"
                size="small"
                sx={{ width: "140px", marginRight: "20px" }}
                required
                autoComplete="firstname"
                {...field}
              />}
            />
            <Controller
              name="lastname"
              control={control}
              render={({ field }) => <TextField
                label="last name"
                defaultValue=""
                variant="standard"
                size="small"
                sx={{ width: "140px" }}
                required
                autoComplete="lastname"
                {...field}
              />}
            />
          </Box>
          <Controller
            name="email"
            control={control}
            render={({ field }) => <TextField
              label="email"
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
          <Controller
            name="password2"
            control={control}
            render={({ field }) => <TextField
              label="confirm password"
              defaultValue=""
              variant="standard"
              sx={{ width: "300px" }}
              type="password"
              autoComplete="password2"
              {...field}
            />}
          />  
          <Controller
            name="litecoin"
            control={control}
            render={({ field }) => <TextField
              label="Litecoin Key(block.io)"
              defaultValue=""
              variant="standard"
              sx={{ width: "300px" }}
              autoComplete="litecoin"
              {...field}
            />}
          />  
          <Controller
            name="bitcoin"
            control={control}
            render={({ field }) => <TextField
              label="Bitcoin Key(block.io)"
              defaultValue=""
              variant="standard"
              sx={{ width: "300px" }}
              autoComplete="bitcoin"
              {...field}
            />}
          />  
          <Controller
            name="dogecoin"
            control={control}
            render={({ field }) => <TextField
              label="Dogecoin Key(block.io)"
              defaultValue=""
              variant="standard"
              sx={{ width: "300px" }}
              autoComplete="dogecoin"
              {...field}
            />}
          />  
          <Controller
            name="secret_pin"
            control={control}
            render={({ field }) => <TextField
              label="Secret Pin"
              defaultValue=""
              variant="standard"
              sx={{ width: "300px" }}
              autoComplete="secret_pin"
              {...field}
            />}
          />  
          <Button type="submit" variant="contained" size="large" sx={{ width: "290px", padding: "20px", borderRadius: "50px"}}>
            {isFetching ? '...Waiting': 'Create Account'}
          </Button>
          <Link href="/login">Unlock</Link>
        </Stack>
      </Box>
    </React.Fragment>
  );
}

export default Register;