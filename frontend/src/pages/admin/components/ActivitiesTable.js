import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { useSelector } from 'react-redux';
import { adminSelector, confirm, getPendingRows } from '../adminSlice';
import { accountSelector } from '../../home/accountSlice';
import { useDispatch } from 'react-redux';

const columns = [
  { 
    id: 'confirmed', 
    label: 'Confirmed', 
    maxWidth: 120,
    align: 'left',
    format: (value, id, onConfirm) => (
      <Checkbox checked={value} onClick={() => onConfirm(id)}></Checkbox>
    )
  },
  {
    id: 'direction',
    label: 'direction',
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'time',
    label: 'Time',
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'sender',
    label: 'Sender',
    minWidth: 170,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'receiver',
    label: 'Receiver',
    minWidth: 170,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'currency',
    label: 'Currency',
    minWidth: 100,
    align: 'left'
  },
  {
    id: 'amount',
    label: 'Amount',
    minWidth: 100,
    align: 'left',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'fee',
    label: 'Fee',
    minWidth: 120,
    align: 'left',
    format: (value) => value.toFixed(6),
  },
];

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

export default function ActivitiesTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { pendingRows } = useSelector(
    adminSelector
  );
  const { balance } = useSelector(accountSelector);

  const rows = (pendingRows || []).map(row => {
    const direction = row.sender == balance.address? "sent": "received";
    return {
      id: row.id,
      confirmed: row.confirmed > 0,
      time: timeConverter(row.time),
      sender: row.sender,
      receiver: row.recipient,
      amount: row.amount ,
      direction: direction,
      fee: row.fee.toFixed(6) || 0,
      currency: row.currency
    }
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const dispatch = useDispatch();

  const handleConfirm = (id) => {
    dispatch(confirm({ 
      tx: id, 
      callback: () => {
        dispatch(getPendingRows({}));
      }
    }));
  }

  return (
    <Paper sx={{ width: '95%', margin: "2%" }}>
      <TableContainer>
        <Table aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column, index) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {(column.format && typeof value === 'number') || index == 0
                            ? column.format(value, row.id, handleConfirm)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
