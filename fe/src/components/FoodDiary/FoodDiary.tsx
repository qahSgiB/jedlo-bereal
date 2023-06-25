import * as React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TablePagination } from '@mui/material';
import { useEffect, useState } from 'react';


import Row from './FoodDiaryRow';

import './FoodDiary.css'

import { useRecoilValue } from 'recoil';
import { FoodDiary } from '../../../../be/src/types/fooddiary';
import { styled } from '@mui/material/styles';
import { clientStatusError } from '../../axios/client';
import { startDateState, endDateState, showDialogState } from '../../state/atoms';


interface TableData {
  name: string,
  grams: number,
  kcal?: number,
  fat?: number,
  carbs?: number,
  protein?: number,
}

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "var(--navigation)",
    color: "#000000",
    fontFamily: 'DM Sans, sans-serif',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontFamily: 'DM Sans, sans-serif',
  },
}));

const StyledTableBody = styled(TableBody)(() => ({
  backgroundColor: 'var(--light-mint)' ,
}));

  
export default function FoodTable() {
  const showDialog = useRecoilValue(showDialogState);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<TableData[]>([]);

    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage);
    };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const from: Date | null = useRecoilValue(startDateState);
    const to: Date | null = useRecoilValue(endDateState);

    useEffect(() => {
        const fetchFoodData = async () => {
            try {
              const foodDiaryResponse = await clientStatusError.get('/fooddiary');
              const foodDiaryData: FoodDiary[] = foodDiaryResponse.data.data;
          
              const foodResponse = await clientStatusError.get('/food');
              const foodData: TableData[] = foodResponse.data.data;
              const enrichedFoodData = foodDiaryData.map((foodDiaryEntry) => {
                const matchingFood = foodData.find((food) => food.name === foodDiaryEntry.name);
                return { ...foodDiaryEntry,...matchingFood };
              });
              
            //   calories need fix, for now counted from grams
              const filteredFoodDiaryData = enrichedFoodData.filter((food) => {
                food.kcal = food.kcal !== undefined ? (food.grams * food.kcal / 100) : food.grams ;
                food.fat = food.fat !== undefined ? (food.grams * food.fat / 100) : food.grams ;
                food.carbs = food.carbs !== undefined ? (food.grams * food.carbs / 100) : food.grams ;
                food.protein = food.protein !== undefined ? (food.grams * food.protein / 100) : food.grams ;
                const dateEaten = new Date((food.dateEaten))
                return (
                  (from === null || from <= dateEaten) && (to === null || to >= dateEaten)
                );
              });
              
              setRows(filteredFoodDiaryData);
            } catch (error) {
              console.error('Error fetching food data:', error);
            }
          };
          
        fetchFoodData();
    }, [from, to, showDialog]);

  return (
    <div className='table'>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <StyledTableCell  />
              <StyledTableCell>Food</StyledTableCell>
              <StyledTableCell align="right">Grams</StyledTableCell>
            </TableRow>
          </TableHead>
          <StyledTableBody>
          {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
            <Row key={index} row={row} />
          ))}
          </StyledTableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[2, 3, 4, 6]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
}