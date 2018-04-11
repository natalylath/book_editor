function truncate(string, length) {
  if (string.length > length) {
    return string.slice(0, length) + '...';
  } else {
    return string;
  }
};

const Helpers = {
  truncate,
};

export default Helpers;
