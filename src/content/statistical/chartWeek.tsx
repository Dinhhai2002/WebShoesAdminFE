import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DateTime } from 'luxon';
import * as React from 'react';
import { useEffect } from 'react';

import { DatePicker } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

dayjs.extend(isBetweenPlugin);
dayjs.extend(isoWeek);
// dayjs.extend(utc);

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  isSelected: boolean;
  isHovered: boolean;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isHovered'
})<CustomPickerDayProps>(({ theme, isSelected, isHovered, day }) => ({
  borderRadius: 0,
  ...(isSelected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.main
    }
  }),
  ...(isHovered && {
    backgroundColor: theme.palette.primary[theme.palette.mode],
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary[theme.palette.mode]
    }
  }),
  ...(day.day() === 0 && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%'
  }),
  ...(day.day() === 6 && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%'
  })
})) as React.ComponentType<CustomPickerDayProps>;

const isInSameWeek = (dayA: Dayjs, dayB: Dayjs | null | undefined) => {
  if (dayB == null) {
    return false;
  }

  return dayA.isSame(dayB, 'week');
};

function Day(
  props: PickersDayProps<Dayjs> & {
    selectedDay?: Dayjs | null;
    hoveredDay?: Dayjs | null;
  }
) {
  const { day, selectedDay, hoveredDay, ...other } = props;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{ px: 2.5, paddingLeft: 2 }}
      disableMargin
      selected={false}
      isSelected={isInSameWeek(day, selectedDay)}
      isHovered={isInSameWeek(day, hoveredDay)}
    />
  );
}

export default function WeekPicker({ getDate }: any) {
  const [hoveredDay, setHoveredDay] = React.useState<Dayjs | null>(null);
  // const [value, setValue] = React.useState<Dayjs | null>(dayjs('2023-04-17'));
  const [value, setValue] = React.useState<DateTime | null>(DateTime.now());
  //  DateTime.fromISO('2023-11-15T15:30', { zone: 'UTC' })

  useEffect(() => {
    getDate(dayjs(value.toJSON()));
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DatePicker
        value={value}
        onChange={setValue}
        showDaysOutsideCurrentMonth
        displayWeekNumber
        // slots={{ day: Day }}
        // slotProps={{
        //   day: (ownerState) =>
        //     ({
        //       selectedDay: value,
        //       hoveredDay,
        //       onPointerEnter: () => setHoveredDay(ownerState.day),
        //       onPointerLeave: () => setHoveredDay(null)
        //     } as any)
        // }}
      />
    </LocalizationProvider>
  );
}
