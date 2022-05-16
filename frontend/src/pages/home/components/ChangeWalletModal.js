import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { changeWallet } from '../accountSlice';
import { useDispatch } from 'react-redux';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  textAlign: "center",
  p: 4,
};

export default function ChangeWalletModal({ open, onClose }) {
  const dispatch = useDispatch();
  const [name, setName] = React.useState("");
  const handleSubmit = () => {
    dispatch(changeWallet({ 
      name: name,
      success: () => {
        onClose();
        localStorage.setItem("wallet_name", name);
      },
      fallback: onClose
    }));
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-buy"
      aria-describedby="modal-buy-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
          Change Wallet
        </Typography>
        <TextField
          hiddenLabel 
          id="outlined-start-adornment"
          sx={{ m: 1, width: '25ch' }}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <Button onClick={handleSubmit} variant="contained" size="large" sx={{ width: "170px", padding: "10px", borderRadius: "50px"}}>
          Change Wallet
        </Button>
      </Box>
    </Modal>
  );
}
