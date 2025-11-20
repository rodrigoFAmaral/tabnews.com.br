import { fireEvent } from '@testing-library/dom';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.resetModules();
  global.__newContentCalled__ = false;
});

it("pressionar 'N' dispara o handler de novo conteúdo", async () => {
  document.body.innerHTML = `<div id="app"></div>`;

  const { default: ks } = await import('interface/utils/keyboardShortcuts');
  ks.init({
    newContentHandler: () => {
      global.__newContentCalled__ = true;
    },
  });

  fireEvent.keyDown(document, { key: 'N' });

  expect(global.__newContentCalled__).toBe(true);
});
