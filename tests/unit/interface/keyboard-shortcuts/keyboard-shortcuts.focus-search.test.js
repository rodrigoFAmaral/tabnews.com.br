import { fireEvent } from '@testing-library/dom';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.resetModules();
});

it("pressionar '/' foca o campo de pesquisa na listagem de posts", async () => {
  document.body.innerHTML = `<input data-testid="posts-search" />`;

  const { default: ks } = await import('interface/utils/keyboardShortcuts');

  ks.init({ searchSelector: '[data-testid="posts-search"]' });

  fireEvent.keyDown(document, { key: '/' });

  const input = document.querySelector('[data-testid="posts-search"]');

  expect(document.activeElement).toBe(input);
});
