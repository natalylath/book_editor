function truncate(string, length) {
  if (string.length > length) {
    return string.slice(0, length) + '...';
  } else {
    return string;
  }
};

function newBook(new_id, attrs = {}) {
  const book = {
    id: new_id,
    title: attrs.title,
    author: attrs.author,
    content: attrs.content,
  };

  return book;
}


const Helpers = {
  truncate,
  newBook,
};

export default Helpers;
