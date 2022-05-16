const navSlide = () => {
  const nav = document.querySelector('.navbar');
  const btn = document.querySelector('.burger');

  btn.addEventListener('click', (e) => {
    nav.classList.toggle('nav--open');
    btn.classList.toggle('nav--open');
  });
};

if (!!document.querySelector('.burger')) {
  navSlide();
}

const showSearch = () => {
  const btn = document.querySelector('.search');
  const mobBtn = document.querySelector('.search.mobile__search');
  const pop = document.querySelector('.search__popup');
  const close = document.querySelector('.search__popup .close__search');

  const search = document.querySelector('#searchText');

  btn.addEventListener('click', () => {
    pop.classList.add('popup--open');
    search.focus();
  });

  mobBtn.addEventListener('click', () => {
    pop.classList.add('popup--open');
    search.focus();
  });

  close.addEventListener('click', () => {
    pop.classList.remove('popup--open');
  });
};

if (!!document.querySelector('.search')) {
  showSearch();
}
