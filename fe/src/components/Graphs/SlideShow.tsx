import React, { useState } from 'react';
import { Button, MobileStepper } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useTheme } from '@mui/material/styles';

import './SlideShow.css'

interface SlideShowProps {
    graphs: React.ReactNode[];
  }  

const SlideShow: React.FC<SlideShowProps> = ({ graphs }) => {
  const theme = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);

  const handlePrev = () => {
    setActiveSlide((prevSlide) => prevSlide - 1);
  };

  const handleNext = () => {
    setActiveSlide((prevSlide) => prevSlide + 1);
  };

    return (
        <div>{graphs[activeSlide]}
        <MobileStepper
          variant="dots"
          steps={2}
          position="static"
          activeStep={activeSlide}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={activeSlide === 1} className={activeSlide === 0 ? 'gray-button' : 'blue-button'}>
              Next
              {theme.direction === 'rtl' ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button size="small" onClick={handlePrev} disabled={activeSlide === 0}>
              {theme.direction === 'rtl' ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
        </div>
      );
};

export default SlideShow;
