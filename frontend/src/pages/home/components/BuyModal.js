import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useSelector, useDispatch } from 'react-redux';
import { accountSelector, addFunds } from '../accountSlice';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  textAlign: "center",
  p: 4,
};

export default function BuyModal({ open, onClose, onAfterSend }) {
  const stripe = useStripe();
  const dispatch = useDispatch();
  const elements = useElements();
	const [error, setError] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [amount, setAmount] = React.useState(0);

  const { currency } = useSelector(
    accountSelector
  );
  const handleSubmit = async (event) => {
    event.preventDefault();
    const card = elements.getElement(CardElement);

    const {paymentMethod, error} = await stripe.createPaymentMethod({
        type: 'card',
        card: card
    });

    dispatch(addFunds({
      email, 
      payment_method_id: paymentMethod.id, 
      currency: currency.name, 
      amount,
      success: () => {
        onClose();
        onAfterSend();
      },
      fallback: onClose
    }));
  };

	const handleChange = (event) => {
		if (event.error) {
			setError(event.error.message);
		} else {
			setError(null);
		}
	}

  return (
    <Modal
			open={open}
			onClose={onClose}
			aria-labelledby="modal-buy"
			aria-describedby="modal-buy-description"
    >
      <Box sx={style}>
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
          onSubmit={event => handleSubmit(event)}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
            Funds {currency.name}
          </Typography>
          <Box mb={3} sx={{ display: "flex", alignItems: "center" }}>
            <Typography mr={2} sx={{ width: "80px" }}>
              Email
            </Typography>
            <TextField
              hiddenLabel 
              id="email" 
              name="email"    
              type="email" 
              sx={{ m: 1, width: '25ch' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box mb={3} sx={{ display: "flex", alignItems: "center" }}>
            <CardElement id="card-element" class="card-element" onChange={handleChange} />
            <div className="card-errors" role="alert">{error}</div>
          </Box>
          <Box mb={3} sx={{ display: "flex", alignItems: "center" }}>
            <Typography mr={2} sx={{ width: "80px" }}>
                Amount
            </Typography>
            <TextField
              hiddenLabel 
              id="amount" 
              name="amount"    
              type="amount" 
              sx={{ m: 1, width: '25ch' }}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Box>
          <Button type="submit" variant="contained" size="large" sx={{ width: "170px", padding: "10px", borderRadius: "50px"}}>
            Add Funds
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
