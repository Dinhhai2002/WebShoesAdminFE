const { differenceInDays } = require('date-fns');

class FormatTimeUtils {
  public customTimerComplete(minutes: number, seconds: number) {
    let StringMinutes: string = '';
    let StringSeconds: string = '';

    minutes < 10
      ? (StringMinutes = `0${minutes}`)
      : (StringMinutes = `${minutes}`);

    seconds < 10
      ? (StringSeconds = `0${seconds}`)
      : (StringSeconds = `${seconds}`);

    return `${StringMinutes}:${StringSeconds}`;
  }

  public calculateDateTarget(date: any) {
    const [day, month, year] = date ? date.split('/') : '';

    const inputDate: any = new Date(year, month - 1, day);

    const currentDate: any = new Date();
    const daysDiff: any = differenceInDays(inputDate, currentDate);

    return daysDiff;
  }
}
const formatTimeUtils = new FormatTimeUtils();
export default formatTimeUtils;
