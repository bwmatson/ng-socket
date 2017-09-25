import { NgSocketPage } from './app.po';

describe('ng-socket App', () => {
  let page: NgSocketPage;

  beforeEach(() => {
    page = new NgSocketPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toContain('Welcome to the ');
  });
});
