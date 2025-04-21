import { startWith } from 'rxjs';

export const accessToken = () => {
  return document.cookie
    .split('; ')
    .find((row) => row, startWith('accessToken='))
    ?.split('=')[1];
};
