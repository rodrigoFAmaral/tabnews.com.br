import { fireEvent } from '@testing-library/dom';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.resetModules();
  global.__newContentCalled__ = false;
});

it('atalhos são ignorados quando um input está focado', async () => {
  document.body.innerHTML = `
    <input id="other" />
    <input data-testid="posts-search" />
    <ul id="posts-list"><li tabindex="-1">Post</li></ul>
  `;

  const other = document.getElementById('other');
  other.focus();

  const { default: ks } = await import('interface/utils/keyboardShortcuts');
  ks.init({
    searchSelector: '[data-testid="posts-search"]',
    listSelector: '#posts-list',
    newContentHandler: () => {
      global.__newContentCalled__ = true;
    },
  });

  fireEvent.keyDown(document, { key: '/' });
  const search = document.querySelector('[data-testid="posts-search"]');
  expect(document.activeElement).not.toBe(search);

  fireEvent.keyDown(document, { key: 'j' });
  const item = document.querySelector('#posts-list li');
  expect(item.getAttribute('data-selected')).toBeNull();

  fireEvent.keyDown(document, { key: 'N' });
  expect(global.__newContentCalled__).toBe(false);

  fireEvent.keyDown(document, { key: '?' });
  const modal = document.querySelector('[data-testid="shortcuts-modal"]');
  expect(modal).toBeNull();
});

it('atalhos só ativos quando scopeSelector existe', async () => {
  document.body.innerHTML = `
    <input data-testid="posts-search" />
  `;

  const { default: ks } = await import('interface/utils/keyboardShortcuts');
  ks.init({
    searchSelector: '[data-testid="posts-search"]',
    listSelector: '#posts-list',
    newContentHandler: () => {
      global.__newContentCalled__ = true;
    },
  });

  fireEvent.keyDown(document, { key: '/' });
  const search = document.querySelector('[data-testid="posts-search"]');
  expect(document.activeElement).not.toBe(search);

  fireEvent.keyDown(document, { key: 'N' });
  expect(global.__newContentCalled__).toBe(false);

  fireEvent.keyDown(document, { key: '?' });
  const modal = document.querySelector('[data-testid="shortcuts-modal"]');
  expect(modal).toBeNull();
});
