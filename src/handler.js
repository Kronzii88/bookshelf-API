const { nanoid } = require('nanoid');
const books = require('./books');

// ADD BOOK HANDLER
const addBookHandler = (request, h) => {
  // body data
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // id data
  const id = nanoid(16);
  // date data
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    insertedAt,
    updatedAt,
  };
  // handler success
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (isSuccess) {
    books.push(newBook);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// GET ALL BOOK HANDLER
const getBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name !== undefined) {
    const searcResult = books
      .filter((word) => word.name.toLowerCase().includes(name.toLowerCase()))
      .map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      }));
    const response = h.response({
      status: 'success',
      data: {
        books: searcResult,
      },
    });
    response.code(200);
    return response;
  }

  if (reading) {
    const searcResult = books
      .filter((book) => book.reading === reading)
      .map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      }));
    const response = h.response({
      status: 'success',
      data: {
        books: searcResult,
      },
    });
    response.code(200);
    return response;
  }

  if (finished) {
    const searchResult = books
      .filter((book) => book.finished === finished)
      .map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      }));
    const response = h.response({
      status: 'success',
      data: {
        books: searchResult,
      },
    });
    response.code(200);
    return response;
  }

  const searchResult = books.map((b) => ({
    id: b.id,
    name: b.name,
    publisher: b.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: {
      books: searchResult,
    },
  });
  response.code(200);
  return response;
};

// GET BOOK BY ID HANDLER
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// EDIT BOOK BY ID HANDLER
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// DELETE BOOK BY ID HANDLER
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
