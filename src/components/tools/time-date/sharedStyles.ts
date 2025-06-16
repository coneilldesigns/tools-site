import { SxProps, Theme } from '@mui/material/styles';

export const calendarStyles: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  '& .MuiDateTimePickerToolbar-root': {
    borderBottom: '1px solid #364152',
    padding: '0px',
  },
  '& .MuiPickersCalendarHeader-root': {
    borderBottom: '1px solid #364152',
    margin: '0px',
    padding: '1.5rem',
  },
  '& .MuiPickersLayout-contentWrapper': {
    width: '100%',
    height: '100%',
  },
  '& .MuiDateCalendar-root': {
    width: '100%',
    height: '100%',
    maxHeight: '100%',
  },
  '& .MuiPickersToolbar-title': {
    borderBottom: '1px solid #364152',
    display: 'block',
    width: '100%',
    padding: '1rem',
  },
  '& .MuiDateTimePickerToolbar-dateContainer': {
    borderRight: '1px solid #364152',
    padding: '1rem',
  },
  '& .MuiDateTimePickerToolbar-timeContainer': {
    borderRight: '1px solid #364152',
    padding: '1rem',
  },
  '& .MuiDateTimePickerToolbar-ampmContainer': {
    borderRight: '1px solid #364152',
    padding: '1rem',
  },
  '& .MuiList-root': {
    width: '100%',
    height: '100%',
    maxHeight: '100%',
  },
  '& .MuiDayCalendar-header': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  '& .MuiDayCalendar-weekContainer': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: '0px',
    padding: '0px',
    borderBottom: '1px solid #364152',
  },
  '& .MuiPickersFadeTransitionGroup-root': {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  '& .MuiDateTimePickerToolbar-dateContainer, & .MuiDateTimePickerToolbar-timeContainer': {
    flex: 1
  },
  '& .MuiPickersSlideTransition-root': {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  '& .MuiDayCalendar-monthContainer': {
    width: '100%',
    height: '100%',
  },
  '& .MuiMultiSectionDigitalClock-root': {
    width: '100%',
    height: '100%',
  },
  '& .MuiDayCalendar-monthContainer > div': {
    height: 'calc(100% / 5)',
  },
  '& .MuiDayCalendar-root': {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  '& .MuiPickersFadeTransitionGroup-root > div': {
    height: '100%',
    width: '100%',
  },
  '& .MuiDayCalendar-root .MuiButtonBase-root, & .MuiPickersDay-hiddenDaySpacingFiller': {
    borderRadius: '0px',
    height: '100%',
    fontSize: '1.5rem',
    borderRight: '1px solid #364152',
    margin: '0px',
    padding: '0px',
    width: 'calc(100% / 7)',
    opacity: '1',
  },
  '& .MuiPickersDay-hiddenDaySpacingFiller': {
    backgroundColor: '#141C26',
  },
  // '& .MuiYearCalendar-root': {
  //   width: '100%',
  //   height: '100%',
  //   maxHeight: '100%',
  //   gap: '0px',
  //   margin: '0px',
  //   padding: '0px',
  //   overflowY: 'visible',
  //   display: 'block',
  // },
  // '& .MuiYearCalendar-root .MuiYearCalendar-button': {
  //   width: 'calc(100% / 3)',
  // },
  '& .MuiDayCalendar-root .MuiButtonBase-root.Mui-disabled': {
    backgroundColor: '#141c26',
  },
  '& .MuiDayCalendar-root .MuiButtonBase-root.Mui-selected': {
    borderRadius: '0px',
    color: '#FFF',
  },
  '& .MuiDayCalendar-root .MuiButtonBase-root.MuiPickersDay-today': {
    backgroundColor: '#FFF',
    color: '#000',
  },
  '& .MuiDialogActions-root': {
    borderTop: '1px solid #364152',
  },
  '& .MuiDayCalendar-weekDayLabel': {
    fontSize: '1.5rem',
    width: 'calc(100% / 7)',
    borderRight: '1px solid #364152',
    borderBottom: '1px solid #364152',
    margin: '0px',
    padding: '0px',
  },
}; 