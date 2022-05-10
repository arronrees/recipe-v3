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
