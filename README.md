# GenioPay Wallet
#### _Minimalistic Version_

GenioPay Wallet is a wallet which holds both of fiat and crypto wallet.

- Fiat Wallet Currencies: USD, GBP, EUR
- Crypto Wallet Currencies: Bitcoin, Litecoin, Dogecoin

## Features

- Add fiat fund to wallet by Debit Cards. Payment is processed by Stripe.
- Crypto wallet uses Block.io.

## Frameworks
 - Front-end: React/Javascript
 - Back-end: Django/Python

## Database
Django used Sqlite for its database.
To delete database completely, delete `backend/db.sqlite3`.
How to build new database:
```sh
python manage.py migrate
```
Create super user:
```sh
python manage.py createsuperuser
```
## Run backend
In `backend` directory, run command:
```sh
python manage.py runserver
```
Default port num is `8000`
## Run frontend
In `frontend` direnctory, run command:
```sh
npm start
```
Default port num is `3000`
## How to use wallet
Go to http://localhost:3000/login
#### Create new wallet
 - Input user name and password and other info
 - Input your Block.io API Key and Secret Pin for your crypto wallet
#### Wallet display info
 - Balance
-- `Available balance` is amount that user can manage or transfer
-- `Pending received balance` is amount that is made but not confirmed amount
 - Activities
   Show recent transactions of current currency
#### Add fund to fiat wallet
 - Click `Funds`
 - Input debit card info and amount to add
 - Amount must be >= 5, <= 500
 - Wait for transaction to be confirmed
#### Confirm add-fund transaction in admin
 - Go to http://localhost:3000/admin
 - Click one transaction in the table to confirm
#### Transfer fund in fiat wallet
 - Click `Transfer`
 - Input recipient username and amount to transfer
 - Transfer transaction is confirmed immediately
#### Transfer fund in crypto wallet
 - Input recipient address and amount to transfer
 - Wait for trasaction to be confirmed in blockchain network
#### Change wallet name
 - Click right-top-corner button
 - Click `Change Wallet Name`
 - Input new name
### Close wallet
 - Empty fiat fund is needed to close wallet
 - Click right-top-corner button and click `Close Wallet`
## Test backend
```sh
python manage.py test wallet.tests
python manage.py test crypto.tests
python manage.py test fiat.tests
```
