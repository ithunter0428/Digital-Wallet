import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import { accountSelector, sendCoin } from '../accountSlice';
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

export default function SendModal({ open, onClose }) {
  const dispatch = useDispatch();
  const [receiver, setReceiver] = React.useState("");
  const [amount, setAmount] = React.useState(0);
  const { currency } = useSelector(
    accountSelector
  );
  const handleSend = () => {
    dispatch(sendCoin({
      currency: currency.name,
      amount: amount,
      receiver: receiver
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
          Send {currency.name}
        </Typography>
        <Box mb={3} sx={{ display: "flex", alignItems: "center" }}>
          <Typography mr={2} sx={{ width: "80px" }}>
            {currency.type == "fiat"? "Username": "Address"}
          </Typography>
          <TextField
            hiddenLabel 
            id="outlined-start-adornment"
            sx={{ m: 1, width: '25ch' }}
            onChange={(e) => setReceiver(e.target.value)}
          />
        </Box>
        <Box mb={3} sx={{ display: "flex", alignItems: "center" }}>
          <Typography mr={2} sx={{ width: "80px" }}>
            Amount
          </Typography>
          <TextField
            hiddenLabel 
            id="outlined-start-adornment"
            sx={{ m: 1, width: '25ch' }}
            InputProps={{
                startAdornment: <InputAdornment position="start">{currency.symbol}</InputAdornment>,
            }}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Box>
        <Button onClick={handleSend} variant="contained" size="large" sx={{ width: "170px", padding: "10px", borderRadius: "50px"}}>
          Send {currency.name}
        </Button>
      </Box>
    </Modal>
  );
}
