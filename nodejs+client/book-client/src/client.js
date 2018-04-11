/* Fetch function instead of XMLHttpRequest */
function getBooks(success) {
  return fetch('/api/', {
    headers: {
      Accept: 'application/json',
    },
  }).then(checkStatus)
    .then(parseJSON)
    .then(success);
};

function deleteBook(url) {
  return fetch(url, {
    method: 'delete',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(checkStatus);
};

function createBook(data) {
  return fetch('/api/create/', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(checkStatus);
};

function updateBook(data) {
  return fetch('/api/update/', {
    method: 'put',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(checkStatus);
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error);
    throw error;
  }
};

function parseJSON(response) {
  return response.json();
};


const Client = {
  getBooks,
  deleteBook,
  createBook,
  updateBook,
};

export default Client;
