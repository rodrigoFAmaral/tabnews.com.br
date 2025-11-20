import { fireEvent } from '@testing-library/dom';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.resetModules();
});

it('ArrowDown seleciona próximo post e ArrowUp seleciona anterior', async () => {
  document.body.innerHTML = `
    <ul id="posts-list">
      <li tabindex="-1">Post 1</li>
      <li tabindex="-1">Post 2</li>
      <li tabindex="-1">Post 3</li>
    </ul>
  `;

  const { default: ks } = await import('interface/utils/keyboardShortcuts');
  ks.init({ listSelector: '#posts-list', itemSelector: 'li' });

  fireEvent.keyDown(document, { key: 'ArrowDown' });
  const items = Array.from(document.querySelectorAll('#posts-list li'));
  expect(items[0].getAttribute('data-selected')).toBe('true');

  fireEvent.keyDown(document, { key: 'ArrowDown' });
  expect(items[1].getAttribute('data-selected')).toBe('true');

  fireEvent.keyDown(document, { key: 'ArrowUp' });
  expect(items[0].getAttribute('data-selected')).toBe('true');
});

it("'j' e 'k' funcionam como ArrowDown / ArrowUp", async () => {
  document.body.innerHTML = `
    <ul id="posts-list">
      <li tabindex="-1">Post 1</li>
      <li tabindex="-1">Post 2</li>
    </ul>
  `;

  const { default: ks } = await import('interface/utils/keyboardShortcuts');
  ks.init({ listSelector: '#posts-list', itemSelector: 'li' });

  const items = Array.from(document.querySelectorAll('#posts-list li'));

  fireEvent.keyDown(document, { key: 'j' });
  expect(items[0].getAttribute('data-selected')).toBe('true');

  fireEvent.keyDown(document, { key: 'j' });
  expect(items[1].getAttribute('data-selected')).toBe('true');

  fireEvent.keyDown(document, { key: 'k' });
  expect(items[0].getAttribute('data-selected')).toBe('true');
});
