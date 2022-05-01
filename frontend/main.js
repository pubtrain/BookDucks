'use strict';
const username = document.getElementById('username');
const password = document.getElementById('password');
const loginBtn = document.getElementById('login');
const registerName = document.getElementById('registerName');
const registerPassword = document.getElementById('registerPassword');
const registerEmail = document.getElementById('registerEmail');
const registerBtn = document.getElementById('registerBtn');
const loginContainer = document.getElementById('loginContainer');
const loginWrapper = document.getElementById('loginWrapper');
const registerContainer = document.getElementById('registerContainer');
const logOutBtn = document.getElementById('logOut');
const navBar = document.getElementById('navBar');
const seeBookList = document.getElementById('seeBookList');
const soundBookList = document.getElementById('seeSoundBookList');
const welcomeContainer = document.querySelector('.welcome-container');
const profileBtn = document.getElementById('profileBtn');
const lendBooksBtn = document.getElementById('lendBooksBtn');
const postBookTitle = document.getElementById('postBookTitle');
const postBookAuthor = document.getElementById('postBookAuthor');
const postBookPages = document.getElementById('postBookPages');
const postBookScore = document.getElementById('postBookScore');
const postBookPicture = document.getElementById('postBookPicture');
const postBookDiv = document.querySelector('.post-bookDiv');
const lendSoundBtn = document.getElementById('lendSoundBtn');
const postSoundTitle = document.getElementById('postSoundTitle');
const postSoundAuthor = document.getElementById('postSoundAuthor');
const postSoundLength = document.getElementById('postSoundLength');
const postSoundDate = document.getElementById('soundBookDate');
const postSoundScore = document.getElementById('postSoundScore');
const postSoundPicture = document.getElementById('postSoundPicture');
const postSoundDiv = document.querySelector('.post-soundDiv');

if (sessionStorage.getItem('token')) {
  loginContainer.classList.add('hidden');
  registerContainer.classList.add('hidden');
  navBar.classList.remove('hidden');
  welcomeContainer.classList.remove('hidden');
}

let login = async () => {
  let response = await axios.post('http://localhost:1337/api/auth/local', {
    identifier: username.value,
    password: password.value,
  });
  let token = response.data.jwt;
  let id = response.data.user.id;
  console.log('Got the JWT', token);
  sessionStorage.setItem('token', token);
  console.log(response);
  sessionStorage.setItem('id', id);
  console.log('id', id);
};

loginBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  await login();
  if (sessionStorage.getItem('token')) {
    loginContainer.classList.add('hidden');
    registerContainer.classList.add('hidden');
    navBar.classList.remove('hidden');
    welcomeContainer.classList.remove('hidden');
  }
});

