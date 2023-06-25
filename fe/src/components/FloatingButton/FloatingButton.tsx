import * as React from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import './FloatingButton.css'
import FoodDiaryForm from '../Form/Form';
import { useRecoilState } from 'recoil';
import { showDialogState } from '../../state/atoms';


export default function FloatingButton() {
    const [showDialog, setShowDialog] = useRecoilState(showDialogState);
    const [showCloseButton, setShowCloseButton] = React.useState(false);
  
    const handleButtonClick = () => {
      setShowDialog(!showDialog);
      setShowCloseButton(!showCloseButton);
    };

    return (
      <div className="floating-button">
        <Fab className="custom-fab" aria-label="add" onClick={handleButtonClick}>
          {showCloseButton ? <CloseIcon /> : <AddIcon />}
        </Fab>
        {showDialog && <FoodDiaryForm />}
      </div>
    );
}  

