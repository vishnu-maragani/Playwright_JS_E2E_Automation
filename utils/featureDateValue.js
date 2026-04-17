function futureDateValue() {
  const date = new Date();
  date.setDate(date.getDate() + 2);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = '10';
  const min = '30';

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}
module.exports={futureDateValue}