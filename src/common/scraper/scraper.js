const scraper = ((window, document) => {
  const capitalize = str => str.slice(0, 1).toUpperCase() + str.slice(1);

  const waitFor = ms => new Promise(resolve => setTimeout(() => {
    resolve();
  }, ms));

  const getFormattedDataName = key => `scraper${capitalize(key)}`;

  const getDataAttrName = (key) => {
    const reg = /[A-Z]{1}/g;
    const name = key.replace(reg, match => `-${match[0].toLowerCase()}`);

    return `data-${name}`;
  };

  // in dataset like { scraperXYZ: 123 }
  // in query 'div[data-scraper-x-y-z="123"]';

  class Element {
    constructor(el) {
      if (!(el instanceof HTMLElement)) {
        throw new TypeError('Element must be instance of HTMLElement.');
      }

      this.el = el;
    }

    /**
     * @author        Rosario Gueli <rosariogueli@hotmail.it>
     * @description   IG has updated some of the elements structure, for example when using the comment function
     *                the scraper could not find the button by its internal text, throwing the error: 
     *                "Error: Evaluation failed: TypeError: Cannot read property 'parent' of null"
     *                This is because IG have placed the text of this button inside the aria-label attribute of the span, 
     *                the below hotfix is used in those areas where if text value was not found, gives this function 
     *                second chance and try the element arial-label attibute:
     *                XPath Example to find the Comment button: span[contains(@aria-label, "Comment")]
     *                
     */
    aria_label(){
      return String(this.getAttr('aria-label')).trim();
    }

    text() {
      let res = String(this.el.textContent).trim();

      if(!res){
        res = this.aria_label();
      }

      return res;
    }

    get() {
      return this.el;
    }

    html() {
      let res = this.el.innerHTML;

      if(!res){
        res = this.aria_label();
      }

      return res;
    }

    dimensions() {
      return JSON.parse(JSON.stringify(this.el.getBoundingClientRect()));
    }

    clone() {
      return new Element(this.el.cloneNode(true));
    }

    scrollIntoView() {
      this.el.scrollIntoView(true);
      return this.el;
    }

    setAttr(key, value) {
      this.el.setAttribute(key, value);
      return this;
    }

    getAttr(key) {
      return this.el.getAttribute(key);
    }

    getTag() {
      return this.el.tagName.toLowerCase();
    }

    setscraperAttr(key, value) {
      const scraperKey = getFormattedDataName(key);
      this.el.dataset[scraperKey] = value;
      return this;
    }

    parent() {
      return new Element(this.el.parentNode);
    }

    setClass(className) {
      this.el.classList.add(className);
      return this;
    }

    getscraperAttr(key) {
      return this.el.dataset[getFormattedDataName(key)];
    }

    getSelectorByscraperAttr(key) {
      const scraperValue = this.getscraperAttr(key);
      const scraperKey = getDataAttrName(getFormattedDataName(key));
      const tagName = this.getTag();

      return `${tagName}[${scraperKey}="${scraperValue}"]`;
    }
  }

  const find = ({ selector, where = () => true, count }) => {
    if (count === 0) {
      return [];
    }

    const elements = Array.from(document.querySelectorAll(selector));

    let sliceArgs = [0, count || elements.length];

    if (count < 0) {
      sliceArgs = [count];
    }

    return elements
      .map(el => new Element(el))
      .filter(where)
      .slice(...sliceArgs);
  };

  const findOne = ({ selector, where }) => find({ selector, where, count: 1 })[0] || null;

  const getDocumentDimensions = () => {
    const height = Math.max(
      document.documentElement.clientHeight,
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
    );

    const width = Math.max(
      document.documentElement.clientWidth,
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
    );

    return {
      height,
      width,
    };
  };

  const scrollToPosition = {
    top: () => {
      window.scrollTo(0, 0);
      return true;
    },
    bottom: () => {
      const { height } = getDocumentDimensions();

      window.scrollTo(0, height);
      return true;
    },
  };

  const scrollPageTimes = async ({ times = 0, direction = 'bottom' }) => {
    if (!times || times < 1) {
      return true;
    }

    await new Array(times).fill(0).reduce(async (prev) => {
      await prev;
      scrollToPosition[direction]();
      await waitFor(2000);
    }, Promise.resolve());

    return true;
  };

  const findOneWithText = ({ selector, text }) => {
    const lowerText = text.toLowerCase();

    return findOne({
      selector,
      where: (el) => {
        const textContent = el.text().toLowerCase();

        return lowerText === textContent;
      },
    });
  };

  return {
    Element,
    findOneWithText,
    scrollPageTimes,
    scrollToPosition,
    getDocumentDimensions,
    find,
    findOne,
    waitFor,
  };
})(window, document);

window.scraper = scraper;
