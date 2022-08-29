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
import { getData, FileSystemStatus, StatusData} from '../lib/get_data';
import { useEffect, useState } from 'react';

const getColor = (usePercentFormatted:string) => {
  const regexp = /([0-9]+)%/;
  const match = usePercentFormatted.match(regexp)!;

  if (parseFloat(match[0]) > 85) {
    return '#f6a5c0'; // red
  } else if (parseFloat(match[0]) > 60) {
    return '#fff7b0'; // yellow
  }
  return '#b7deb8'; //green
}

export default function BasicTable() {
  const [statusData, setStatusData] = useState<Array<StatusData>>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setStatusData(data);
    }
    fetchData();
    setInterval(() => {
      fetchData()
    }, 1000 * 60) // in milliseconds
  },[]);
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{'color':'#444'}}>
Algodex Health Status      
</Typography>
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell >Server Name</TableCell>
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
              key={row._id+':'+row.filesystem_status[0].file_system}
              sx={{ 'background': getColor(row.filesystem_status[0].use_percent), '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{whiteSpace: 'nowrap'}}>
                {row.server_name}
              </TableCell>
              <TableCell align="right">{row.hostname}</TableCell>
              <TableCell align="right" sx={{whiteSpace: 'nowrap'}}>
                {row.filesystem_status[0].used} &nbsp;
                ({row.filesystem_status[0].use_percent})</TableCell>
              <TableCell align="right">{row.external_ipaddr}</TableCell>
              <TableCell align="right" sx={{whiteSpace: 'nowrap'}}>{row.datetime}</TableCell>
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
