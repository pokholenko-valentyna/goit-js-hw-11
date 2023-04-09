import './css/styles.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
//Описаний в документації
import SimpleLightbox from "simplelightbox";
//Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
import { PixabayAPI } from './fetchImages';

const searchFormEl = document.querySelector('.search-form');
const searchInputEl = document.querySelector('.search-input');
const loadMoreBtnEl = document.querySelector('.load-more');
const galleryListEl = document.querySelector('.gallery');

const pixabayAPI = new PixabayAPI();

const handleSearchFormSubmit = async event => {
    event.preventDefault();

    if (searchInputEl.value === '') {
      return;
    }
      
    pixabayAPI.query = searchInputEl.value.trim();

    searchInputEl.value = '';

    pixabayAPI.page = 1;

    try {
     const { data } = await pixabayAPI.fetchImages()
    
     
        console.log(data);
        if (!data.hits.length) {            
            loadMoreBtnEl.classList.add('is-hidden');
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            galleryListEl.innerHTML = '';            
          return;
        } 
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
        pixabayAPI.page = 1;
        const markup = data.hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
            return `<div class="photo-card">
            <a class="gallery__item" href="${largeImageURL}">
              <img src=${webformatURL} alt=${tags} class="gallery-img" loading="lazy" />
            </a>
            <div class="info">
              <p class="info-item">
                <b>Likes</b> ${likes}
              </p>
              <p class="info-item">
                <b>Views</b> ${views}
              </p>
              <p class="info-item">
                <b>Comments</b> ${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b> ${downloads}
              </p>
            </div>
          </div>`}).join('');

        galleryListEl.innerHTML = markup; 
        
        var lightbox = new SimpleLightbox('.gallery a', {
          // captionSelector: 'img',
          // captionsData: 'alt',
          // captionPosition: 'bottom',
          // captionDelay: 250,
          scrollZoom: false, 
        });
        lightbox.refresh();
        loadMoreBtnEl.classList.remove('is-hidden');
        if (pixabayAPI.count >= data.totalHits) {
          loadMoreBtnEl.classList.add('is-hidden');         
          return;
        }
      }
      catch (err) {
        console.log(err);
      }
};

const handleLoadMoreBtnClick = async () => {
    pixabayAPI.page += 1;
  
    try {
    const { data } = await pixabayAPI.fetchImages();
    
        console.log(data);
        if ((pixabayAPI.page - 1) * pixabayAPI.count >= data.totalHits) {
          loadMoreBtnEl.classList.add('is-hidden');
          Notiflix.Notify.info('We are sorry, but you have reached the end of search results.');
          return;
        }
        const markup = data.hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
            return `<div class="photo-card">
            <a class="gallery__item" href="${largeImageURL}">
              <img src=${webformatURL} alt=${tags} class="gallery-img" loading="lazy" />
            </a>
            <div class="info">
              <p class="info-item">
                <b>Likes</b> ${likes}
              </p>
              <p class="info-item">
                <b>Views</b> ${views}
              </p>
              <p class="info-item">
                <b>Comments</b> ${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b> ${downloads}
              </p>
            </div>
          </div>`}).join('');
        galleryListEl.insertAdjacentHTML(
          'beforeend',
          markup
        );
        var lightbox = new SimpleLightbox('.gallery a', {
          // captionSelector: 'img',
          // captionsData: 'alt',
          // captionPosition: 'bottom',
          // captionDelay: 250,
          scrollZoom: false, 
        });
      }
      catch (err) {
        console.log(err);
      }
  };
  
  searchFormEl.addEventListener('submit', handleSearchFormSubmit);
  loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);