let listBooks = async () => {
  let response = await axios.get('http://localhost:1337/api/books?populate=*', {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  });
  response.data.data.forEach((book) => {
    console.log(book);
    document.querySelector('#book-containerlist').innerHTML += `
    <div class="book">
    <img src="${
      book.attributes.cover.data &&
      `http://localhost:1337${book.attributes.cover.data.attributes.url}`
    }" alt="Bild på bokomslaget" class="book-cover">
    <p>${book.attributes.title}</p>
    <p>Skriven av: ${book.attributes.author}</p>
    <p>${book.attributes.pages} sidor lång</p>
    <p>Betyg: ${book.attributes.score}</p>
    <p>Genre: ${book.attributes.genres.data[0].attributes.genreType}</p>
    <p>Utlånad av: ${book.attributes.user.data.attributes.username}, ${
      book.attributes.user.data.attributes.email
    }</p>
    </div>`;
  });
};

seeBookList.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('#book-containerlist').innerHTML = '';
  document.querySelector('#soundbook-containerlist').innerHTML = '';
  welcomeContainer.classList.add('hidden');
  postBookDiv.classList.add('hidden');
  postSoundDiv.classList.add('hidden');
  profileContainer.classList.add('hidden');
  listBooks();
});

let listSoundBooks = async () => {
  let response = await axios.get(
    'http://localhost:1337/api/soundbooks?populate=*',
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    }
  );
  response.data.data.forEach((soundbook) => {
    document.querySelector('#soundbook-containerlist').innerHTML += `
    <div class="book">
    <img src="http://localhost:1337${soundbook.attributes.cover.data.attributes.url}" alt="Bild på bokomslaget" class="book-cover">
    <p>${soundbook.attributes.title}</p>
    <p>Skriven av: ${soundbook.attributes.author}</p>
    <p>Publicerad: ${soundbook.attributes.releasedate}</p>
    <p>${soundbook.attributes.length} timmar lång</p>
    <p>Betyg: ${soundbook.attributes.score}</p>
    <p>Utlånad av: ${soundbook.attributes.user.data.attributes.username}, ${soundbook.attributes.user.data.attributes.email}</p>
    <p>Genre: ${soundbook.attributes.genres.data[0].attributes.genreType}</p>

    </div>`;
  });
};

soundBookList.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('#soundbook-containerlist').innerHTML = '';
  document.querySelector('#book-containerlist').innerHTML = '';
  profileContainer.classList.add('hidden');
  postBookDiv.classList.add('hidden');
  postSoundDiv.classList.add('hidden');
  welcomeContainer.classList.add('hidden');
  listSoundBooks();
});

let register = async () => {
  let response = await axios.post(
    'http://localhost:1337/api/auth/local/register',
    {
      username: registerName.value,
      password: registerPassword.value,
      email: registerEmail.value,
    }
  );
  console.log('Registered!', response);
  let token = response.data.jwt;
  let id = response.data.user.id;
  console.log('Got the JWT!', token);
  console.log('got the ID', id);
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('id', id);
};

registerBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  await register();
  if (sessionStorage.getItem('token')) {
    alert('Registered!');
    loginContainer.classList.add('hidden');
    registerContainer.classList.add('hidden');
    navBar.classList.remove('hidden');
    welcomeContainer.classList.remove('hidden');
  }
});

logOutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  sessionStorage.clear();
  location.reload();
});

let showProfile = async () => {
  axios
    .get('http://localhost:1337/api/users/me', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
    .then(async (userData) => {
      console.log('data :>> ', userData);
      const profileDate = new Date(userData.data.createdAt)
        .toISOString()
        .slice(0, 10);
      document.getElementById(
        'profileContainer'
      ).innerHTML = `<div class="my-profile">
      <h2>Min profil</h2>
        <p>Användarnamn: ${userData.data.username}</p>
        <p>Epost: ${userData.data.email}</p>
        <p>Id: ${userData.data.id}</p>
        <p>Registrerad sedan: ${profileDate}</p>
        </div>`;
      const bookResponse = await axios.get(
        'http://localhost:1337/api/books?populate=*',
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );
      console.log('bookResponse :>> ', bookResponse);
      bookResponse.data.data.forEach((book) => {
        if (book.attributes.userId == userData.data.id) {
          document.querySelector('#profileContainer').innerHTML += `
          <div class="book">
          <p>${book.attributes.title}</p>
          <p>Skriven av: ${book.attributes.author}</p>
          <p>${book.attributes.pages} sidor lång</p>
          <p>Betyg: ${book.attributes.score}</p>
          <p>Genre: ${book.attributes.genres.data[0].attributes.genreType}</p>
          <img src="${
            book.attributes.cover.data &&
            `http://localhost:1337${book.attributes.cover.data.attributes.url}`
          }" alt="Bild på bokomslaget" class="book-cover">
          <p>Utlånad av: ${book.attributes.user.data.attributes.username}, ${
            book.attributes.user.data.attributes.email
          }</p>
          </div>`;
        }
      });
      const soundBookResponse = await axios.get(
        'http://localhost:1337/api/soundbooks?populate=*',
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );
      soundBookResponse.data.data.forEach((soundbook) => {
        if (soundbook.attributes.userId == userData.data.id) {
          document.querySelector('#profileContainer').innerHTML += `
        <div class="book">
        <p>${soundbook.attributes.title}</p>
        <p>Skriven av: ${soundbook.attributes.author}</p>
        <p>Publicerad: ${soundbook.attributes.releasedate}</p>
        <p>${soundbook.attributes.length} timmar lång</p>
        <p>Betyg: ${soundbook.attributes.score}</p>
        <img src="http://localhost:1337${soundbook.attributes.cover.data.attributes.url}" alt="Bild på bokomslaget" class="book-cover">
        <p>Utlånad av: ${soundbook.attributes.user.data.attributes.username}, ${soundbook.attributes.user.data.attributes.email}</p>
        <p>Genre: ${soundbook.attributes.genres.data[0].attributes.genreType}</p>
        </div>`;
        }
      });
    });
};

profileBtn.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('#soundbook-containerlist').innerHTML = '';
  document.querySelector('#book-containerlist').innerHTML = '';
  welcomeContainer.classList.add('hidden');
  postBookDiv.classList.add('hidden');
  postSoundDiv.classList.add('hidden');
  profileContainer.classList.remove('hidden');
  showProfile();
});

let postBook = async () => {
  //Hämtar ut filen(bilden) och placerar den i en formdata
  let image = document.querySelector('#postBookPicture').files;
  let imgData = new FormData();
  imgData.append('files', image[0]);

  // Laddar upp bilden till strapi
  axios
    .post('http://localhost:1337/api/upload', imgData, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
    .then((response) => {
      console.log('Trying to create book');
      // Placerar den uppladdade bildens id i vår nya produkt vi vill lägga till
      let genreId = document.querySelector('#genre').value;
      let imageId = response.data[0].id;
      let userId = sessionStorage.getItem('id');
      axios.post(
        'http://localhost:1337/api/books?populate=*',
        {
          data: {
            title: postBookTitle.value,
            author: postBookAuthor.value,
            pages: postBookPages.value,
            score: postBookScore.value,
            cover: imageId,
            user: userId,
            genres: genreId,
            userId: userId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );
    });
};

document.querySelector('#postBookBtn').addEventListener('click', postBook);

lendBooksBtn.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('#book-containerlist').innerHTML = '';
  document.querySelector('#soundbook-containerlist').innerHTML = '';
  welcomeContainer.classList.add('hidden');
  loginWrapper.classList.add('hidden');
  postSoundDiv.classList.add('hidden');
  profileContainer.classList.add('hidden');
  postBookDiv.classList.remove('hidden');
});

let postSoundBook = async () => {
  //Hämtar ut filen(bilden) och placerar den i en formdata
  let image = document.querySelector('#postSoundPicture').files;
  let imgData = new FormData();
  let userId = sessionStorage.getItem('id');
  imgData.append('files', image[0]);

  // Laddar upp bilden till strapi
  axios
    .post('http://localhost:1337/api/upload', imgData, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
    .then((response) => {
      console.log('Trying to create soundbook');
      // Placerar den uppladdade bildens id i vår nya produkt vi vill lägga till
      let imageId = response.data[0].id;
      let genreId = document.querySelector('#soundGenre').value;
      const data = {
        title: postSoundTitle.value,
        releasedate: postSoundDate.value,
        length: postSoundLength.value,
        score: postSoundScore.value,
        author: postSoundAuthor.value,
        cover: imageId,
        user: userId,
        userId: userId,
        genres: genreId,
      };
      console.log(data);

      axios
        .post(
          'http://localhost:1337/api/soundbooks?populate=*',
          {
            data,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
          }
        )
        .catch((err) => {
          console.log(err);
        });
    });
};

lendSoundBtn.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('#book-containerlist').innerHTML = '';
  document.querySelector('#soundbook-containerlist').innerHTML = '';
  welcomeContainer.classList.add('hidden');
  loginWrapper.classList.add('hidden');
  postBookDiv.classList.add('hidden');
  profileContainer.classList.add('hidden');
  postSoundDiv.classList.remove('hidden');
});

document
  .querySelector('#postSoundBtn')
  .addEventListener('click', postSoundBook);
