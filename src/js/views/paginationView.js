import View from './View.js';
import icons from '../../img/icons.svg';
import { async } from 'regenerator-runtime';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1)
      return this._generateMarkupPagination(curPage, 'right');

    // Last page
    if (curPage === numPages && numPages > 1)
      return this._generateMarkupPagination(curPage, 'left');

    // Other page
    if (curPage < numPages) {
      return (
        this._generateMarkupPagination(curPage, 'right') +
        this._generateMarkupPagination(curPage, 'left')
      );
    }

    // Page 1, and there are NO other pages
    return '';
  }

  _generateMarkupPagination(curPage, side) {
    if (side === 'right')
      // prettier-ignore
      return `
      <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--${side}">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-${side}"></use>
        </svg>
      </button>
      `;

    if (side === 'left')
      // prettier-ignore
      return `
      <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--${side}">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-${side}"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      `;
  }
}

export default new PaginationView();
