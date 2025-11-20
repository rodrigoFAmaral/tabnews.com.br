let _options = {};
let _handler = null;
let _selectedIndex = -1;

function _isEditable(el) {
  if (!el) return false;
  const name = el.tagName;
  if (name === 'INPUT' || name === 'TEXTAREA') return true;
  if (el.isContentEditable) return true;
  return false;
}

function _getItems() {
  const container = document.querySelector(_options.listSelector);
  if (!container) return [];
  const selector = _options.itemSelector || 'li';
  return Array.from(container.querySelectorAll(selector));
}

function _setSelected(index) {
  const items = _getItems();
  if (!items.length) return;
  if (index < 0) index = 0;
  if (index >= items.length) index = items.length - 1;
  if (_selectedIndex >= 0 && _selectedIndex < items.length) {
    items[_selectedIndex].removeAttribute('data-selected');
  }
  items[index].setAttribute('data-selected', 'true');
  if (typeof items[index].focus === 'function') items[index].focus();
  _selectedIndex = index;
}

export default {
  init(options = {}) {
    _options = options;
    _selectedIndex = -1;
    _handler = (event) => {
      const active = document.activeElement;
      if (_isEditable(active)) return;
      if (_options.scopeSelector) {
        if (!document.querySelector(_options.scopeSelector)) return;
      } else if (_options.listSelector) {
        if (!document.querySelector(_options.listSelector)) return;
      } else if (typeof _options.activeWhen === 'function') {
        try {
          if (!_options.activeWhen()) return;
        } catch (e) {
          return;
        }
      }

      if (event.key === '/') {
        const selector = _options.searchSelector;
        if (!selector) return;
        const el = document.querySelector(selector);
        if (!el) return;
        event.preventDefault();
        el.focus();
        return;
      }

      if (event.key === 'N' || event.key === 'n') {
        const handler = _options.newContentHandler;
        if (typeof handler === 'function') {
          handler();
          return;
        }
        const path = _options.newContentPath;
        if (typeof path === 'string') {
          if (typeof window !== 'undefined' && window.location) {
            window.location.href = path;
          }
        }
      }

      if (event.key === '?') {
        if (document.querySelector('[data-testid="shortcuts-modal"]')) return;
        const modal = document.createElement('div');
        modal.setAttribute('data-testid', 'shortcuts-modal');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.zIndex = '9999';
        modal.innerHTML = '<div>Atalhos: / pesquisa, j/k ou Arrow para navegar, ? ajuda, N novo</div>';
        document.body.appendChild(modal);
        return;
      }

      if (event.key === 'Escape') {
        const modal = document.querySelector('[data-testid="shortcuts-modal"]');
        if (modal) modal.remove();
        return;
      }

      const down = ['ArrowDown', 'j'];
      const up = ['ArrowUp', 'k'];

      if ((down.includes(event.key) || up.includes(event.key)) && _options.listSelector) {
        const items = _getItems();
        if (!items.length) return;
        if (down.includes(event.key)) {
          if (_selectedIndex < 0) {
            _setSelected(0);
            return;
          }
          if (_selectedIndex < items.length - 1) {
            _setSelected(_selectedIndex + 1);
          }
          return;
        }
        if (up.includes(event.key)) {
          if (_selectedIndex > 0) {
            _setSelected(_selectedIndex - 1);
            return;
          }
          if (_selectedIndex === -1 && items.length) {
            _setSelected(items.length - 1);
            return;
          }
        }
      }
    };
    document.addEventListener('keydown', _handler);
  },
  destroy() {
    if (_handler) {
      document.removeEventListener('keydown', _handler);
      _handler = null;
      _selectedIndex = -1;
    }
  },
};
