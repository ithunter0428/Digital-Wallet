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
import { accountSelector } from '../accountSlice';

const columns = [
  { 
    id: 'confirmed', 
    label: 'Confirmed', 
    maxWidth: 120,
    align: 'left',
    format: (value, tx, onConfirm) => (
      <Checkbox checked={value} onClick={() => onConfirm(tx)}></Checkbox>
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
  const { currency, activities } = useSelector(
    accountSelector
  );

  const rows = (activities || []).map(row => {
    const direction = row.amounts_sent? "sent": "received";
    const received = row.amounts_sent? row.amounts_sent[0]: row.amounts_received[0];
    return {
      confirmed: currency.type == "coin"? true: row.confirmed,
      time: timeConverter(row.time),
      sender: row.senders[0],
      receiver: received.recipient,
      amount: received.amount ,
      direction: direction,
      fee: row.fee || 0
    }
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleConfirm = (tx) => {
    
  }

  return (
    <Paper sx={{ width: '90%', margin: "5%" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
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
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column, index) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {(column.format && typeof value === 'number') || index == 0
                            ? column.format(value, row.tx, handleConfirm)
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
