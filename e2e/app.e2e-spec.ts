import { FittsExperimenterAngularPage } from './app.po';

describe('fitts-experimenter-angular App', () => {
  let page: FittsExperimenterAngularPage;

  beforeEach(() => {
    page = new FittsExperimenterAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
