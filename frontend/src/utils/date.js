import { format } from 'date-fns';

export function formatDate(date, pattern = 'PPP') {
  return format(new Date(date), pattern);
}
