let instance = null;

class CSSBehavior {
  #selector = null;
  #property = null;
  #observer = null;
  #behaviors = new Map();

  constructor(selector = '*', property = '--behavior') {
    this.#selector = selector;
    this.#property = property;

    document.querySelectorAll(this.#selector)
      .forEach(element => this.processElement(element));

    this.observeMutations();
  }

  importBehavior(url) {
    return import(url)
      .then(module => module.default)
      .catch(err => {
        console.error(`Failed to load behavior from ${url}:`, err);
      });
  }

  applyBehavior(element, url) {
    const existingBehavior = this.#behaviors.get(url);

    if (existingBehavior) {
      if (existingBehavior instanceof Promise) {
        existingBehavior.then(behavior => behavior(element));
        return;
      }

      existingBehavior(element);
      return;
    }

    const promise = this.importBehavior(url)
      .then(behavior => {
        behavior(element);
        this.#behaviors.set(url, behavior);
        return behavior;
      });

    this.#behaviors.set(url, promise);
  }

  processElement(element) {
    const style = getComputedStyle(element);
    const behaviorUrl = style.getPropertyValue(this.#property);

    if (behaviorUrl) {
      const url = this.extractURL(behaviorUrl);

      if (url) {
        this.applyBehavior(element, url);
      }
    }
  }

  extractURL(propertyValue) {
    const urlMatch = propertyValue
      .trim()
      .match(/url\(\s*['"]?([^'"]+)['"]?\s*\)/i);

    return urlMatch ? urlMatch[1] : null;
  }

  observeMutations() {
    this.#observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.processElement(node);
            node.querySelectorAll(this.#selector)
              .forEach(child => this.processElement(child));
          }
        });
      });
    });

    this.#observer.observe(
      document.documentElement,
      { childList: true, subtree: true }
    );
  }
}

export function init(selector, behaviorProperty) {
  if (!instance) {
    document.addEventListener(
      'DOMContentLoaded',
      () => instance = new CSSBehavior(selector, behaviorProperty),
      { once: true }
    );
  }
}
