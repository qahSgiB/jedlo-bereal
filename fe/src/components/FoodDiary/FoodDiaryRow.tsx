import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { styled } from '@mui/material';


interface TableData {
    name: string,
    grams: number,
    kcal?: number,
    fat?: number,
    carbs?: number,
    protein?: number,
}

const StyledTableRow = styled(TableRow)(() => ({
    backgroundColor: 'var(--background-white)' ,
    fontFamily: 'DM Sans, sans-serif',
}));

const StyledTableBody = styled(TableBody)(() => ({
    backgroundColor: 'var(--background-white)' ,
    fontFamily: 'DM Sans, sans-serif',
}));

const StyledTableCell = styled(TableCell)(() => ({
    fontFamily: 'DM Sans, sans-serif',
}));

export default function Row(props: { row: TableData }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
  
    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <StyledTableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </StyledTableCell>
          <StyledTableCell component="th" scope="row">
            {row.name}
          </StyledTableCell>
          <StyledTableCell align="right">{row.grams}</StyledTableCell>
        </TableRow>
        <TableRow>
          <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div" fontFamily='DM Sans, sans-serif'>
                  Macros
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>Fat</StyledTableCell>
                      <StyledTableCell>Carbs</StyledTableCell>
                      <StyledTableCell>Protein</StyledTableCell>
                      <StyledTableCell>kCal</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <StyledTableBody>
                        <StyledTableCell align="right">{row.fat}</StyledTableCell>
                        <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                        <StyledTableCell align="right">{row.protein}</StyledTableCell>
                        <StyledTableCell align="right">{row.kcal}</StyledTableCell>
                  </StyledTableBody>
                </Table>
              </Box>
            </Collapse>
          </StyledTableCell>
        </TableRow>
      </React.Fragment>
    );
  }