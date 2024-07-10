export const capitalize = (string) => {

  return string.split(' ')
    .filter(word  => word != '')
    .map((word) => word[0].toUpperCase() + word.substring(1).toLowerCase())
    .join(' ');
};
