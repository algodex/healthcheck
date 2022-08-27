import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import getData from '../lib/get_data';
import { useEffect, useState } from 'react';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

interface FileSystemStatus {
  file_system: string,
  size: string,
  used: string,
  available: string,
  use_percent: string,
  mounted_on: string
}

interface StatusData {
  _id: string,
  _rev: string,
  external_ipaddr: string,
  hostname: string,
  datetime: string,
  unix_time: number,
  server_name: string,
  filesystem_status: Array<FileSystemStatus>
}

export default function BasicTable() {
  const [statusData, setStatusData] = useState<Array<StatusData>>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setStatusData(data);
      console.log('data is: ' + data);
    }
    fetchData();
  },[]);
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{'color':'#666'}}>
Algodex Health Status      
</Typography>
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Server Name</TableCell>
            <TableCell align="right">Host Name</TableCell>
            <TableCell align="right">Disk Usage</TableCell>
            <TableCell align="right">Ip Address</TableCell>
            <TableCell align="right">Last Update</TableCell>
            <TableCell align="right">Mounted On</TableCell>
            <TableCell align="right">File System</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {statusData.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.server_name}
              </TableCell>
              <TableCell align="right">{row.hostname}</TableCell>
              <TableCell align="right">
                {row.filesystem_status[0].used} &nbsp;
                ({row.filesystem_status[0].use_percent})</TableCell>
              <TableCell align="right">{row.external_ipaddr}</TableCell>
              <TableCell align="right">{row.datetime}</TableCell>
              <TableCell align="right">{row.filesystem_status[0].mounted_on}</TableCell>
              <TableCell align="right">{row.filesystem_status[0].file_system}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Container>
  );
}
