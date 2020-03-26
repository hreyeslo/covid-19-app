import { getTitle, changeLang, selectBreed, imageList } from '../support/app.po';

describe('covid', () => {
  beforeEach(() => {
    cy.visit('/');
    changeLang('es');
    cy.server();
  });

  afterEach(() => {
    changeLang('es');
  });

  describe('should change language', () => {
    it('spanish', () => {
      getTitle().contains('Covid meters');
    });

    it('english', () => {
      changeLang('en');
      getTitle().contains('Covid meters');
    });
  });

  describe('should fetch images', () => {
    it('random images', () => {
      cy.route('GET', '**/images/random/**').as('images');
      selectBreed();
      cy.wait('@images');
      imageList()
        .its('length')
        .then(length => {
          expect(length).not.to.equal(0);
        });
    });
  });
});
