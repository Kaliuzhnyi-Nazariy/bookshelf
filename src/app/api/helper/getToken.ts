import { startWith } from 'rxjs';

export const accessToken = () => {
  return document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('accessToken='))
    ?.split('=')[1];
};
