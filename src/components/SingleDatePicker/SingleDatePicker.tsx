import React, { useState } from 'react';

// Third party imports
import Image from 'next/image';
import addMonths from 'date-fns/addMonths';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import { DayPicker } from 'react-day-picker';

// Material UI imports
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Popover from '@mui/material/Popover';
import InputAdornment from '@mui/material/InputAdornment';
import calendarIcon from '@/icons/calendar.svg';

// Styles & custom imports
import 'react-day-picker/dist/style.css';


export const DD_MMM_YYY_FORMAT = 'dd MMM yyy';

// constants
const today = new Date();
const disabledDays = [
  {
    before: today
  }
];

export default function SingleDatePicker({
  value,
  onDateSelection,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [defaultMonth, setDefaultMonth] = useState(today);
  const toDate = addMonths(today, 12);

  // derive from state
  const open = Boolean(anchorEl);
  const formattedValue = isValid(value)
    ? format(value, DD_MMM_YYY_FORMAT)
    : '';
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const onClick = () => {
    const val = value || null;
    const pickerValue = val && isValid(val) ? val : '';
    setDefaultMonth(pickerValue);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (_, selectedDay) => {
    onDateSelection(selectedDay);
    handleClose();
  };

  const renderInputProps = (iconAlt:string) => {
    return {
      readOnly: true,
      startAdornment: <InputAdornment  position="start">
      <Image height={16.67} width={15} src={calendarIcon} alt={iconAlt} />
    </InputAdornment>
    };
  };
  return (
    <>
      <Box sx={{ width: 400 }} onClick={handleClick}>
          <TextField
           fullWidth
           onClick={onClick}
            placeholder="Pick up a date"
            value={formattedValue}
            InputProps={renderInputProps('Calendar-Icon')}
            variant="outlined"
          />
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transitionDuration={0}
      >
        <DayPicker
          numberOfMonths={1}
          defaultMonth={defaultMonth}
          fromMonth={today}
          toDate={toDate}
          mode="single"
          selected={value}
          onSelect={handleSelect}
          disabled={disabledDays}
        />
      </Popover>
    </>
  );
}

