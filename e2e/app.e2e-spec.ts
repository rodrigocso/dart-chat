import { DartChatPage } from './app.po';

describe('dart-chat App', function() {
  let page: DartChatPage;

  beforeEach(() => {
    page = new DartChatPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
