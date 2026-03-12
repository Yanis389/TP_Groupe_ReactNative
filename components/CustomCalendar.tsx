import { CustomCalendarProps } from '@/services/types';
import React from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';

export const CustomCalendar = ({ markedDates, onDayPress }: CustomCalendarProps) => (
  <Calendar
    markedDates={markedDates}
    onDayPress={onDayPress}
    enableSwipeMonths={true}
    theme={{
      todayTextColor: '#007AFF',
      selectedDayBackgroundColor: '#007AFF',
      dotColor: '#FF3B30',
      arrowColor: '#007AFF',
      indicatorColor: '#007AFF',
      textDayFontWeight: '500',
      textMonthFontWeight: 'bold',
      calendarBackground: 'transparent',
    }}
  />
);