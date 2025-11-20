import { fireEvent } from '@testing-library/dom';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.resetModules();
});

it("pressionar '?' abre o modal de atalhos", async () => {
  document.body.innerHTML = `<div id="app"></div>`;

  const { default: ks } = await import('interface/utils/keyboardShortcuts');
  ks.init({});

  fireEvent.keyDown(document, { key: '?' });

  const modal = document.querySelector('[data-testid="shortcuts-modal"]');
  expect(modal).not.toBeNull();
  expect(modal.getAttribute('role')).toBe('dialog');
});

it("pressionar 'Escape' fecha o modal de atalhos", async () => {
  document.body.innerHTML = `<div id="app"></div>`;

  const { default: ks } = await import('interface/utils/keyboardShortcuts');
  ks.init({});

  fireEvent.keyDown(document, { key: '?' });
  let modal = document.querySelector('[data-testid="shortcuts-modal"]');
  expect(modal).not.toBeNull();

  fireEvent.keyDown(document, { key: 'Escape' });
  modal = document.querySelector('[data-testid="shortcuts-modal"]');
  expect(modal).toBeNull();
});
