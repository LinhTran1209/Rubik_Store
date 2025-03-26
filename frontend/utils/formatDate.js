// export const formatDate = (date = '2025-03-25') => {
//     const date_format = date.split('-');
  
//     // Trả về định dạng 'dd-mm-yyyy'
//     return `${date_format[2]}-${date_format[1]}-${date_format[0]}`;
// };

date = '2025-03-25'
const date_format = date.split('-');
  
// Trả về định dạng 'dd-mm-yyyy'
return `${date_format[2]}-${date_format[1]}-${date_format[0]}`;