/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7159:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-present eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */

/** @module */



let textToRegExp =
/**
 * Converts raw text into a regular expression string
 * @param {string} text the string to convert
 * @return {string} regular expression representation of the text
 * @package
 */
exports.textToRegExp = text => text.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

const regexpRegexp = /^\/(.*)\/([imu]*)$/;

/**
 * Make a regular expression from a text argument.
 *
 * If it can be parsed as a regular expression, parse it and the flags.
 *
 * @param {string} text the text argument.
 *
 * @return {?RegExp} a RegExp object or null in case of error.
 */
exports.makeRegExpParameter = function makeRegExpParameter(text) {
  let [, source, flags] = regexpRegexp.exec(text) || [null, textToRegExp(text)];

  try {
    return new RegExp(source, flags);
  }
  catch (e) {
    return null;
  }
};

let splitSelector = exports.splitSelector = function splitSelector(selector) {
  if (!selector.includes(",")) {
    return [selector];
  }

  let selectors = [];
  let start = 0;
  let level = 0;
  let sep = "";

  for (let i = 0; i < selector.length; i++) {
    let chr = selector[i];

    // ignore escaped characters
    if (chr == "\\") {
      i++;
    }
    // don't split within quoted text
    else if (chr == sep) {
      sep = "";             // e.g. [attr=","]
    }
    else if (sep == "") {
      if (chr == '"' || chr == "'") {
        sep = chr;
      }
      // don't split between parentheses
      else if (chr == "(") {
        level++;            // e.g. :matches(div,span)
      }
      else if (chr == ")") {
        level = Math.max(0, level - 1);
      }
      else if (chr == "," && level == 0) {
        selectors.push(selector.substring(start, i));
        start = i + 1;
      }
    }
  }

  selectors.push(selector.substring(start));
  return selectors;
};

function findTargetSelectorIndex(selector) {
  let index = 0;
  let whitespace = 0;
  let scope = [];

  // Start from the end of the string and go character by character, where each
  // character is a Unicode code point.
  for (let character of [...selector].reverse()) {
    let currentScope = scope[scope.length - 1];

    if (character == "'" || character == "\"") {
      // If we're already within the same type of quote, close the scope;
      // otherwise open a new scope.
      if (currentScope == character) {
        scope.pop();
      }
      else {
        scope.push(character);
      }
    }
    else if (character == "]" || character == ")") {
      // For closing brackets and parentheses, open a new scope only if we're
      // not within a quote. Within quotes these characters should have no
      // meaning.
      if (currentScope != "'" && currentScope != "\"") {
        scope.push(character);
      }
    }
    else if (character == "[") {
      // If we're already within a bracket, close the scope.
      if (currentScope == "]") {
        scope.pop();
      }
    }
    else if (character == "(") {
      // If we're already within a parenthesis, close the scope.
      if (currentScope == ")") {
        scope.pop();
      }
    }
    else if (!currentScope) {
      // At the top level (not within any scope), count the whitespace if we've
      // encountered it. Otherwise if we've hit one of the combinators,
      // terminate here; otherwise if we've hit a non-colon character,
      // terminate here.
      if (/\s/.test(character)) {
        whitespace++;
      }
      else if ((character == ">" || character == "+" || character == "~") ||
               (whitespace > 0 && character != ":")) {
        break;
      }
    }

    // Zero out the whitespace count if we've entered a scope.
    if (scope.length > 0) {
      whitespace = 0;
    }

    // Increment the index by the size of the character. Note that for Unicode
    // composite characters (like emoji) this will be more than one.
    index += character.length;
  }

  return selector.length - index + whitespace;
}

/**
 * Qualifies a CSS selector with a qualifier, which may be another CSS selector
 * or an empty string. For example, given the selector "div.bar" and the
 * qualifier "#foo", this function returns "div#foo.bar".
 * @param {string} selector The selector to qualify.
 * @param {string} qualifier The qualifier with which to qualify the selector.
 * @returns {string} The qualified selector.
 * @package
 */
exports.qualifySelector = function qualifySelector(selector, qualifier) {
  let qualifiedSelector = "";

  let qualifierTargetSelectorIndex = findTargetSelectorIndex(qualifier);
  let [, qualifierType = ""] =
    /^([a-z][a-z-]*)?/i.exec(qualifier.substring(qualifierTargetSelectorIndex));

  for (let sub of splitSelector(selector)) {
    sub = sub.trim();

    qualifiedSelector += ", ";

    let index = findTargetSelectorIndex(sub);

    // Note that the first group in the regular expression is optional. If it
    // doesn't match (e.g. "#foo::nth-child(1)"), type will be an empty string.
    let [, type = "", rest] =
      /^([a-z][a-z-]*)?\*?(.*)/i.exec(sub.substring(index));

    if (type == qualifierType) {
      type = "";
    }

    // If the qualifier ends in a combinator (e.g. "body #foo>"), we put the
    // type and the rest of the selector after the qualifier
    // (e.g. "body #foo>div.bar"); otherwise (e.g. "body #foo") we merge the
    // type into the qualifier (e.g. "body div#foo.bar").
    if (/[\s>+~]$/.test(qualifier)) {
      qualifiedSelector += sub.substring(0, index) + qualifier + type + rest;
    }
    else {
      qualifiedSelector += sub.substring(0, index) + type + qualifier + rest;
    }
  }

  // Remove the initial comma and space.
  return qualifiedSelector.substring(2);
};


/***/ }),

/***/ 1267:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-present eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */

/** @module */



const {makeRegExpParameter, splitSelector,
       qualifySelector} = __webpack_require__(7159);
const {filterToRegExp} = __webpack_require__(453);

const DEFAULT_MIN_INVOCATION_INTERVAL = 3000;
let minInvocationInterval = DEFAULT_MIN_INVOCATION_INTERVAL;
const DEFAULT_MAX_SYCHRONOUS_PROCESSING_TIME = 50;
let maxSynchronousProcessingTime = DEFAULT_MAX_SYCHRONOUS_PROCESSING_TIME;

const abpSelectorRegexp = /:(-abp-[\w-]+|has|has-text|xpath|not)\(/;

let testInfo = null;

function toCSSStyleDeclaration(value) {
  return Object.assign(document.createElement("test"), {style: value}).style;
}

/**
 * Enables test mode, which tracks additional metadata about the inner
 * workings for test purposes. This also allows overriding internal
 * configuration.
 *
 * @param {object} options
 * @param {number} options.minInvocationInterval Overrides how long
 *   must be waited between filter processing runs
 * @param {number} options.maxSynchronousProcessingTime Overrides how
 *   long the thread may spend processing filters before it must yield
 *   its thread
 */
__webpack_unused_export__ = function setTestMode(options) {
  if (typeof options.minInvocationInterval !== "undefined") {
    minInvocationInterval = options.minInvocationInterval;
  }
  if (typeof options.maxSynchronousProcessingTime !== "undefined") {
    maxSynchronousProcessingTime = options.maxSynchronousProcessingTime;
  }

  testInfo = {
    lastProcessedElements: new Set(),
    failedAssertions: []
  };
};

__webpack_unused_export__ = function getTestInfo() {
  return testInfo;
};

__webpack_unused_export__ = function() {
  minInvocationInterval = DEFAULT_MIN_INVOCATION_INTERVAL;
  maxSynchronousProcessingTime = DEFAULT_MAX_SYCHRONOUS_PROCESSING_TIME;
  testInfo = null;
};

/**
 * Creates a new IdleDeadline.
 *
 * Note: This function is synchronous and does NOT request an idle
 * callback.
 *
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline}.
 * @return {IdleDeadline}
 */
function newIdleDeadline() {
  let startTime = performance.now();
  return {
    didTimeout: false,
    timeRemaining() {
      let elapsed = performance.now() - startTime;
      let remaining = maxSynchronousProcessingTime - elapsed;
      return Math.max(0, remaining);
    }
  };
}

/**
 * Returns a promise that is resolved when the browser is next idle.
 *
 * This is intended to be used for long running tasks on the UI thread
 * to allow other UI events to process.
 *
 * @return {Promise.<IdleDeadline>}
 *    A promise that is fulfilled when you can continue processing
 */
function yieldThread() {
  return new Promise(resolve => {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(resolve);
    }
    else {
      setTimeout(() => {
        resolve(newIdleDeadline());
      }, 0);
    }
  });
}


function getCachedPropertyValue(object, name, defaultValueFunc = () => {}) {
  let value = object[name];
  if (typeof value == "undefined") {
    Object.defineProperty(object, name, {value: value = defaultValueFunc()});
  }
  return value;
}

/**
 * Return position of node from parent.
 * @param {Node} node the node to find the position of.
 * @return {number} One-based index like for :nth-child(), or 0 on error.
 */
function positionInParent(node) {
  let index = 0;
  for (let child of node.parentNode.children) {
    if (child == node) {
      return index + 1;
    }

    index++;
  }

  return 0;
}

function makeSelector(node, selector = "") {
  if (node == null) {
    return null;
  }
  if (!node.parentElement) {
    let newSelector = ":root";
    if (selector) {
      newSelector += " > " + selector;
    }
    return newSelector;
  }
  let idx = positionInParent(node);
  if (idx > 0) {
    let newSelector = `${node.tagName}:nth-child(${idx})`;
    if (selector) {
      newSelector += " > " + selector;
    }
    return makeSelector(node.parentElement, newSelector);
  }

  return selector;
}

function parseSelectorContent(content, startIndex) {
  let parens = 1;
  let quote = null;
  let i = startIndex;
  for (; i < content.length; i++) {
    let c = content[i];
    if (c == "\\") {
      // Ignore escaped characters
      i++;
    }
    else if (quote) {
      if (c == quote) {
        quote = null;
      }
    }
    else if (c == "'" || c == '"') {
      quote = c;
    }
    else if (c == "(") {
      parens++;
    }
    else if (c == ")") {
      parens--;
      if (parens == 0) {
        break;
      }
    }
  }

  if (parens > 0) {
    return null;
  }
  return {text: content.substring(startIndex, i), end: i};
}

/**
 * Stringified style objects
 * @typedef {Object} StringifiedStyle
 * @property {string} style CSS style represented by a string.
 * @property {string[]} subSelectors selectors the CSS properties apply to.
 */

/**
 * Produce a string representation of the stylesheet entry.
 * @param {CSSStyleRule} rule the CSS style rule.
 * @return {StringifiedStyle} the stringified style.
 */
function stringifyStyle(rule) {
  let styles = [];
  for (let i = 0; i < rule.style.length; i++) {
    let property = rule.style.item(i);
    let value = rule.style.getPropertyValue(property);
    let priority = rule.style.getPropertyPriority(property);
    styles.push(`${property}: ${value}${priority ? " !" + priority : ""};`);
  }
  styles.sort();
  return {
    style: styles.join(" "),
    subSelectors: splitSelector(rule.selectorText)
  };
}

let scopeSupported = null;

function tryQuerySelector(subtree, selector, all) {
  let elements = null;
  try {
    elements = all ? subtree.querySelectorAll(selector) :
      subtree.querySelector(selector);
    scopeSupported = true;
  }
  catch (e) {
    // Edge doesn't support ":scope"
    scopeSupported = false;
  }
  return elements;
}

/**
 * Query selector.
 *
 * If it is relative, will try :scope.
 *
 * @param {Node} subtree the element to query selector
 * @param {string} selector the selector to query
 * @param {bool} [all=false] true to perform querySelectorAll()
 *
 * @returns {?(Node|NodeList)} result of the query. null in case of error.
 */
function scopedQuerySelector(subtree, selector, all) {
  if (selector[0] == ">") {
    selector = ":scope" + selector;
    if (scopeSupported) {
      return all ? subtree.querySelectorAll(selector) :
        subtree.querySelector(selector);
    }
    if (scopeSupported == null) {
      return tryQuerySelector(subtree, selector, all);
    }
    return null;
  }
  return all ? subtree.querySelectorAll(selector) :
    subtree.querySelector(selector);
}

function scopedQuerySelectorAll(subtree, selector) {
  return scopedQuerySelector(subtree, selector, true);
}

class PlainSelector {
  constructor(selector) {
    this._selector = selector;
    this.maybeDependsOnAttributes = /[#.:]|\[.+\]/.test(selector);
    this.maybeContainsSiblingCombinators = /[~+]/.test(selector);
  }

  /**
   * Generator function returning a pair of selector string and subtree.
   * @param {string} prefix the prefix for the selector.
   * @param {Node} subtree the subtree we work on.
   * @param {Node[]} [targets] the nodes we are interested in.
   */
  *getSelectors(prefix, subtree, targets) {
    yield [prefix + this._selector, subtree];
  }
}

const incompletePrefixRegexp = /[\s>+~]$/;

class NotSelector {
  constructor(selectors) {
    this._innerPattern = new Pattern(selectors);
  }

  get dependsOnStyles() {
    return this._innerPattern.dependsOnStyles;
  }

  get dependsOnCharacterData() {
    return this._innerPattern.dependsOnCharacterData;
  }

  get maybeDependsOnAttributes() {
    return this._innerPattern.maybeDependsOnAttributes;
  }

  *getSelectors(prefix, subtree, targets) {
    for (let element of this.getElements(prefix, subtree, targets)) {
      yield [makeSelector(element), element];
    }
  }

  /**
   * Generator function returning selected elements.
   * @param {string} prefix the prefix for the selector.
   * @param {Node} subtree the subtree we work on.
   * @param {Node[]} [targets] the nodes we are interested in.
   */
  *getElements(prefix, subtree, targets) {
    let actualPrefix = (!prefix || incompletePrefixRegexp.test(prefix)) ?
      prefix + "*" : prefix;
    let elements = scopedQuerySelectorAll(subtree, actualPrefix);
    if (elements) {
      for (let element of elements) {
        // If the element is neither an ancestor nor a descendant of one of the
        // targets, we can skip it.
        if (targets && !targets.some(target => element.contains(target) ||
                                               target.contains(element))) {
          yield null;
          continue;
        }

        if (testInfo) {
          testInfo.lastProcessedElements.add(element);
        }

        if (!this._innerPattern.matches(element, subtree)) {
          yield element;
        }

        yield null;
      }
    }
  }

  setStyles(styles) {
    this._innerPattern.setStyles(styles);
  }
}

class HasSelector {
  constructor(selectors) {
    this._innerPattern = new Pattern(selectors);
  }

  get dependsOnStyles() {
    return this._innerPattern.dependsOnStyles;
  }

  get dependsOnCharacterData() {
    return this._innerPattern.dependsOnCharacterData;
  }

  get maybeDependsOnAttributes() {
    return this._innerPattern.maybeDependsOnAttributes;
  }

  *getSelectors(prefix, subtree, targets) {
    for (let element of this.getElements(prefix, subtree, targets)) {
      yield [makeSelector(element), element];
    }
  }

  /**
   * Generator function returning selected elements.
   * @param {string} prefix the prefix for the selector.
   * @param {Node} subtree the subtree we work on.
   * @param {Node[]} [targets] the nodes we are interested in.
   */
  *getElements(prefix, subtree, targets) {
    let actualPrefix = (!prefix || incompletePrefixRegexp.test(prefix)) ?
      prefix + "*" : prefix;
    let elements = scopedQuerySelectorAll(subtree, actualPrefix);
    if (elements) {
      for (let element of elements) {
        // If the element is neither an ancestor nor a descendant of one of the
        // targets, we can skip it.
        if (targets && !targets.some(target => element.contains(target) ||
                                               target.contains(element))) {
          yield null;
          continue;
        }

        if (testInfo) {
          testInfo.lastProcessedElements.add(element);
        }

        for (let selector of this._innerPattern.evaluate(element, targets)) {
          if (selector == null) {
            yield null;
          }
          else if (scopedQuerySelector(element, selector)) {
            yield element;
          }
        }

        yield null;
      }
    }
  }

  setStyles(styles) {
    this._innerPattern.setStyles(styles);
  }
}

class XPathSelector {
  constructor(textContent) {
    this.dependsOnCharacterData = true;
    this.maybeDependsOnAttributes = true;

    let evaluator = new XPathEvaluator();
    this._expression = evaluator.createExpression(textContent, null);
  }

  *getSelectors(prefix, subtree, targets) {
    for (let element of this.getElements(prefix, subtree, targets)) {
      yield [makeSelector(element), element];
    }
  }

  *getElements(prefix, subtree, targets) {
    let {ORDERED_NODE_SNAPSHOT_TYPE: flag} = XPathResult;
    let elements = prefix ? scopedQuerySelectorAll(subtree, prefix) : [subtree];
    for (let parent of elements) {
      let result = this._expression.evaluate(parent, flag, null);
      for (let i = 0, {snapshotLength} = result; i < snapshotLength; i++) {
        yield result.snapshotItem(i);
      }
    }
  }
}

class ContainsSelector {
  constructor(textContent) {
    this.dependsOnCharacterData = true;

    this._regexp = makeRegExpParameter(textContent);
  }

  *getSelectors(prefix, subtree, targets) {
    for (let element of this.getElements(prefix, subtree, targets)) {
      yield [makeSelector(element), subtree];
    }
  }

  *getElements(prefix, subtree, targets) {
    let actualPrefix = (!prefix || incompletePrefixRegexp.test(prefix)) ?
      prefix + "*" : prefix;

    let elements = scopedQuerySelectorAll(subtree, actualPrefix);

    if (elements) {
      let lastRoot = null;
      for (let element of elements) {
        // For a filter like div:-abp-contains(Hello) and a subtree like
        // <div id="a"><div id="b"><div id="c">Hello</div></div></div>
        // we're only interested in div#a
        if (lastRoot && lastRoot.contains(element)) {
          yield null;
          continue;
        }

        lastRoot = element;

        if (targets && !targets.some(target => element.contains(target) ||
                                               target.contains(element))) {
          yield null;
          continue;
        }

        if (testInfo) {
          testInfo.lastProcessedElements.add(element);
        }

        if (this._regexp && this._regexp.test(element.textContent)) {
          yield element;
        }
        else {
          yield null;
        }
      }
    }
  }
}

class PropsSelector {
  constructor(propertyExpression) {
    this.dependsOnStyles = true;
    this.maybeDependsOnAttributes = true;

    let regexpString;
    if (propertyExpression.length >= 2 && propertyExpression[0] == "/" &&
        propertyExpression[propertyExpression.length - 1] == "/") {
      regexpString = propertyExpression.slice(1, -1);
    }
    else {
      regexpString = filterToRegExp(propertyExpression);
    }

    this._regexp = new RegExp(regexpString, "i");

    this._subSelectors = [];
  }

  *getSelectors(prefix, subtree, targets) {
    for (let subSelector of this._subSelectors) {
      if (subSelector.startsWith("*") &&
          !incompletePrefixRegexp.test(prefix)) {
        subSelector = subSelector.substring(1);
      }

      yield [qualifySelector(subSelector, prefix), subtree];
    }
  }

  setStyles(styles) {
    this._subSelectors = [];
    for (let style of styles) {
      if (this._regexp.test(style.style)) {
        for (let subSelector of style.subSelectors) {
          let idx = subSelector.lastIndexOf("::");
          if (idx != -1) {
            subSelector = subSelector.substring(0, idx);
          }

          this._subSelectors.push(subSelector);
        }
      }
    }
  }
}

class Pattern {
  constructor(selectors, text, remove = false, css = null) {
    this.selectors = selectors;
    this.text = text;
    this.remove = remove;
    this.css = css;
  }

  get dependsOnStyles() {
    return getCachedPropertyValue(
      this, "_dependsOnStyles", () => this.selectors.some(
        selector => selector.dependsOnStyles
      )
    );
  }

  get maybeDependsOnAttributes() {
    // Observe changes to attributes if either there's a plain selector that
    // looks like an ID selector, class selector, or attribute selector in one
    // of the patterns (e.g. "a[href='https://example.com/']")
    // or there's a properties selector nested inside a has selector
    // (e.g. "div:-abp-has(:-abp-properties(color: blue))")
    return getCachedPropertyValue(
      this, "_maybeDependsOnAttributes", () => this.selectors.some(
        selector => selector.maybeDependsOnAttributes ||
                    (selector instanceof HasSelector &&
                     selector.dependsOnStyles)
      )
    );
  }

  get dependsOnCharacterData() {
    // Observe changes to character data only if there's a contains selector in
    // one of the patterns.
    return getCachedPropertyValue(
      this, "_dependsOnCharacterData", () => this.selectors.some(
        selector => selector.dependsOnCharacterData
      )
    );
  }

  get maybeContainsSiblingCombinators() {
    return getCachedPropertyValue(
      this, "_maybeContainsSiblingCombinators", () => this.selectors.some(
        selector => selector.maybeContainsSiblingCombinators
      )
    );
  }

  matchesMutationTypes(mutationTypes) {
    let mutationTypeMatchMap = getCachedPropertyValue(
      this, "_mutationTypeMatchMap", () => new Map([
        // All types of DOM-dependent patterns are affected by mutations of
        // type "childList".
        ["childList", true],
        ["attributes", this.maybeDependsOnAttributes],
        ["characterData", this.dependsOnCharacterData]
      ])
    );

    for (let mutationType of mutationTypes) {
      if (mutationTypeMatchMap.get(mutationType)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Generator function returning CSS selectors for all elements that
   * match the pattern.
   *
   * This allows transforming from selectors that may contain custom
   * :-abp- selectors to pure CSS selectors that can be used to select
   * elements.
   *
   * The selectors returned from this function may be invalidated by DOM
   * mutations.
   *
   * @param {Node} subtree the subtree we work on
   * @param {Node[]} [targets] the nodes we are interested in. May be
   * used to optimize search.
   */
  *evaluate(subtree, targets) {
    let selectors = this.selectors;
    function* evaluateInner(index, prefix, currentSubtree) {
      if (index >= selectors.length) {
        yield prefix;
        return;
      }
      for (let [selector, element] of selectors[index].getSelectors(
        prefix, currentSubtree, targets
      )) {
        if (selector == null) {
          yield null;
        }
        else {
          yield* evaluateInner(index + 1, selector, element);
        }
      }
      // Just in case the getSelectors() generator above had to run some heavy
      // document.querySelectorAll() call which didn't produce any results, make
      // sure there is at least one point where execution can pause.
      yield null;
    }
    yield* evaluateInner(0, "", subtree);
  }

  /**
   * Checks if a pattern matches a specific element
   * @param {Node} [target] the element we're interested in checking for
   * matches on.
   * @param {Node} subtree the subtree we work on
   * @return {bool}
   */
  matches(target, subtree) {
    let targetFilter = [target];
    if (this.maybeContainsSiblingCombinators) {
      targetFilter = null;
    }

    let selectorGenerator = this.evaluate(subtree, targetFilter);
    for (let selector of selectorGenerator) {
      if (selector && target.matches(selector)) {
        return true;
      }
    }
    return false;
  }

  setStyles(styles) {
    for (let selector of this.selectors) {
      if (selector.dependsOnStyles) {
        selector.setStyles(styles);
      }
    }
  }
}

function extractMutationTypes(mutations) {
  let types = new Set();

  for (let mutation of mutations) {
    types.add(mutation.type);

    // There are only 3 types of mutations: "attributes", "characterData", and
    // "childList".
    if (types.size == 3) {
      break;
    }
  }

  return types;
}

function extractMutationTargets(mutations) {
  if (!mutations) {
    return null;
  }

  let targets = new Set();

  for (let mutation of mutations) {
    if (mutation.type == "childList") {
      // When new nodes are added, we're interested in the added nodes rather
      // than the parent.
      for (let node of mutation.addedNodes) {
        targets.add(node);
      }
      if (mutation.removedNodes.length > 0) {
        targets.add(mutation.target);
      }
    }
    else {
      targets.add(mutation.target);
    }
  }

  return [...targets];
}

function filterPatterns(patterns, {stylesheets, mutations}) {
  if (!stylesheets && !mutations) {
    return patterns.slice();
  }

  let mutationTypes = mutations ? extractMutationTypes(mutations) : null;

  return patterns.filter(
    pattern => (stylesheets && pattern.dependsOnStyles) ||
               (mutations && pattern.matchesMutationTypes(mutationTypes))
  );
}

function shouldObserveAttributes(patterns) {
  return patterns.some(pattern => pattern.maybeDependsOnAttributes);
}

function shouldObserveCharacterData(patterns) {
  return patterns.some(pattern => pattern.dependsOnCharacterData);
}

function shouldObserveStyles(patterns) {
  return patterns.some(pattern => pattern.dependsOnStyles);
}

/**
 * @callback hideElemsFunc
 * @param {Node[]} elements Elements on the page that should be hidden
 * @param {string[]} elementFilters
 *   The filter text that caused the elements to be hidden
 */

/**
 * @callback unhideElemsFunc
 * @param {Node[]} elements Elements on the page that should be hidden
 */

/**
 * @callback removeElemsFunc
 * @param {Node[]} elements Elements on the page that should be removed
 * @param {string[]} elementFilters
 *   The filter text that caused the elements to be removed
 * removed from the DOM
 */

/**
 * @callback cssElemsFunc
 * @param {Node[]} elements Elements on the page that should
 * apply inline CSS rules
 * @param {string[]} cssPatterns The CSS patterns to be applied
 */


/**
 * Manages the front-end processing of element hiding emulation filters.
 */
exports.WX = class ElemHideEmulation {
  /**
   * @param {module:content/elemHideEmulation~hideElemsFunc} hideElemsFunc
   *   A callback that should be provided to do the actual element hiding.
   * @param {module:content/elemHideEmulation~unhideElemsFunc} unhideElemsFunc
   *   A callback that should be provided to unhide previously hidden elements.
   * @param {module:content/elemHideEmulation~removeElemsFunc} removeElemsFunc
   *   A callback that should be provided to remove elements from the DOM.
   * @param {module:content/elemHideEmulation~cssElemsFunc} cssElemsFunc
   *   A callback that should be provided to apply inline CSS rules to elements
  */
  constructor(
    hideElemsFunc = () => {},
    unhideElemsFunc = () => {},
    removeElemsFunc = () => {},
    cssElemsFunc = () => {}
  ) {
    this._filteringInProgress = false;
    this._nextFilteringScheduled = false;
    this._lastInvocation = -minInvocationInterval;
    this._scheduledProcessing = null;

    this.document = document;
    this.hideElemsFunc = hideElemsFunc;
    this.unhideElemsFunc = unhideElemsFunc;
    this.removeElemsFunc = removeElemsFunc;
    this.cssElemsFunc = cssElemsFunc;
    this.observer = new MutationObserver(this.observe.bind(this));
    this.hiddenElements = new Map();
  }

  isSameOrigin(stylesheet) {
    try {
      return new URL(stylesheet.href).origin == this.document.location.origin;
    }
    catch (e) {
      // Invalid URL, assume that it is first-party.
      return true;
    }
  }

  /**
   * Parse the selector
   * @param {string} selector the selector to parse
   * @return {Array} selectors is an array of objects,
   * or null in case of errors.
   */
  parseSelector(selector) {
    if (selector.length == 0) {
      return [];
    }

    let match = abpSelectorRegexp.exec(selector);
    if (!match) {
      return [new PlainSelector(selector)];
    }

    let selectors = [];
    if (match.index > 0) {
      selectors.push(new PlainSelector(selector.substring(0, match.index)));
    }

    let startIndex = match.index + match[0].length;
    let content = parseSelectorContent(selector, startIndex);
    if (!content) {
      console.warn(new SyntaxError("Failed to parse Adblock Plus " +
                                   `selector ${selector} ` +
                                   "due to unmatched parentheses."));
      return null;
    }

    if (match[1] == "-abp-properties") {
      selectors.push(new PropsSelector(content.text));
    }
    else if (match[1] == "-abp-has" || match[1] == "has") {
      let hasSelectors = this.parseSelector(content.text);
      if (hasSelectors == null) {
        return null;
      }
      selectors.push(new HasSelector(hasSelectors));
    }
    else if (match[1] == "-abp-contains" || match[1] == "has-text") {
      selectors.push(new ContainsSelector(content.text));
    }
    else if (match[1] === "xpath") {
      try {
        selectors.push(new XPathSelector(content.text));
      }
      catch ({message}) {
        console.warn(
          new SyntaxError(
            "Failed to parse Adblock Plus " +
            `selector ${selector}, invalid ` +
            `xpath: ${content.text} ` +
            `error: ${message}.`
          )
        );

        return null;
      }
    }
    else if (match[1] == "not") {
      let notSelectors = this.parseSelector(content.text);
      if (notSelectors == null) {
        return null;
      }

      // if all of the inner selectors are PlainSelectors, then we
      // don't actually need to use our selector at all. We're better
      // off delegating to the browser :not implementation.
      if (notSelectors.every(s => s instanceof PlainSelector)) {
        selectors.push(new PlainSelector(`:not(${content.text})`));
      }
      else {
        selectors.push(new NotSelector(notSelectors));
      }
    }
    else {
      // this is an error, can't parse selector.
      console.warn(new SyntaxError("Failed to parse Adblock Plus " +
                                   `selector ${selector}, invalid ` +
                                   `pseudo-class :${match[1]}().`));
      return null;
    }

    let suffix = this.parseSelector(selector.substring(content.end + 1));
    if (suffix == null) {
      return null;
    }

    selectors.push(...suffix);

    if (selectors.length == 1 && selectors[0] instanceof ContainsSelector) {
      console.warn(new SyntaxError("Failed to parse Adblock Plus " +
                                   `selector ${selector}, can't ` +
                                   "have a lonely :-abp-contains()."));
      return null;
    }
    return selectors;
  }

  /**
   * Reads the rules out of CSS stylesheets
   * @param {CSSStyleSheet[]} [stylesheets] The list of stylesheets to
   * read.
   * @return {CSSStyleRule[]}
   */
  _readCssRules(stylesheets) {
    let cssStyles = [];

    for (let stylesheet of stylesheets || []) {
      // Explicitly ignore third-party stylesheets to ensure consistent behavior
      // between Firefox and Chrome.
      if (!this.isSameOrigin(stylesheet)) {
        continue;
      }

      let rules;
      try {
        rules = stylesheet.cssRules;
      }
      catch (e) {
        // On Firefox, there is a chance that an InvalidAccessError
        // get thrown when accessing cssRules. Just skip the stylesheet
        // in that case.
        // See https://searchfox.org/mozilla-central/rev/f65d7528e34ef1a7665b4a1a7b7cdb1388fcd3aa/layout/style/StyleSheet.cpp#699
        continue;
      }

      if (!rules) {
        continue;
      }

      for (let rule of rules) {
        if (rule.type != rule.STYLE_RULE) {
          continue;
        }

        cssStyles.push(stringifyStyle(rule));
      }
    }
    return cssStyles;
  }

  /**
   * Processes the current document and applies all rules to it.
   * @param {CSSStyleSheet[]} [stylesheets]
   *    The list of new stylesheets that have been added to the document and
   *    made reprocessing necessary. This parameter shouldn't be passed in for
   *    the initial processing, all of document's stylesheets will be considered
   *    then and all rules, including the ones not dependent on styles.
   * @param {MutationRecord[]} [mutations]
   *    The list of DOM mutations that have been applied to the document and
   *    made reprocessing necessary. This parameter shouldn't be passed in for
   *    the initial processing, the entire document will be considered
   *    then and all rules, including the ones not dependent on the DOM.
   * @return {Promise}
   *    A promise that is fulfilled once all filtering is completed
   */
  async _addSelectors(stylesheets, mutations) {
    if (testInfo) {
      testInfo.lastProcessedElements.clear();
    }

    let deadline = newIdleDeadline();

    if (shouldObserveStyles(this.patterns)) {
      this._refreshPatternStyles();
    }

    let patternsToCheck = filterPatterns(
      this.patterns, {stylesheets, mutations}
    );

    let targets = extractMutationTargets(mutations);

    const elementsToHide = [];
    const elementsToHideFilters = [];
    const elementsToRemoveFilters = [];
    const elementsToRemove = [];
    const elementsToApplyCSS = [];
    const cssPatterns = [];
    let elementsToUnhide = new Set(this.hiddenElements.keys());
    for (let pattern of patternsToCheck) {
      let evaluationTargets = targets;

      // If the pattern appears to contain any sibling combinators, we can't
      // easily optimize based on the mutation targets. Since this is a
      // special case, skip the optimization. By setting it to null here we
      // make sure we process the entire DOM.
      if (pattern.maybeContainsSiblingCombinators) {
        evaluationTargets = null;
      }

      let generator = pattern.evaluate(this.document, evaluationTargets);
      for (let selector of generator) {
        if (selector != null) {
          for (let element of this.document.querySelectorAll(selector)) {
            if (pattern.remove) {
              elementsToRemove.push(element);
              elementsToRemoveFilters.push(pattern.text);
              elementsToUnhide.delete(element);
            }
            else if (pattern.css) {
              elementsToApplyCSS.push(element);
              cssPatterns.push(pattern);
            }
            else if (!this.hiddenElements.has(element)) {
              elementsToHide.push(element);
              elementsToHideFilters.push(pattern.text);
            }
            else {
              elementsToUnhide.delete(element);
            }
          }
        }

        if (deadline.timeRemaining() <= 0) {
          deadline = await yieldThread();
        }
      }
    }
    this._removeElems(elementsToRemove, elementsToRemoveFilters);
    this._applyCSSToElems(elementsToApplyCSS, cssPatterns);
    this._hideElems(elementsToHide, elementsToHideFilters);

    // The search for elements to hide it optimized to find new things
    // to hide quickly, by not checking all patterns and not checking
    // the full DOM. That's why we need to do a more thorough check
    // for each remaining element that might need to be unhidden,
    // checking all patterns.
    for (let elem of elementsToUnhide) {
      if (!elem.isConnected) {
        // elements that are no longer in the DOM should be unhidden
        // in case they're ever readded, and then forgotten about so
        // we don't cause a memory leak.
        continue;
      }
      let matchesAny = this.patterns.some(pattern => pattern.matches(
        elem, this.document
      ));
      if (matchesAny) {
        elementsToUnhide.delete(elem);
      }

      if (deadline.timeRemaining() <= 0) {
        deadline = await yieldThread();
      }
    }
    this._unhideElems(Array.from(elementsToUnhide));
  }

  _removeElems(elementsToRemove, elementFilters) {
    if (elementsToRemove.length > 0) {
      this.removeElemsFunc(elementsToRemove, elementFilters);
      for (let elem of elementsToRemove) {
        // they're not hidden anymore (if they ever were), they're
        // removed. There's no unhiding these ones!
        this.hiddenElements.delete(elem);
      }
    }
  }

  _applyCSSToElems(elements, cssPatterns) {
    if (elements.length > 0) {
      this.cssElemsFunc(elements, cssPatterns);
    }
  }

  _hideElems(elementsToHide, elementFilters) {
    if (elementsToHide.length > 0) {
      this.hideElemsFunc(elementsToHide, elementFilters);
      for (let i = 0; i < elementsToHide.length; i++) {
        this.hiddenElements.set(elementsToHide[i], elementFilters[i]);
      }
    }
  }

  _unhideElems(elementsToUnhide) {
    if (elementsToUnhide.length > 0) {
      this.unhideElemsFunc(elementsToUnhide);
      for (let elem of elementsToUnhide) {
        this.hiddenElements.delete(elem);
      }
    }
  }

  /**
   * Performed any scheduled processing.
   *
   * This function is asyncronous, and should not be run multiple
   * times in parallel. The flag `_filteringInProgress` is set and
   * unset so you can check if it's already running.
   * @return {Promise}
   *  A promise that is fulfilled once all filtering is completed
   */
  async _processFiltering() {
    if (this._filteringInProgress) {
      console.warn("ElemHideEmulation scheduling error: " +
                   "Tried to process filtering in parallel.");
      if (testInfo) {
        testInfo.failedAssertions.push(
          "Tried to process filtering in parallel"
        );
      }

      return;
    }

    let params = this._scheduledProcessing || {};
    this._scheduledProcessing = null;
    this._filteringInProgress = true;
    this._nextFilteringScheduled = false;
    await this._addSelectors(
      params.stylesheets,
      params.mutations
    );
    this._lastInvocation = performance.now();
    this._filteringInProgress = false;
    if (this._scheduledProcessing) {
      this._scheduleNextFiltering();
    }
  }

  /**
   * Appends new changes to the list of filters for the next time
   * filtering is run.
   * @param {CSSStyleSheet[]} [stylesheets]
   *    new stylesheets to be processed. This parameter should be omitted
   *    for full reprocessing.
   * @param {MutationRecord[]} [mutations]
   *    new DOM mutations to be processed. This parameter should be omitted
   *    for full reprocessing.
   */
  _appendScheduledProcessing(stylesheets, mutations) {
    if (!this._scheduledProcessing) {
      // There isn't anything scheduled yet. Make the schedule.
      this._scheduledProcessing = {stylesheets, mutations};
    }
    else if (!stylesheets && !mutations) {
      // The new request was to reprocess everything, and so any
      // previous filters are irrelevant.
      this._scheduledProcessing = {};
    }
    else if (this._scheduledProcessing.stylesheets ||
             this._scheduledProcessing.mutations) {
      // The previous filters are not to filter everything, so the new
      // parameters matter. Push them onto the appropriate lists.
      if (stylesheets) {
        if (!this._scheduledProcessing.stylesheets) {
          this._scheduledProcessing.stylesheets = [];
        }
        this._scheduledProcessing.stylesheets.push(...stylesheets);
      }
      if (mutations) {
        if (!this._scheduledProcessing.mutations) {
          this._scheduledProcessing.mutations = [];
        }
        this._scheduledProcessing.mutations.push(...mutations);
      }
    }
    else {
      // this._scheduledProcessing is already going to recheck
      // everything, so no need to do anything here.
    }
  }

  /**
   * Schedule filtering to be processed in the future, or start
   * processing immediately.
   *
   * If processing is already scheduled, this does nothing.
   */
  _scheduleNextFiltering() {
    if (this._nextFilteringScheduled || this._filteringInProgress) {
      // The next one has already been scheduled. Our new events are
      // on the queue, so nothing more to do.
      return;
    }

    if (this.document.readyState === "loading") {
      // Document isn't fully loaded yet, so schedule our first
      // filtering as soon as that's done.
      this.document.addEventListener(
        "DOMContentLoaded",
        () => this._processFiltering(),
        {once: true}
      );
      this._nextFilteringScheduled = true;
    }
    else if (performance.now() - this._lastInvocation <
             minInvocationInterval) {
      // It hasn't been long enough since our last filter. Set the
      // timeout for when it's time for that.
      setTimeout(
        () => this._processFiltering(),
        minInvocationInterval - (performance.now() - this._lastInvocation)
      );
      this._nextFilteringScheduled = true;
    }
    else {
      // We can actually just start filtering immediately!
      this._processFiltering();
    }
  }

  /**
   * Re-run filtering either immediately or queued.
   * @param {CSSStyleSheet[]} [stylesheets]
   *    new stylesheets to be processed. This parameter should be omitted
   *    for full reprocessing.
   * @param {MutationRecord[]} [mutations]
   *    new DOM mutations to be processed. This parameter should be omitted
   *    for full reprocessing.
   */
  queueFiltering(stylesheets, mutations) {
    this._appendScheduledProcessing(stylesheets, mutations);
    this._scheduleNextFiltering();
  }

  _refreshPatternStyles(stylesheet) {
    let allCssRules = this._readCssRules(this.document.styleSheets);
    for (let pattern of this.patterns) {
      pattern.setStyles(allCssRules);
    }
  }

  onLoad(event) {
    let stylesheet = event.target.sheet;
    if (stylesheet) {
      this.queueFiltering([stylesheet]);
    }
  }

  observe(mutations) {
    if (testInfo) {
      // In test mode, filter out any mutations likely done by us
      // (i.e. style="display: none !important"). This makes it easier to
      // observe how the code responds to DOM mutations.
      mutations = mutations.filter(
        ({type, attributeName, target: {style: newValue}, oldValue}) =>
          !(type == "attributes" && attributeName == "style" &&
            newValue.display == "none" &&
            toCSSStyleDeclaration(oldValue).display != "none")
      );

      if (mutations.length == 0) {
        return;
      }
    }

    this.queueFiltering(null, mutations);
  }

  apply(patterns) {
    if (this.patterns) {
      let removedPatterns = [];
      for (let oldPattern of this.patterns) {
        if (!patterns.find(newPattern => newPattern.text == oldPattern.text)) {
          removedPatterns.push(oldPattern);
        }
      }
      let elementsToUnhide = [];
      for (let pattern of removedPatterns) {
        for (let [element, filter] of this.hiddenElements) {
          if (filter == pattern.text) {
            elementsToUnhide.push(element);
          }
        }
      }
      if (elementsToUnhide.length > 0) {
        this._unhideElems(elementsToUnhide);
      }
    }

    this.patterns = [];
    for (let pattern of patterns) {
      let selectors = this.parseSelector(pattern.selector);
      if (selectors != null && selectors.length > 0) {
        this.patterns.push(
          new Pattern(selectors, pattern.text, pattern.remove, pattern.css)
        );
      }
    }

    if (this.patterns.length > 0) {
      this.queueFiltering();

      let attributes = shouldObserveAttributes(this.patterns);
      this.observer.observe(
        this.document,
        {
          childList: true,
          attributes,
          attributeOldValue: attributes && !!testInfo,
          characterData: shouldObserveCharacterData(this.patterns),
          subtree: true
        }
      );
      if (shouldObserveStyles(this.patterns)) {
        let onLoad = this.onLoad.bind(this);
        if (this.document.readyState === "loading") {
          this.document.addEventListener("DOMContentLoaded", onLoad, true);
        }
        this.document.addEventListener("load", onLoad, true);
      }
    }
  }

  disconnect() {
    this.observer.disconnect();
    this._unhideElems(Array.from(this.hiddenElements.keys()));
  }
};


/***/ }),

/***/ 453:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-present eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */

/** @module */



/**
 * The maximum number of patterns that
 * `{@link module:patterns.compilePatterns compilePatterns()}` will compile
 * into regular expressions.
 * @type {number}
 */
const COMPILE_PATTERNS_MAX = 100;

/**
 * Regular expression used to match the `^` suffix in an otherwise literal
 * pattern.
 * @type {RegExp}
 */
let separatorRegExp = /[\x00-\x24\x26-\x2C\x2F\x3A-\x40\x5B-\x5E\x60\x7B-\x7F]/;

let filterToRegExp =
/**
 * Converts filter text into regular expression string
 * @param {string} text as in Filter()
 * @return {string} regular expression representation of filter text
 * @package
 */
exports.filterToRegExp = function filterToRegExp(text) {
  // remove multiple wildcards
  text = text.replace(/\*+/g, "*");

  // remove leading wildcard
  if (text[0] == "*") {
    text = text.substring(1);
  }

  // remove trailing wildcard
  if (text[text.length - 1] == "*") {
    text = text.substring(0, text.length - 1);
  }

  return text
    // remove anchors following separator placeholder
    .replace(/\^\|$/, "^")
    // escape special symbols
    .replace(/\W/g, "\\$&")
    // replace wildcards by .*
    .replace(/\\\*/g, ".*")
    // process separator placeholders (all ANSI characters but alphanumeric
    // characters and _%.-)
    .replace(/\\\^/g, `(?:${separatorRegExp.source}|$)`)
    // process extended anchor at expression start
    .replace(/^\\\|\\\|/, "^[\\w\\-]+:\\/+(?:[^\\/]+\\.)?")
    // process anchor at expression start
    .replace(/^\\\|/, "^")
    // process anchor at expression end
    .replace(/\\\|$/, "$");
};

/**
 * Regular expression used to match the `||` prefix in an otherwise literal
 * pattern.
 * @type {RegExp}
 */
let extendedAnchorRegExp = new RegExp(filterToRegExp("||") + "$");

/**
 * Regular expression for matching a keyword in a filter.
 * @type {RegExp}
 */
let keywordRegExp = /[^a-z0-9%*][a-z0-9%]{2,}(?=[^a-z0-9%*])/;

/**
 * Regular expression for matching all keywords in a filter.
 * @type {RegExp}
 */
let allKeywordsRegExp = new RegExp(keywordRegExp, "g");

/**
 * A `CompiledPatterns` object represents the compiled version of multiple URL
 * request patterns. It is returned by
 * `{@link module:patterns.compilePatterns compilePatterns()}`.
 */
class CompiledPatterns {
  /**
   * Creates an object with the given regular expressions for case-sensitive
   * and case-insensitive matching respectively.
   * @param {?RegExp} [caseSensitive]
   * @param {?RegExp} [caseInsensitive]
   * @private
   */
  constructor(caseSensitive, caseInsensitive) {
    this._caseSensitive = caseSensitive;
    this._caseInsensitive = caseInsensitive;
  }

  /**
   * Tests whether the given URL request matches the patterns used to create
   * this object.
   * @param {module:url.URLRequest} request
   * @returns {boolean}
   */
  test(request) {
    return ((this._caseSensitive &&
             this._caseSensitive.test(request.href)) ||
            (this._caseInsensitive &&
             this._caseInsensitive.test(request.lowerCaseHref)));
  }
}

/**
 * Compiles patterns from the given filters into a single
 * `{@link module:patterns~CompiledPatterns CompiledPatterns}` object.
 *
 * @param {module:filterClasses.URLFilter|
 *         Set.<module:filterClasses.URLFilter>} filters
 *   The filters. If the number of filters exceeds
 *   `{@link module:patterns~COMPILE_PATTERNS_MAX COMPILE_PATTERNS_MAX}`, the
 *   function returns `null`.
 *
 * @returns {?module:patterns~CompiledPatterns}
 *
 * @package
 */
exports.compilePatterns = function compilePatterns(filters) {
  let list = Array.isArray(filters) ? filters : [filters];

  // If the number of filters is too large, it may choke especially on low-end
  // platforms. As a precaution, we refuse to compile. Ideally we would check
  // the length of the regular expression source rather than the number of
  // filters, but this is far more straightforward and practical.
  if (list.length > COMPILE_PATTERNS_MAX) {
    return null;
  }

  let caseSensitive = "";
  let caseInsensitive = "";

  for (let filter of filters) {
    let source = filter.urlPattern.regexpSource;

    if (filter.matchCase) {
      caseSensitive += source + "|";
    }
    else {
      caseInsensitive += source + "|";
    }
  }

  let caseSensitiveRegExp = null;
  let caseInsensitiveRegExp = null;

  try {
    if (caseSensitive) {
      caseSensitiveRegExp = new RegExp(caseSensitive.slice(0, -1));
    }

    if (caseInsensitive) {
      caseInsensitiveRegExp = new RegExp(caseInsensitive.slice(0, -1));
    }
  }
  catch (error) {
    // It is possible in theory for the regular expression to be too large
    // despite COMPILE_PATTERNS_MAX
    return null;
  }

  return new CompiledPatterns(caseSensitiveRegExp, caseInsensitiveRegExp);
};

/**
 * Patterns for matching against URLs.
 *
 * Internally, this may be a RegExp or match directly against the
 * pattern for simple literal patterns.
 */
exports.Pattern = class Pattern {
  /**
   * @param {string} pattern pattern that requests URLs should be
   * matched against in filter text notation
   * @param {bool} matchCase `true` if comparisons must be case
   * sensitive
   */
  constructor(pattern, matchCase) {
    this.matchCase = matchCase || false;

    if (!this.matchCase) {
      pattern = pattern.toLowerCase();
    }

    if (pattern.length >= 2 &&
        pattern[0] == "/" &&
        pattern[pattern.length - 1] == "/") {
      // The filter is a regular expression - convert it immediately to
      // catch syntax errors
      pattern = pattern.substring(1, pattern.length - 1);
      this._regexp = new RegExp(pattern);
    }
    else {
      // Patterns like /foo/bar/* exist so that they are not treated as regular
      // expressions. We drop any superfluous wildcards here so our
      // optimizations can kick in.
      pattern = pattern.replace(/^\*+/, "").replace(/\*+$/, "");

      // No need to convert this filter to regular expression yet, do it on
      // demand
      this.pattern = pattern;
    }
  }

  /**
   * Checks whether the pattern is a string of literal characters with
   * no wildcards or any other special characters.
   *
   * If the pattern is prefixed with a `||` or suffixed with a `^` but otherwise
   * contains no special characters, it is still considered to be a literal
   * pattern.
   *
   * @returns {boolean}
   */
  isLiteralPattern() {
    return typeof this.pattern !== "undefined" &&
      !/[*^|]/.test(this.pattern.replace(/^\|{1,2}/, "").replace(/[|^]$/, ""));
  }

  /**
   * Regular expression to be used when testing against this pattern.
   *
   * null if the pattern is matched without using regular expressions.
   * @type {RegExp}
   */
  get regexp() {
    if (typeof this._regexp == "undefined") {
      this._regexp = this.isLiteralPattern() ?
        null : new RegExp(filterToRegExp(this.pattern));
    }
    return this._regexp;
  }

  /**
   * Pattern in regular expression notation. This will have a value
   * even if `regexp` returns null.
   * @type {string}
   */
  get regexpSource() {
    return this._regexp ? this._regexp.source : filterToRegExp(this.pattern);
  }

  /**
   * Checks whether the given URL request matches this filter's pattern.
   * @param {module:url.URLRequest} request The URL request to check.
   * @returns {boolean} `true` if the URL request matches.
   */
  matchesLocation(request) {
    let location = this.matchCase ? request.href : request.lowerCaseHref;
    let regexp = this.regexp;
    if (regexp) {
      return regexp.test(location);
    }

    let pattern = this.pattern;
    let startsWithAnchor = pattern[0] == "|";
    let startsWithExtendedAnchor = startsWithAnchor && pattern[1] == "|";
    let endsWithSeparator = pattern[pattern.length - 1] == "^";
    let endsWithAnchor = !endsWithSeparator &&
        pattern[pattern.length - 1] == "|";

    if (startsWithExtendedAnchor) {
      pattern = pattern.substr(2);
    }
    else if (startsWithAnchor) {
      pattern = pattern.substr(1);
    }

    if (endsWithSeparator || endsWithAnchor) {
      pattern = pattern.slice(0, -1);
    }

    let index = location.indexOf(pattern);

    while (index != -1) {
      // The "||" prefix requires that the text that follows does not start
      // with a forward slash.
      if ((startsWithExtendedAnchor ?
           location[index] != "/" &&
           extendedAnchorRegExp.test(location.substring(0, index)) :
           startsWithAnchor ?
           index == 0 :
           true) &&
          (endsWithSeparator ?
           !location[index + pattern.length] ||
           separatorRegExp.test(location[index + pattern.length]) :
           endsWithAnchor ?
           index == location.length - pattern.length :
           true)) {
        return true;
      }

      if (pattern == "") {
        return true;
      }

      index = location.indexOf(pattern, index + 1);
    }

    return false;
  }

  /**
   * Checks whether the pattern has keywords
   * @returns {boolean}
   */
  hasKeywords() {
    return this.pattern && keywordRegExp.test(this.pattern);
  }

  /**
   * Finds all keywords that could be associated with this pattern
   * @returns {string[]}
   */
  keywordCandidates() {
    if (!this.pattern) {
      return null;
    }
    return this.pattern.toLowerCase().match(allKeywordsRegExp);
  }
};


/***/ }),

/***/ 923:
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (module) {
  /* webextension-polyfill - v0.8.0 - Tue Apr 20 2021 11:27:38 */

  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */

  /* vim: set sts=2 sw=2 et tw=80: */

  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (typeof browser === "undefined" || Object.getPrototypeOf(browser) !== Object.prototype) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
    const SEND_RESPONSE_DEPRECATION_WARNING = "Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)"; // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.

    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            },
            "elements": {
              "createSidebarPane": {
                "minArgs": 1,
                "maxArgs": 1
              }
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goBack": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goForward": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };

      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }
      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */


      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }

        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }

          return super.get(key);
        }

      }
      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */


      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };
      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.reject
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function}
       *        The generated callback function.
       */


      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(new Error(extensionAPIs.runtime.lastError.message));
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };

      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";
      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */


      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }

          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }

          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                target[name](...args); // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.

                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;
                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({
                resolve,
                reject
              }, metadata));
            }
          });
        };
      };
      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */


      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }

        });
      };

      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */

      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },

          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }

            if (!(prop in target)) {
              return undefined;
            }

            let value = target[prop];

            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.
              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else if (hasOwnProperty(metadata, "*")) {
              // Wrap all properties in * namespace.
              value = wrapObject(value, wrappers[prop], metadata["*"]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,

                get() {
                  return target[prop];
                },

                set(value) {
                  target[prop] = value;
                }

              });
              return value;
            }

            cache[prop] = value;
            return value;
          },

          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }

            return true;
          },

          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },

          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }

        }; // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.

        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };
      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */


      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },

        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },

        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }

      });

      const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }
        /**
         * Wraps an onRequestFinished listener function so that it will return a
         * `getContent()` property which returns a `Promise` rather than using a
         * callback API.
         *
         * @param {object} req
         *        The HAR entry object representing the network request.
         */


        return function onRequestFinished(req) {
          const wrappedReq = wrapObject(req, {}
          /* wrappers */
          , {
            getContent: {
              minArgs: 0,
              maxArgs: 0
            }
          });
          listener(wrappedReq);
        };
      }); // Keep track if the deprecation warning has been logged at least once.

      let loggedSendResponseDeprecationWarning = false;
      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }
        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */


        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;
          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              if (!loggedSendResponseDeprecationWarning) {
                console.warn(SEND_RESPONSE_DEPRECATION_WARNING, new Error().stack);
                loggedSendResponseDeprecationWarning = true;
              }

              didCallSendResponse = true;
              resolve(response);
            };
          });
          let result;

          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }

          const isResultThenable = result !== true && isThenable(result); // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.

          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          } // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).


          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;

              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }

              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          }; // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.


          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          } // Let Chrome know that the listener is replying.


          return true;
        };
      });

      const wrappedSendMessageCallback = ({
        reject,
        resolve
      }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(new Error(extensionAPIs.runtime.lastError.message));
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };

      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }

        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }

        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, {
            resolve,
            reject
          });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };

      const staticWrappers = {
        devtools: {
          network: {
            onRequestFinished: wrapEvent(onRequestFinishedWrappers)
          }
        },
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 1,
            maxArgs: 3
          })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 2,
            maxArgs: 3
          })
        }
      };
      const settingMetadata = {
        clear: {
          minArgs: 1,
          maxArgs: 1
        },
        get: {
          minArgs: 1,
          maxArgs: 1
        },
        set: {
          minArgs: 1,
          maxArgs: 1
        }
      };
      apiMetadata.privacy = {
        network: {
          "*": settingMetadata
        },
        services: {
          "*": settingMetadata
        },
        websites: {
          "*": settingMetadata
        }
      };
      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    };

    if (typeof chrome != "object" || !chrome || !chrome.runtime || !chrome.runtime.id) {
      throw new Error("This script should only be loaded in a browser extension.");
    } // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.


    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = browser;
  }
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ../../node_modules/webextension-polyfill/dist/browser-polyfill.js
var browser_polyfill = __webpack_require__(923);
// EXTERNAL MODULE: ./adblockpluscore/lib/content/elemHideEmulation.js
var elemHideEmulation = __webpack_require__(1267);
;// ./src/all/errors.js
/*
 * This file is part of eyeo's Web Extension Ad Blocking Toolkit (EWE),
 * Copyright (C) 2006-present eyeo GmbH
 *
 * EWE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * EWE is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EWE.  If not, see <http://www.gnu.org/licenses/>.
 */

const ERROR_NO_CONNECTION = "Could not establish connection. " +
      "Receiving end does not exist.";
const ERROR_CLOSED_CONNECTION = "A listener indicated an asynchronous " +
      "response by returning true, but the message channel closed before a " +
      "response was received";
// https://bugzilla.mozilla.org/show_bug.cgi?id=1578697
const ERROR_MANAGER_DISCONNECTED = "Message manager disconnected";

/**
 * Reconstructs an error from a serializable error object
 *
 * @param {string} errorData - Error object
 *
 * @returns {Error} error
 */
function fromSerializableError(errorData) {
  const error = new Error(errorData.message);
  error.cause = errorData.cause;
  error.name = errorData.name;
  error.stack = errorData.stack;

  return error;
}

/**
 * Filters out `browser.runtime.sendMessage` errors to do with the receiving end
 * no longer existing.
 *
 * @param {Promise} promise The promise that should have "no connection" errors
 *   ignored. Generally this would be the promise returned by
 *   `browser.runtime.sendMessage`.
 * @return {Promise} The same promise, but will resolve with `undefined` instead
 *   of rejecting if the receiving end no longer exists.
 */
function ignoreNoConnectionError(promise) {
  return promise.catch(error => {
    if (typeof error == "object" &&
        (error.message == ERROR_NO_CONNECTION ||
         error.message == ERROR_CLOSED_CONNECTION ||
         error.message == ERROR_MANAGER_DISCONNECTED)) {
      return;
    }

    throw error;
  });
}

/**
 * Creates serializable error object from given error
 *
 * @param {Error} error - Error
 *
 * @returns {string} serializable error object
 */
function toSerializableError(error) {
  return {
    cause: error.cause instanceof Error ?
      toSerializableError(error.cause) :
      error.cause,
    message: error.message,
    name: error.name,
    stack: error.stack
  };
}

;// ./src/content/element-collapsing.js
/*
 * This file is part of eyeo's Web Extension Ad Blocking Toolkit (EWE),
 * Copyright (C) 2006-present eyeo GmbH
 *
 * EWE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * EWE is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EWE.  If not, see <http://www.gnu.org/licenses/>.
 */




let collapsedSelectors = new Set();
let observers = new WeakMap();

function getURLFromElement(element) {
  if (element.localName == "object") {
    if (element.data) {
      return element.data;
    }

    for (let child of element.children) {
      if (child.localName == "param" && child.name == "movie" && child.value) {
        return new URL(child.value, document.baseURI).href;
      }
    }

    return null;
  }

  return element.currentSrc || element.src;
}

function getSelectorForBlockedElement(element) {
  // Setting the "display" CSS property to "none" doesn't have any effect on
  // <frame> elements (in framesets). So we have to hide it inline through
  // the "visibility" CSS property.
  if (element.localName == "frame") {
    return null;
  }

  // If the <video> or <audio> element contains any <source> children,
  // we cannot address it in CSS by the source URL; in that case we
  // don't "collapse" it using a CSS selector but rather hide it directly by
  // setting the style="..." attribute.
  if (element.localName == "video" || element.localName == "audio") {
    for (let child of element.children) {
      if (child.localName == "source") {
        return null;
      }
    }
  }

  let selector = "";
  for (let attr of ["src", "srcset"]) {
    let value = element.getAttribute(attr);
    if (value && attr in element) {
      selector += "[" + attr + "=" + CSS.escape(value) + "]";
    }
  }

  return selector ? element.localName + selector : null;
}

function hideElement(element, properties) {
  let {style} = element;

  if (!properties) {
    if (element.localName == "frame") {
      properties = [["visibility", "hidden"]];
    }
    else {
      properties = [["display", "none"]];
    }
  }

  for (let [key, value] of properties) {
    style.setProperty(key, value, "important");
  }

  if (observers.has(element)) {
    observers.get(element).disconnect();
  }

  let observer = new MutationObserver(() => {
    for (let [key, value] of properties) {
      if (style.getPropertyValue(key) != value ||
          style.getPropertyPriority(key) != "important") {
        style.setProperty(key, value, "important");
      }
    }
  });
  observer.observe(
    element, {
      attributes: true,
      attributeFilter: ["style"]
    }
  );
  observers.set(element, observer);
}

function unhideElement(element) {
  let observer = observers.get(element);
  if (observer) {
    observer.disconnect();
    observers.delete(element);
  }

  let property = element.localName == "frame" ? "visibility" : "display";
  element.style.removeProperty(property);
}

function collapseElement(element) {
  let selector = getSelectorForBlockedElement(element);
  if (!selector) {
    hideElement(element);
    return;
  }

  if (!collapsedSelectors.has(selector)) {
    ignoreNoConnectionError(
      browser_polyfill.runtime.sendMessage({
        type: "ewe:inject-css",
        selector
      })
    );
    collapsedSelectors.add(selector);
  }
}

function hideInAboutBlankFrames(selector, urls) {
  // Resources (e.g. images) loaded into about:blank frames
  // are (sometimes) loaded with the frameId of the main_frame.
  for (let frame of document.querySelectorAll("iframe[src='about:blank']")) {
    if (!frame.contentDocument) {
      continue;
    }

    for (let element of frame.contentDocument.querySelectorAll(selector)) {
      // Use hideElement, because we don't have the correct frameId
      // for the "ewe:inject-css" message.
      if (urls.has(getURLFromElement(element))) {
        hideElement(element);
      }
    }
  }
}

function startElementCollapsing() {
  let deferred = null;

  browser_polyfill.runtime.onMessage.addListener((message, sender) => {
    if (!message || message.type != "ewe:collapse") {
      return;
    }

    if (document.readyState == "loading") {
      if (!deferred) {
        deferred = new Map();
        document.addEventListener("DOMContentLoaded", () => {
          // Under some conditions a hostile script could try to trigger
          // the event again. Since we set deferred to `null`, then
          // we assume that we should just return instead of throwing
          // a TypeError.
          if (!deferred) {
            return;
          }

          for (let [selector, urls] of deferred) {
            for (let element of document.querySelectorAll(selector)) {
              if (urls.has(getURLFromElement(element))) {
                collapseElement(element);
              }
            }

            hideInAboutBlankFrames(selector, urls);
          }

          deferred = null;
        });
      }

      let urls = deferred.get(message.selector) || new Set();
      deferred.set(message.selector, urls);
      urls.add(message.url);
    }
    else {
      for (let element of document.querySelectorAll(message.selector)) {
        if (getURLFromElement(element) == message.url) {
          collapseElement(element);
        }
      }

      hideInAboutBlankFrames(message.selector, new Set([message.url]));
    }
    return false;
  });
}

;// ./src/content/allowlisting.js
/*
 * This file is part of eyeo's Web Extension Ad Blocking Toolkit (EWE),
 * Copyright (C) 2006-present eyeo GmbH
 *
 * EWE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * EWE is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EWE.  If not, see <http://www.gnu.org/licenses/>.
 */




const MAX_ERROR_THRESHOLD = 30;
const MAX_QUEUED_EVENTS = 20;
const EVENT_INTERVAL_MS = 100;

let errorCount = 0;
let eventProcessingInterval = null;
let eventProcessingInProgress = false;
let eventQueue = [];

function isEventTrusted(event) {
  return Object.getPrototypeOf(event) === CustomEvent.prototype &&
    !Object.hasOwnProperty.call(event, "detail");
}

async function allowlistDomain(event) {
  if (!isEventTrusted(event)) {
    return false;
  }

  return ignoreNoConnectionError(
    browser_polyfill.runtime.sendMessage({
      type: "ewe:allowlist-page",
      timestamp: event.detail.timestamp,
      signature: event.detail.signature,
      options: event.detail.options
    })
  );
}

async function processNextEvent() {
  if (eventProcessingInProgress) {
    return;
  }

  try {
    eventProcessingInProgress = true;
    let event = eventQueue.shift();
    if (event) {
      try {
        let allowlistingResult = await allowlistDomain(event);
        if (allowlistingResult === true) {
          document.dispatchEvent(new Event("domain_allowlisting_success"));
          stopOneClickAllowlisting();
        }
        else {
          throw new Error("Domain allowlisting rejected");
        }
      }
      catch (e) {
        errorCount++;
        if (errorCount >= MAX_ERROR_THRESHOLD) {
          stopOneClickAllowlisting();
        }
      }
    }

    if (!eventQueue.length) {
      stopProcessingInterval();
    }
  }
  finally {
    eventProcessingInProgress = false;
  }
}

function onDomainAllowlistingRequest(event) {
  if (eventQueue.length >= MAX_QUEUED_EVENTS) {
    return;
  }

  eventQueue.push(event);
  startProcessingInterval();
}

function startProcessingInterval() {
  if (!eventProcessingInterval) {
    processNextEvent();
    eventProcessingInterval = setInterval(processNextEvent, EVENT_INTERVAL_MS);
  }
}

function stopProcessingInterval() {
  clearInterval(eventProcessingInterval);
  eventProcessingInterval = null;
}

function stopOneClickAllowlisting() {
  document.removeEventListener("domain_allowlisting_request",
                               onDomainAllowlistingRequest, true);
  eventQueue = [];
  stopProcessingInterval();
}

function startOneClickAllowlisting() {
  document.addEventListener("domain_allowlisting_request",
                            onDomainAllowlistingRequest, true);
}

;// ./src/content/element-hiding-tracer.js
/*
 * This file is part of eyeo's Web Extension Ad Blocking Toolkit (EWE),
 * Copyright (C) 2006-present eyeo GmbH
 *
 * EWE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * EWE is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EWE.  If not, see <http://www.gnu.org/licenses/>.
 */




class ElementHidingTracer {
  constructor(selectors) {
    this.selectors = new Map(selectors);

    this.observer = new MutationObserver(() => {
      this.observer.disconnect();
      setTimeout(() => this.trace(), 1000);
    });

    if (document.readyState == "loading") {
      document.addEventListener("DOMContentLoaded", () => this.trace());
    }
    else {
      this.trace();
    }
  }

  log(filters, selectors = []) {
    ignoreNoConnectionError(browser_polyfill.runtime.sendMessage(
      {type: "ewe:trace-elem-hide", filters, selectors}
    ));
  }

  trace() {
    let filters = [];
    let selectors = [];

    for (let [selector, filter] of this.selectors) {
      try {
        if (document.querySelector(selector)) {
          this.selectors.delete(selector);
          if (filter) {
            filters.push(filter);
          }
          else {
            selectors.push(selector);
          }
        }
      }
      catch (e) {
        console.error(e.toString());
      }
    }

    if (filters.length > 0 || selectors.length > 0) {
      this.log(filters, selectors);
    }

    this.observer.observe(document, {childList: true,
                                     attributes: true,
                                     subtree: true});
  }

  disconnect() {
    this.observer.disconnect();
  }
}

;// ./src/content/subscribe-links.js
/*
 * This file is part of eyeo's Web Extension Ad Blocking Toolkit (EWE),
 * Copyright (C) 2006-present eyeo GmbH
 *
 * EWE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * EWE is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EWE.  If not, see <http://www.gnu.org/licenses/>.
 */




const ALLOWED_DOMAINS = new Set([
  "abpchina.org",
  "abpindo.blogspot.com",
  "abpvn.com",
  "adblock.ee",
  "adblock.gardar.net",
  "adblockplus.me",
  "adblockplus.org",
  "abptestpages.org",
  "commentcamarche.net",
  "droit-finances.commentcamarche.com",
  "easylist.to",
  "eyeo.com",
  "fanboy.co.nz",
  "filterlists.com",
  "forums.lanik.us",
  "gitee.com",
  "gitee.io",
  "github.com",
  "github.io",
  "gitlab.com",
  "gitlab.io",
  "gurud.ee",
  "hugolescargot.com",
  "i-dont-care-about-cookies.eu",
  "journaldesfemmes.fr",
  "journaldunet.com",
  "linternaute.com",
  "spam404.com",
  "stanev.org",
  "void.gr",
  "xfiles.noads.it",
  "zoso.ro"
]);

function isDomainAllowed(domain) {
  if (domain.endsWith(".")) {
    domain = domain.substring(0, domain.length - 1);
  }

  while (true) {
    if (ALLOWED_DOMAINS.has(domain)) {
      return true;
    }
    let index = domain.indexOf(".");
    if (index == -1) {
      return false;
    }
    domain = domain.substr(index + 1);
  }
}

function subscribeLinksEnabled(url) {
  let {protocol, hostname} = new URL(url);
  return hostname == "localhost" ||
    protocol == "https:" && isDomainAllowed(hostname);
}

function handleSubscribeLinks() {
  document.addEventListener("click", event => {
    if (event.button == 2 || !event.isTrusted) {
      return;
    }

    let link = event.target;
    while (!(link instanceof HTMLAnchorElement)) {
      link = link.parentNode;

      if (!link) {
        return;
      }
    }

    let queryString = null;
    if (link.protocol == "http:" || link.protocol == "https:") {
      if (link.host == "subscribe.adblockplus.org" && link.pathname == "/") {
        queryString = link.search.substr(1);
      }
    }
    else {
      // Firefox doesn't seem to populate the "search" property for
      // links with non-standard URL schemes so we need to extract the query
      // string manually.
      let match = /^abp:\/*subscribe\/*\?(.*)/i.exec(link.href);
      if (match) {
        queryString = match[1];
      }
    }

    if (!queryString) {
      return;
    }

    let title = null;
    let url = null;
    for (let param of queryString.split("&")) {
      let parts = param.split("=", 2);
      if (parts.length != 2 || !/\S/.test(parts[1])) {
        continue;
      }
      switch (parts[0]) {
        case "title":
          title = decodeURIComponent(parts[1]);
          break;
        case "location":
          url = decodeURIComponent(parts[1]);
          break;
      }
    }
    if (!url) {
      return;
    }

    if (!title) {
      title = url;
    }

    title = title.trim();
    url = url.trim();
    if (!/^(https?|ftp):/.test(url)) {
      return;
    }

    ignoreNoConnectionError(
      browser_polyfill.runtime.sendMessage({type: "ewe:subscribe-link-clicked",
                                   title, url})
    );

    event.preventDefault();
    event.stopPropagation();
  }, true);
}

;// ./src/content/cdp-session.js
/*
 * This file is part of eyeo's Web Extension Ad Blocking Toolkit (EWE),
 * Copyright (C) 2006-present eyeo GmbH
 *
 * EWE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * EWE is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EWE.  If not, see <http://www.gnu.org/licenses/>.
 */




let isActive = false;

function notifyActive() {
  if (isActive) {
    ignoreNoConnectionError(
      browser_polyfill.runtime.sendMessage({
        type: "ewe:cdp-session-active"
      })
    );
    isActive = false;
  }
  scheduleCheckActive();
}

function scheduleCheckActive() {
  setTimeout(notifyActive, 1000);
}

function markActive() {
  isActive = true;
}

function startNotifyActive() {
  scheduleCheckActive();

  document.addEventListener("scroll", markActive, true);
  document.addEventListener("click", markActive);
  document.addEventListener("keypress", markActive, true);
}

;// ./src/content/blockthrough-tag.js
/*
 * This file is part of eyeo's Web Extension Ad Blocking Toolkit (EWE),
 * Copyright (C) 2006-present eyeo GmbH
 *
 * EWE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * EWE is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EWE.  If not, see <http://www.gnu.org/licenses/>.
 */




function onBTAADetectionEvent(event) {
  let isAAPV = event.detail.ab && event.detail.acceptable;
  if (isAAPV) {
    ignoreNoConnectionError(
      browser_polyfill.runtime.sendMessage({
        type: "ewe:blockthrough-acceptable-ads-page-view"
      })
    );
  }
}

function startWatchingBlockthroughTag() {
  window.addEventListener("BTAADetection", onBTAADetectionEvent);
}

;// ./src/content/index.js
/*
 * This file is part of eyeo's Web Extension Ad Blocking Toolkit (EWE),
 * Copyright (C) 2006-present eyeo GmbH
 *
 * EWE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * EWE is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EWE.  If not, see <http://www.gnu.org/licenses/>.
 */













let tracer;
let content_elemHideEmulation;

async function initContentFeatures() {
  if (subscribeLinksEnabled(window.location.href)) {
    handleSubscribeLinks();
  }

  let response = await ignoreNoConnectionError(
    browser_polyfill.runtime.sendMessage({type: "ewe:content-hello"})
  );

  if (response) {
    await applyContentFeatures(response);
  }
}

async function removeContentFeatures() {
  if (tracer) {
    tracer.disconnect();
  }
}

async function applyContentFeatures(response) {
  if (response.tracedSelectors) {
    tracer = new ElementHidingTracer(response.tracedSelectors);
  }

  const hideElements = (elements, filters) => {
    for (let element of elements) {
      hideElement(element, response.cssProperties);
    }

    if (tracer) {
      tracer.log(filters);
    }
  };

  const unhideElements = elements => {
    for (let element of elements) {
      unhideElement(element);
    }
  };

  const removeElements = (elements, filters) => {
    for (const element of elements) {
      element.remove();
    }

    if (tracer) {
      tracer.log(filters);
    }
  };

  const applyInlineCSS = (elements, cssPatterns) => {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const pattern = cssPatterns[i];

      for (const [key, value] of Object.entries(pattern.css)) {
        element.style.setProperty(key, value, "important");
      }
    }

    if (tracer) {
      const filterTexts = cssPatterns.map(pattern => pattern.text);
      tracer.log(filterTexts);
    }
  };

  if (response.emulatedPatterns.length > 0) {
    if (!content_elemHideEmulation) {
      content_elemHideEmulation = new elemHideEmulation/* ElemHideEmulation */.WX(hideElements, unhideElements,
                                                removeElements, applyInlineCSS);
    }
    content_elemHideEmulation.apply(response.emulatedPatterns);
  }
  else if (content_elemHideEmulation) {
    content_elemHideEmulation.apply(response.emulatedPatterns);
  }

  if (response.notifyActive) {
    startNotifyActive();
  }
}

function onMessage(message) {
  if (typeof message == "object" && message != null &&
    message.type && message.type == "ewe:apply-content-features") {
    removeContentFeatures();
    applyContentFeatures(message);
  }
}
browser_polyfill.runtime.onMessage.addListener(onMessage);

startElementCollapsing();
startOneClickAllowlisting();
initContentFeatures();
startWatchingBlockthroughTag();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVMsa0NBQWtDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixnQkFBZ0IsVUFBVSxvQkFBb0I7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FB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NEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AZXllby93ZWJleHQtYWQtZmlsdGVyaW5nLXNvbHV0aW9uLy4vYWRibG9ja3BsdXNjb3JlL2xpYi9jb21tb24uanMiLCJ3ZWJwYWNrOi8vQGV5ZW8vd2ViZXh0LWFkLWZpbHRlcmluZy1zb2x1dGlvbi8uL2FkYmxvY2twbHVzY29yZS9saWIvY29udGVudC9lbGVtSGlkZUVtdWxhdGlvbi5qcyIsIndlYnBhY2s6Ly9AZXllby93ZWJleHQtYWQtZmlsdGVyaW5nLXNvbHV0aW9uLy4vYWRibG9ja3BsdXNjb3JlL2xpYi9wYXR0ZXJucy5qcyIsIndlYnBhY2s6Ly9AZXllby93ZWJleHQtYWQtZmlsdGVyaW5nLXNvbHV0aW9uLy4uLy4uL25vZGVfbW9kdWxlcy93ZWJleHRlbnNpb24tcG9seWZpbGwvZGlzdC9icm93c2VyLXBvbHlmaWxsLmpzIiwid2VicGFjazovL0BleWVvL3dlYmV4dC1hZC1maWx0ZXJpbmctc29sdXRpb24vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGV5ZW8vd2ViZXh0LWFkLWZpbHRlcmluZy1zb2x1dGlvbi8uL3NyYy9hbGwvZXJyb3JzLmpzIiwid2VicGFjazovL0BleWVvL3dlYmV4dC1hZC1maWx0ZXJpbmctc29sdXRpb24vLi9zcmMvY29udGVudC9lbGVtZW50LWNvbGxhcHNpbmcuanMiLCJ3ZWJwYWNrOi8vQGV5ZW8vd2ViZXh0LWFkLWZpbHRlcmluZy1zb2x1dGlvbi8uL3NyYy9jb250ZW50L2FsbG93bGlzdGluZy5qcyIsIndlYnBhY2s6Ly9AZXllby93ZWJleHQtYWQtZmlsdGVyaW5nLXNvbHV0aW9uLy4vc3JjL2NvbnRlbnQvZWxlbWVudC1oaWRpbmctdHJhY2VyLmpzIiwid2VicGFjazovL0BleWVvL3dlYmV4dC1hZC1maWx0ZXJpbmctc29sdXRpb24vLi9zcmMvY29udGVudC9zdWJzY3JpYmUtbGlua3MuanMiLCJ3ZWJwYWNrOi8vQGV5ZW8vd2ViZXh0LWFkLWZpbHRlcmluZy1zb2x1dGlvbi8uL3NyYy9jb250ZW50L2NkcC1zZXNzaW9uLmpzIiwid2VicGFjazovL0BleWVvL3dlYmV4dC1hZC1maWx0ZXJpbmctc29sdXRpb24vLi9zcmMvY29udGVudC9ibG9ja3Rocm91Z2gtdGFnLmpzIiwid2VicGFjazovL0BleWVvL3dlYmV4dC1hZC1maWx0ZXJpbmctc29sdXRpb24vLi9zcmMvY29udGVudC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgQWRibG9jayBQbHVzIDxodHRwczovL2FkYmxvY2twbHVzLm9yZy8+LFxuICogQ29weXJpZ2h0IChDKSAyMDA2LXByZXNlbnQgZXllbyBHbWJIXG4gKlxuICogQWRibG9jayBQbHVzIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzXG4gKiBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBBZGJsb2NrIFBsdXMgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEFkYmxvY2sgUGx1cy4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG4vKiogQG1vZHVsZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxubGV0IHRleHRUb1JlZ0V4cCA9XG4vKipcbiAqIENvbnZlcnRzIHJhdyB0ZXh0IGludG8gYSByZWd1bGFyIGV4cHJlc3Npb24gc3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCB0aGUgc3RyaW5nIHRvIGNvbnZlcnRcbiAqIEByZXR1cm4ge3N0cmluZ30gcmVndWxhciBleHByZXNzaW9uIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB0ZXh0XG4gKiBAcGFja2FnZVxuICovXG5leHBvcnRzLnRleHRUb1JlZ0V4cCA9IHRleHQgPT4gdGV4dC5yZXBsYWNlKC9bLS9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCBcIlxcXFwkJlwiKTtcblxuY29uc3QgcmVnZXhwUmVnZXhwID0gL15cXC8oLiopXFwvKFtpbXVdKikkLztcblxuLyoqXG4gKiBNYWtlIGEgcmVndWxhciBleHByZXNzaW9uIGZyb20gYSB0ZXh0IGFyZ3VtZW50LlxuICpcbiAqIElmIGl0IGNhbiBiZSBwYXJzZWQgYXMgYSByZWd1bGFyIGV4cHJlc3Npb24sIHBhcnNlIGl0IGFuZCB0aGUgZmxhZ3MuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgdGhlIHRleHQgYXJndW1lbnQuXG4gKlxuICogQHJldHVybiB7P1JlZ0V4cH0gYSBSZWdFeHAgb2JqZWN0IG9yIG51bGwgaW4gY2FzZSBvZiBlcnJvci5cbiAqL1xuZXhwb3J0cy5tYWtlUmVnRXhwUGFyYW1ldGVyID0gZnVuY3Rpb24gbWFrZVJlZ0V4cFBhcmFtZXRlcih0ZXh0KSB7XG4gIGxldCBbLCBzb3VyY2UsIGZsYWdzXSA9IHJlZ2V4cFJlZ2V4cC5leGVjKHRleHQpIHx8IFtudWxsLCB0ZXh0VG9SZWdFeHAodGV4dCldO1xuXG4gIHRyeSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoc291cmNlLCBmbGFncyk7XG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcblxubGV0IHNwbGl0U2VsZWN0b3IgPSBleHBvcnRzLnNwbGl0U2VsZWN0b3IgPSBmdW5jdGlvbiBzcGxpdFNlbGVjdG9yKHNlbGVjdG9yKSB7XG4gIGlmICghc2VsZWN0b3IuaW5jbHVkZXMoXCIsXCIpKSB7XG4gICAgcmV0dXJuIFtzZWxlY3Rvcl07XG4gIH1cblxuICBsZXQgc2VsZWN0b3JzID0gW107XG4gIGxldCBzdGFydCA9IDA7XG4gIGxldCBsZXZlbCA9IDA7XG4gIGxldCBzZXAgPSBcIlwiO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0b3IubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgY2hyID0gc2VsZWN0b3JbaV07XG5cbiAgICAvLyBpZ25vcmUgZXNjYXBlZCBjaGFyYWN0ZXJzXG4gICAgaWYgKGNociA9PSBcIlxcXFxcIikge1xuICAgICAgaSsrO1xuICAgIH1cbiAgICAvLyBkb24ndCBzcGxpdCB3aXRoaW4gcXVvdGVkIHRleHRcbiAgICBlbHNlIGlmIChjaHIgPT0gc2VwKSB7XG4gICAgICBzZXAgPSBcIlwiOyAgICAgICAgICAgICAvLyBlLmcuIFthdHRyPVwiLFwiXVxuICAgIH1cbiAgICBlbHNlIGlmIChzZXAgPT0gXCJcIikge1xuICAgICAgaWYgKGNociA9PSAnXCInIHx8IGNociA9PSBcIidcIikge1xuICAgICAgICBzZXAgPSBjaHI7XG4gICAgICB9XG4gICAgICAvLyBkb24ndCBzcGxpdCBiZXR3ZWVuIHBhcmVudGhlc2VzXG4gICAgICBlbHNlIGlmIChjaHIgPT0gXCIoXCIpIHtcbiAgICAgICAgbGV2ZWwrKzsgICAgICAgICAgICAvLyBlLmcuIDptYXRjaGVzKGRpdixzcGFuKVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoY2hyID09IFwiKVwiKSB7XG4gICAgICAgIGxldmVsID0gTWF0aC5tYXgoMCwgbGV2ZWwgLSAxKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGNociA9PSBcIixcIiAmJiBsZXZlbCA9PSAwKSB7XG4gICAgICAgIHNlbGVjdG9ycy5wdXNoKHNlbGVjdG9yLnN1YnN0cmluZyhzdGFydCwgaSkpO1xuICAgICAgICBzdGFydCA9IGkgKyAxO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNlbGVjdG9ycy5wdXNoKHNlbGVjdG9yLnN1YnN0cmluZyhzdGFydCkpO1xuICByZXR1cm4gc2VsZWN0b3JzO1xufTtcblxuZnVuY3Rpb24gZmluZFRhcmdldFNlbGVjdG9ySW5kZXgoc2VsZWN0b3IpIHtcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGV0IHdoaXRlc3BhY2UgPSAwO1xuICBsZXQgc2NvcGUgPSBbXTtcblxuICAvLyBTdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIHN0cmluZyBhbmQgZ28gY2hhcmFjdGVyIGJ5IGNoYXJhY3Rlciwgd2hlcmUgZWFjaFxuICAvLyBjaGFyYWN0ZXIgaXMgYSBVbmljb2RlIGNvZGUgcG9pbnQuXG4gIGZvciAobGV0IGNoYXJhY3RlciBvZiBbLi4uc2VsZWN0b3JdLnJldmVyc2UoKSkge1xuICAgIGxldCBjdXJyZW50U2NvcGUgPSBzY29wZVtzY29wZS5sZW5ndGggLSAxXTtcblxuICAgIGlmIChjaGFyYWN0ZXIgPT0gXCInXCIgfHwgY2hhcmFjdGVyID09IFwiXFxcIlwiKSB7XG4gICAgICAvLyBJZiB3ZSdyZSBhbHJlYWR5IHdpdGhpbiB0aGUgc2FtZSB0eXBlIG9mIHF1b3RlLCBjbG9zZSB0aGUgc2NvcGU7XG4gICAgICAvLyBvdGhlcndpc2Ugb3BlbiBhIG5ldyBzY29wZS5cbiAgICAgIGlmIChjdXJyZW50U2NvcGUgPT0gY2hhcmFjdGVyKSB7XG4gICAgICAgIHNjb3BlLnBvcCgpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHNjb3BlLnB1c2goY2hhcmFjdGVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoY2hhcmFjdGVyID09IFwiXVwiIHx8IGNoYXJhY3RlciA9PSBcIilcIikge1xuICAgICAgLy8gRm9yIGNsb3NpbmcgYnJhY2tldHMgYW5kIHBhcmVudGhlc2VzLCBvcGVuIGEgbmV3IHNjb3BlIG9ubHkgaWYgd2UncmVcbiAgICAgIC8vIG5vdCB3aXRoaW4gYSBxdW90ZS4gV2l0aGluIHF1b3RlcyB0aGVzZSBjaGFyYWN0ZXJzIHNob3VsZCBoYXZlIG5vXG4gICAgICAvLyBtZWFuaW5nLlxuICAgICAgaWYgKGN1cnJlbnRTY29wZSAhPSBcIidcIiAmJiBjdXJyZW50U2NvcGUgIT0gXCJcXFwiXCIpIHtcbiAgICAgICAgc2NvcGUucHVzaChjaGFyYWN0ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChjaGFyYWN0ZXIgPT0gXCJbXCIpIHtcbiAgICAgIC8vIElmIHdlJ3JlIGFscmVhZHkgd2l0aGluIGEgYnJhY2tldCwgY2xvc2UgdGhlIHNjb3BlLlxuICAgICAgaWYgKGN1cnJlbnRTY29wZSA9PSBcIl1cIikge1xuICAgICAgICBzY29wZS5wb3AoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoY2hhcmFjdGVyID09IFwiKFwiKSB7XG4gICAgICAvLyBJZiB3ZSdyZSBhbHJlYWR5IHdpdGhpbiBhIHBhcmVudGhlc2lzLCBjbG9zZSB0aGUgc2NvcGUuXG4gICAgICBpZiAoY3VycmVudFNjb3BlID09IFwiKVwiKSB7XG4gICAgICAgIHNjb3BlLnBvcCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICghY3VycmVudFNjb3BlKSB7XG4gICAgICAvLyBBdCB0aGUgdG9wIGxldmVsIChub3Qgd2l0aGluIGFueSBzY29wZSksIGNvdW50IHRoZSB3aGl0ZXNwYWNlIGlmIHdlJ3ZlXG4gICAgICAvLyBlbmNvdW50ZXJlZCBpdC4gT3RoZXJ3aXNlIGlmIHdlJ3ZlIGhpdCBvbmUgb2YgdGhlIGNvbWJpbmF0b3JzLFxuICAgICAgLy8gdGVybWluYXRlIGhlcmU7IG90aGVyd2lzZSBpZiB3ZSd2ZSBoaXQgYSBub24tY29sb24gY2hhcmFjdGVyLFxuICAgICAgLy8gdGVybWluYXRlIGhlcmUuXG4gICAgICBpZiAoL1xccy8udGVzdChjaGFyYWN0ZXIpKSB7XG4gICAgICAgIHdoaXRlc3BhY2UrKztcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKChjaGFyYWN0ZXIgPT0gXCI+XCIgfHwgY2hhcmFjdGVyID09IFwiK1wiIHx8IGNoYXJhY3RlciA9PSBcIn5cIikgfHxcbiAgICAgICAgICAgICAgICh3aGl0ZXNwYWNlID4gMCAmJiBjaGFyYWN0ZXIgIT0gXCI6XCIpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFplcm8gb3V0IHRoZSB3aGl0ZXNwYWNlIGNvdW50IGlmIHdlJ3ZlIGVudGVyZWQgYSBzY29wZS5cbiAgICBpZiAoc2NvcGUubGVuZ3RoID4gMCkge1xuICAgICAgd2hpdGVzcGFjZSA9IDA7XG4gICAgfVxuXG4gICAgLy8gSW5jcmVtZW50IHRoZSBpbmRleCBieSB0aGUgc2l6ZSBvZiB0aGUgY2hhcmFjdGVyLiBOb3RlIHRoYXQgZm9yIFVuaWNvZGVcbiAgICAvLyBjb21wb3NpdGUgY2hhcmFjdGVycyAobGlrZSBlbW9qaSkgdGhpcyB3aWxsIGJlIG1vcmUgdGhhbiBvbmUuXG4gICAgaW5kZXggKz0gY2hhcmFjdGVyLmxlbmd0aDtcbiAgfVxuXG4gIHJldHVybiBzZWxlY3Rvci5sZW5ndGggLSBpbmRleCArIHdoaXRlc3BhY2U7XG59XG5cbi8qKlxuICogUXVhbGlmaWVzIGEgQ1NTIHNlbGVjdG9yIHdpdGggYSBxdWFsaWZpZXIsIHdoaWNoIG1heSBiZSBhbm90aGVyIENTUyBzZWxlY3RvclxuICogb3IgYW4gZW1wdHkgc3RyaW5nLiBGb3IgZXhhbXBsZSwgZ2l2ZW4gdGhlIHNlbGVjdG9yIFwiZGl2LmJhclwiIGFuZCB0aGVcbiAqIHF1YWxpZmllciBcIiNmb29cIiwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIFwiZGl2I2Zvby5iYXJcIi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciBUaGUgc2VsZWN0b3IgdG8gcXVhbGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBxdWFsaWZpZXIgVGhlIHF1YWxpZmllciB3aXRoIHdoaWNoIHRvIHF1YWxpZnkgdGhlIHNlbGVjdG9yLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHF1YWxpZmllZCBzZWxlY3Rvci5cbiAqIEBwYWNrYWdlXG4gKi9cbmV4cG9ydHMucXVhbGlmeVNlbGVjdG9yID0gZnVuY3Rpb24gcXVhbGlmeVNlbGVjdG9yKHNlbGVjdG9yLCBxdWFsaWZpZXIpIHtcbiAgbGV0IHF1YWxpZmllZFNlbGVjdG9yID0gXCJcIjtcblxuICBsZXQgcXVhbGlmaWVyVGFyZ2V0U2VsZWN0b3JJbmRleCA9IGZpbmRUYXJnZXRTZWxlY3RvckluZGV4KHF1YWxpZmllcik7XG4gIGxldCBbLCBxdWFsaWZpZXJUeXBlID0gXCJcIl0gPVxuICAgIC9eKFthLXpdW2Etei1dKik/L2kuZXhlYyhxdWFsaWZpZXIuc3Vic3RyaW5nKHF1YWxpZmllclRhcmdldFNlbGVjdG9ySW5kZXgpKTtcblxuICBmb3IgKGxldCBzdWIgb2Ygc3BsaXRTZWxlY3RvcihzZWxlY3RvcikpIHtcbiAgICBzdWIgPSBzdWIudHJpbSgpO1xuXG4gICAgcXVhbGlmaWVkU2VsZWN0b3IgKz0gXCIsIFwiO1xuXG4gICAgbGV0IGluZGV4ID0gZmluZFRhcmdldFNlbGVjdG9ySW5kZXgoc3ViKTtcblxuICAgIC8vIE5vdGUgdGhhdCB0aGUgZmlyc3QgZ3JvdXAgaW4gdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBvcHRpb25hbC4gSWYgaXRcbiAgICAvLyBkb2Vzbid0IG1hdGNoIChlLmcuIFwiI2Zvbzo6bnRoLWNoaWxkKDEpXCIpLCB0eXBlIHdpbGwgYmUgYW4gZW1wdHkgc3RyaW5nLlxuICAgIGxldCBbLCB0eXBlID0gXCJcIiwgcmVzdF0gPVxuICAgICAgL14oW2Etel1bYS16LV0qKT9cXCo/KC4qKS9pLmV4ZWMoc3ViLnN1YnN0cmluZyhpbmRleCkpO1xuXG4gICAgaWYgKHR5cGUgPT0gcXVhbGlmaWVyVHlwZSkge1xuICAgICAgdHlwZSA9IFwiXCI7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHF1YWxpZmllciBlbmRzIGluIGEgY29tYmluYXRvciAoZS5nLiBcImJvZHkgI2Zvbz5cIiksIHdlIHB1dCB0aGVcbiAgICAvLyB0eXBlIGFuZCB0aGUgcmVzdCBvZiB0aGUgc2VsZWN0b3IgYWZ0ZXIgdGhlIHF1YWxpZmllclxuICAgIC8vIChlLmcuIFwiYm9keSAjZm9vPmRpdi5iYXJcIik7IG90aGVyd2lzZSAoZS5nLiBcImJvZHkgI2Zvb1wiKSB3ZSBtZXJnZSB0aGVcbiAgICAvLyB0eXBlIGludG8gdGhlIHF1YWxpZmllciAoZS5nLiBcImJvZHkgZGl2I2Zvby5iYXJcIikuXG4gICAgaWYgKC9bXFxzPit+XSQvLnRlc3QocXVhbGlmaWVyKSkge1xuICAgICAgcXVhbGlmaWVkU2VsZWN0b3IgKz0gc3ViLnN1YnN0cmluZygwLCBpbmRleCkgKyBxdWFsaWZpZXIgKyB0eXBlICsgcmVzdDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBxdWFsaWZpZWRTZWxlY3RvciArPSBzdWIuc3Vic3RyaW5nKDAsIGluZGV4KSArIHR5cGUgKyBxdWFsaWZpZXIgKyByZXN0O1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlbW92ZSB0aGUgaW5pdGlhbCBjb21tYSBhbmQgc3BhY2UuXG4gIHJldHVybiBxdWFsaWZpZWRTZWxlY3Rvci5zdWJzdHJpbmcoMik7XG59O1xuIiwiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEFkYmxvY2sgUGx1cyA8aHR0cHM6Ly9hZGJsb2NrcGx1cy5vcmcvPixcbiAqIENvcHlyaWdodCAoQykgMjAwNi1wcmVzZW50IGV5ZW8gR21iSFxuICpcbiAqIEFkYmxvY2sgUGx1cyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhc1xuICogcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24uXG4gKlxuICogQWRibG9jayBQbHVzIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBZGJsb2NrIFBsdXMuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuLyoqIEBtb2R1bGUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IHttYWtlUmVnRXhwUGFyYW1ldGVyLCBzcGxpdFNlbGVjdG9yLFxuICAgICAgIHF1YWxpZnlTZWxlY3Rvcn0gPSByZXF1aXJlKFwiLi4vY29tbW9uXCIpO1xuY29uc3Qge2ZpbHRlclRvUmVnRXhwfSA9IHJlcXVpcmUoXCIuLi9wYXR0ZXJuc1wiKTtcblxuY29uc3QgREVGQVVMVF9NSU5fSU5WT0NBVElPTl9JTlRFUlZBTCA9IDMwMDA7XG5sZXQgbWluSW52b2NhdGlvbkludGVydmFsID0gREVGQVVMVF9NSU5fSU5WT0NBVElPTl9JTlRFUlZBTDtcbmNvbnN0IERFRkFVTFRfTUFYX1NZQ0hST05PVVNfUFJPQ0VTU0lOR19USU1FID0gNTA7XG5sZXQgbWF4U3luY2hyb25vdXNQcm9jZXNzaW5nVGltZSA9IERFRkFVTFRfTUFYX1NZQ0hST05PVVNfUFJPQ0VTU0lOR19USU1FO1xuXG5jb25zdCBhYnBTZWxlY3RvclJlZ2V4cCA9IC86KC1hYnAtW1xcdy1dK3xoYXN8aGFzLXRleHR8eHBhdGh8bm90KVxcKC87XG5cbmxldCB0ZXN0SW5mbyA9IG51bGw7XG5cbmZ1bmN0aW9uIHRvQ1NTU3R5bGVEZWNsYXJhdGlvbih2YWx1ZSkge1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVzdFwiKSwge3N0eWxlOiB2YWx1ZX0pLnN0eWxlO1xufVxuXG4vKipcbiAqIEVuYWJsZXMgdGVzdCBtb2RlLCB3aGljaCB0cmFja3MgYWRkaXRpb25hbCBtZXRhZGF0YSBhYm91dCB0aGUgaW5uZXJcbiAqIHdvcmtpbmdzIGZvciB0ZXN0IHB1cnBvc2VzLiBUaGlzIGFsc28gYWxsb3dzIG92ZXJyaWRpbmcgaW50ZXJuYWxcbiAqIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7bnVtYmVyfSBvcHRpb25zLm1pbkludm9jYXRpb25JbnRlcnZhbCBPdmVycmlkZXMgaG93IGxvbmdcbiAqICAgbXVzdCBiZSB3YWl0ZWQgYmV0d2VlbiBmaWx0ZXIgcHJvY2Vzc2luZyBydW5zXG4gKiBAcGFyYW0ge251bWJlcn0gb3B0aW9ucy5tYXhTeW5jaHJvbm91c1Byb2Nlc3NpbmdUaW1lIE92ZXJyaWRlcyBob3dcbiAqICAgbG9uZyB0aGUgdGhyZWFkIG1heSBzcGVuZCBwcm9jZXNzaW5nIGZpbHRlcnMgYmVmb3JlIGl0IG11c3QgeWllbGRcbiAqICAgaXRzIHRocmVhZFxuICovXG5leHBvcnRzLnNldFRlc3RNb2RlID0gZnVuY3Rpb24gc2V0VGVzdE1vZGUob3B0aW9ucykge1xuICBpZiAodHlwZW9mIG9wdGlvbnMubWluSW52b2NhdGlvbkludGVydmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbWluSW52b2NhdGlvbkludGVydmFsID0gb3B0aW9ucy5taW5JbnZvY2F0aW9uSW50ZXJ2YWw7XG4gIH1cbiAgaWYgKHR5cGVvZiBvcHRpb25zLm1heFN5bmNocm9ub3VzUHJvY2Vzc2luZ1RpbWUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBtYXhTeW5jaHJvbm91c1Byb2Nlc3NpbmdUaW1lID0gb3B0aW9ucy5tYXhTeW5jaHJvbm91c1Byb2Nlc3NpbmdUaW1lO1xuICB9XG5cbiAgdGVzdEluZm8gPSB7XG4gICAgbGFzdFByb2Nlc3NlZEVsZW1lbnRzOiBuZXcgU2V0KCksXG4gICAgZmFpbGVkQXNzZXJ0aW9uczogW11cbiAgfTtcbn07XG5cbmV4cG9ydHMuZ2V0VGVzdEluZm8gPSBmdW5jdGlvbiBnZXRUZXN0SW5mbygpIHtcbiAgcmV0dXJuIHRlc3RJbmZvO1xufTtcblxuZXhwb3J0cy5jbGVhclRlc3RNb2RlID0gZnVuY3Rpb24oKSB7XG4gIG1pbkludm9jYXRpb25JbnRlcnZhbCA9IERFRkFVTFRfTUlOX0lOVk9DQVRJT05fSU5URVJWQUw7XG4gIG1heFN5bmNocm9ub3VzUHJvY2Vzc2luZ1RpbWUgPSBERUZBVUxUX01BWF9TWUNIUk9OT1VTX1BST0NFU1NJTkdfVElNRTtcbiAgdGVzdEluZm8gPSBudWxsO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IElkbGVEZWFkbGluZS5cbiAqXG4gKiBOb3RlOiBUaGlzIGZ1bmN0aW9uIGlzIHN5bmNocm9ub3VzIGFuZCBkb2VzIE5PVCByZXF1ZXN0IGFuIGlkbGVcbiAqIGNhbGxiYWNrLlxuICpcbiAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0lkbGVEZWFkbGluZX0uXG4gKiBAcmV0dXJuIHtJZGxlRGVhZGxpbmV9XG4gKi9cbmZ1bmN0aW9uIG5ld0lkbGVEZWFkbGluZSgpIHtcbiAgbGV0IHN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICByZXR1cm4ge1xuICAgIGRpZFRpbWVvdXQ6IGZhbHNlLFxuICAgIHRpbWVSZW1haW5pbmcoKSB7XG4gICAgICBsZXQgZWxhcHNlZCA9IHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnRUaW1lO1xuICAgICAgbGV0IHJlbWFpbmluZyA9IG1heFN5bmNocm9ub3VzUHJvY2Vzc2luZ1RpbWUgLSBlbGFwc2VkO1xuICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIHJlbWFpbmluZyk7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiB0aGUgYnJvd3NlciBpcyBuZXh0IGlkbGUuXG4gKlxuICogVGhpcyBpcyBpbnRlbmRlZCB0byBiZSB1c2VkIGZvciBsb25nIHJ1bm5pbmcgdGFza3Mgb24gdGhlIFVJIHRocmVhZFxuICogdG8gYWxsb3cgb3RoZXIgVUkgZXZlbnRzIHRvIHByb2Nlc3MuXG4gKlxuICogQHJldHVybiB7UHJvbWlzZS48SWRsZURlYWRsaW5lPn1cbiAqICAgIEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIHlvdSBjYW4gY29udGludWUgcHJvY2Vzc2luZ1xuICovXG5mdW5jdGlvbiB5aWVsZFRocmVhZCgpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVxdWVzdElkbGVDYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICByZXF1ZXN0SWRsZUNhbGxiYWNrKHJlc29sdmUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICByZXNvbHZlKG5ld0lkbGVEZWFkbGluZSgpKTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgfSk7XG59XG5cblxuZnVuY3Rpb24gZ2V0Q2FjaGVkUHJvcGVydHlWYWx1ZShvYmplY3QsIG5hbWUsIGRlZmF1bHRWYWx1ZUZ1bmMgPSAoKSA9PiB7fSkge1xuICBsZXQgdmFsdWUgPSBvYmplY3RbbmFtZV07XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHt2YWx1ZTogdmFsdWUgPSBkZWZhdWx0VmFsdWVGdW5jKCl9KTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbi8qKlxuICogUmV0dXJuIHBvc2l0aW9uIG9mIG5vZGUgZnJvbSBwYXJlbnQuXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgdGhlIG5vZGUgdG8gZmluZCB0aGUgcG9zaXRpb24gb2YuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IE9uZS1iYXNlZCBpbmRleCBsaWtlIGZvciA6bnRoLWNoaWxkKCksIG9yIDAgb24gZXJyb3IuXG4gKi9cbmZ1bmN0aW9uIHBvc2l0aW9uSW5QYXJlbnQobm9kZSkge1xuICBsZXQgaW5kZXggPSAwO1xuICBmb3IgKGxldCBjaGlsZCBvZiBub2RlLnBhcmVudE5vZGUuY2hpbGRyZW4pIHtcbiAgICBpZiAoY2hpbGQgPT0gbm9kZSkge1xuICAgICAgcmV0dXJuIGluZGV4ICsgMTtcbiAgICB9XG5cbiAgICBpbmRleCsrO1xuICB9XG5cbiAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIG1ha2VTZWxlY3Rvcihub2RlLCBzZWxlY3RvciA9IFwiXCIpIHtcbiAgaWYgKG5vZGUgPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmICghbm9kZS5wYXJlbnRFbGVtZW50KSB7XG4gICAgbGV0IG5ld1NlbGVjdG9yID0gXCI6cm9vdFwiO1xuICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgbmV3U2VsZWN0b3IgKz0gXCIgPiBcIiArIHNlbGVjdG9yO1xuICAgIH1cbiAgICByZXR1cm4gbmV3U2VsZWN0b3I7XG4gIH1cbiAgbGV0IGlkeCA9IHBvc2l0aW9uSW5QYXJlbnQobm9kZSk7XG4gIGlmIChpZHggPiAwKSB7XG4gICAgbGV0IG5ld1NlbGVjdG9yID0gYCR7bm9kZS50YWdOYW1lfTpudGgtY2hpbGQoJHtpZHh9KWA7XG4gICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICBuZXdTZWxlY3RvciArPSBcIiA+IFwiICsgc2VsZWN0b3I7XG4gICAgfVxuICAgIHJldHVybiBtYWtlU2VsZWN0b3Iobm9kZS5wYXJlbnRFbGVtZW50LCBuZXdTZWxlY3Rvcik7XG4gIH1cblxuICByZXR1cm4gc2VsZWN0b3I7XG59XG5cbmZ1bmN0aW9uIHBhcnNlU2VsZWN0b3JDb250ZW50KGNvbnRlbnQsIHN0YXJ0SW5kZXgpIHtcbiAgbGV0IHBhcmVucyA9IDE7XG4gIGxldCBxdW90ZSA9IG51bGw7XG4gIGxldCBpID0gc3RhcnRJbmRleDtcbiAgZm9yICg7IGkgPCBjb250ZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGMgPSBjb250ZW50W2ldO1xuICAgIGlmIChjID09IFwiXFxcXFwiKSB7XG4gICAgICAvLyBJZ25vcmUgZXNjYXBlZCBjaGFyYWN0ZXJzXG4gICAgICBpKys7XG4gICAgfVxuICAgIGVsc2UgaWYgKHF1b3RlKSB7XG4gICAgICBpZiAoYyA9PSBxdW90ZSkge1xuICAgICAgICBxdW90ZSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGMgPT0gXCInXCIgfHwgYyA9PSAnXCInKSB7XG4gICAgICBxdW90ZSA9IGM7XG4gICAgfVxuICAgIGVsc2UgaWYgKGMgPT0gXCIoXCIpIHtcbiAgICAgIHBhcmVucysrO1xuICAgIH1cbiAgICBlbHNlIGlmIChjID09IFwiKVwiKSB7XG4gICAgICBwYXJlbnMtLTtcbiAgICAgIGlmIChwYXJlbnMgPT0gMCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAocGFyZW5zID4gMCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB7dGV4dDogY29udGVudC5zdWJzdHJpbmcoc3RhcnRJbmRleCwgaSksIGVuZDogaX07XG59XG5cbi8qKlxuICogU3RyaW5naWZpZWQgc3R5bGUgb2JqZWN0c1xuICogQHR5cGVkZWYge09iamVjdH0gU3RyaW5naWZpZWRTdHlsZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IHN0eWxlIENTUyBzdHlsZSByZXByZXNlbnRlZCBieSBhIHN0cmluZy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nW119IHN1YlNlbGVjdG9ycyBzZWxlY3RvcnMgdGhlIENTUyBwcm9wZXJ0aWVzIGFwcGx5IHRvLlxuICovXG5cbi8qKlxuICogUHJvZHVjZSBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgc3R5bGVzaGVldCBlbnRyeS5cbiAqIEBwYXJhbSB7Q1NTU3R5bGVSdWxlfSBydWxlIHRoZSBDU1Mgc3R5bGUgcnVsZS5cbiAqIEByZXR1cm4ge1N0cmluZ2lmaWVkU3R5bGV9IHRoZSBzdHJpbmdpZmllZCBzdHlsZS5cbiAqL1xuZnVuY3Rpb24gc3RyaW5naWZ5U3R5bGUocnVsZSkge1xuICBsZXQgc3R5bGVzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcnVsZS5zdHlsZS5sZW5ndGg7IGkrKykge1xuICAgIGxldCBwcm9wZXJ0eSA9IHJ1bGUuc3R5bGUuaXRlbShpKTtcbiAgICBsZXQgdmFsdWUgPSBydWxlLnN0eWxlLmdldFByb3BlcnR5VmFsdWUocHJvcGVydHkpO1xuICAgIGxldCBwcmlvcml0eSA9IHJ1bGUuc3R5bGUuZ2V0UHJvcGVydHlQcmlvcml0eShwcm9wZXJ0eSk7XG4gICAgc3R5bGVzLnB1c2goYCR7cHJvcGVydHl9OiAke3ZhbHVlfSR7cHJpb3JpdHkgPyBcIiAhXCIgKyBwcmlvcml0eSA6IFwiXCJ9O2ApO1xuICB9XG4gIHN0eWxlcy5zb3J0KCk7XG4gIHJldHVybiB7XG4gICAgc3R5bGU6IHN0eWxlcy5qb2luKFwiIFwiKSxcbiAgICBzdWJTZWxlY3RvcnM6IHNwbGl0U2VsZWN0b3IocnVsZS5zZWxlY3RvclRleHQpXG4gIH07XG59XG5cbmxldCBzY29wZVN1cHBvcnRlZCA9IG51bGw7XG5cbmZ1bmN0aW9uIHRyeVF1ZXJ5U2VsZWN0b3Ioc3VidHJlZSwgc2VsZWN0b3IsIGFsbCkge1xuICBsZXQgZWxlbWVudHMgPSBudWxsO1xuICB0cnkge1xuICAgIGVsZW1lbnRzID0gYWxsID8gc3VidHJlZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSA6XG4gICAgICBzdWJ0cmVlLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgIHNjb3BlU3VwcG9ydGVkID0gdHJ1ZTtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIC8vIEVkZ2UgZG9lc24ndCBzdXBwb3J0IFwiOnNjb3BlXCJcbiAgICBzY29wZVN1cHBvcnRlZCA9IGZhbHNlO1xuICB9XG4gIHJldHVybiBlbGVtZW50cztcbn1cblxuLyoqXG4gKiBRdWVyeSBzZWxlY3Rvci5cbiAqXG4gKiBJZiBpdCBpcyByZWxhdGl2ZSwgd2lsbCB0cnkgOnNjb3BlLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gc3VidHJlZSB0aGUgZWxlbWVudCB0byBxdWVyeSBzZWxlY3RvclxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIHRoZSBzZWxlY3RvciB0byBxdWVyeVxuICogQHBhcmFtIHtib29sfSBbYWxsPWZhbHNlXSB0cnVlIHRvIHBlcmZvcm0gcXVlcnlTZWxlY3RvckFsbCgpXG4gKlxuICogQHJldHVybnMgez8oTm9kZXxOb2RlTGlzdCl9IHJlc3VsdCBvZiB0aGUgcXVlcnkuIG51bGwgaW4gY2FzZSBvZiBlcnJvci5cbiAqL1xuZnVuY3Rpb24gc2NvcGVkUXVlcnlTZWxlY3RvcihzdWJ0cmVlLCBzZWxlY3RvciwgYWxsKSB7XG4gIGlmIChzZWxlY3RvclswXSA9PSBcIj5cIikge1xuICAgIHNlbGVjdG9yID0gXCI6c2NvcGVcIiArIHNlbGVjdG9yO1xuICAgIGlmIChzY29wZVN1cHBvcnRlZCkge1xuICAgICAgcmV0dXJuIGFsbCA/IHN1YnRyZWUucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikgOlxuICAgICAgICBzdWJ0cmVlLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgIH1cbiAgICBpZiAoc2NvcGVTdXBwb3J0ZWQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRyeVF1ZXJ5U2VsZWN0b3Ioc3VidHJlZSwgc2VsZWN0b3IsIGFsbCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBhbGwgPyBzdWJ0cmVlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpIDpcbiAgICBzdWJ0cmVlLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xufVxuXG5mdW5jdGlvbiBzY29wZWRRdWVyeVNlbGVjdG9yQWxsKHN1YnRyZWUsIHNlbGVjdG9yKSB7XG4gIHJldHVybiBzY29wZWRRdWVyeVNlbGVjdG9yKHN1YnRyZWUsIHNlbGVjdG9yLCB0cnVlKTtcbn1cblxuY2xhc3MgUGxhaW5TZWxlY3RvciB7XG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yKSB7XG4gICAgdGhpcy5fc2VsZWN0b3IgPSBzZWxlY3RvcjtcbiAgICB0aGlzLm1heWJlRGVwZW5kc09uQXR0cmlidXRlcyA9IC9bIy46XXxcXFsuK1xcXS8udGVzdChzZWxlY3Rvcik7XG4gICAgdGhpcy5tYXliZUNvbnRhaW5zU2libGluZ0NvbWJpbmF0b3JzID0gL1t+K10vLnRlc3Qoc2VsZWN0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRvciBmdW5jdGlvbiByZXR1cm5pbmcgYSBwYWlyIG9mIHNlbGVjdG9yIHN0cmluZyBhbmQgc3VidHJlZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHByZWZpeCB0aGUgcHJlZml4IGZvciB0aGUgc2VsZWN0b3IuXG4gICAqIEBwYXJhbSB7Tm9kZX0gc3VidHJlZSB0aGUgc3VidHJlZSB3ZSB3b3JrIG9uLlxuICAgKiBAcGFyYW0ge05vZGVbXX0gW3RhcmdldHNdIHRoZSBub2RlcyB3ZSBhcmUgaW50ZXJlc3RlZCBpbi5cbiAgICovXG4gICpnZXRTZWxlY3RvcnMocHJlZml4LCBzdWJ0cmVlLCB0YXJnZXRzKSB7XG4gICAgeWllbGQgW3ByZWZpeCArIHRoaXMuX3NlbGVjdG9yLCBzdWJ0cmVlXTtcbiAgfVxufVxuXG5jb25zdCBpbmNvbXBsZXRlUHJlZml4UmVnZXhwID0gL1tcXHM+K35dJC87XG5cbmNsYXNzIE5vdFNlbGVjdG9yIHtcbiAgY29uc3RydWN0b3Ioc2VsZWN0b3JzKSB7XG4gICAgdGhpcy5faW5uZXJQYXR0ZXJuID0gbmV3IFBhdHRlcm4oc2VsZWN0b3JzKTtcbiAgfVxuXG4gIGdldCBkZXBlbmRzT25TdHlsZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lubmVyUGF0dGVybi5kZXBlbmRzT25TdHlsZXM7XG4gIH1cblxuICBnZXQgZGVwZW5kc09uQ2hhcmFjdGVyRGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5faW5uZXJQYXR0ZXJuLmRlcGVuZHNPbkNoYXJhY3RlckRhdGE7XG4gIH1cblxuICBnZXQgbWF5YmVEZXBlbmRzT25BdHRyaWJ1dGVzKCkge1xuICAgIHJldHVybiB0aGlzLl9pbm5lclBhdHRlcm4ubWF5YmVEZXBlbmRzT25BdHRyaWJ1dGVzO1xuICB9XG5cbiAgKmdldFNlbGVjdG9ycyhwcmVmaXgsIHN1YnRyZWUsIHRhcmdldHMpIHtcbiAgICBmb3IgKGxldCBlbGVtZW50IG9mIHRoaXMuZ2V0RWxlbWVudHMocHJlZml4LCBzdWJ0cmVlLCB0YXJnZXRzKSkge1xuICAgICAgeWllbGQgW21ha2VTZWxlY3RvcihlbGVtZW50KSwgZWxlbWVudF07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRvciBmdW5jdGlvbiByZXR1cm5pbmcgc2VsZWN0ZWQgZWxlbWVudHMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcmVmaXggdGhlIHByZWZpeCBmb3IgdGhlIHNlbGVjdG9yLlxuICAgKiBAcGFyYW0ge05vZGV9IHN1YnRyZWUgdGhlIHN1YnRyZWUgd2Ugd29yayBvbi5cbiAgICogQHBhcmFtIHtOb2RlW119IFt0YXJnZXRzXSB0aGUgbm9kZXMgd2UgYXJlIGludGVyZXN0ZWQgaW4uXG4gICAqL1xuICAqZ2V0RWxlbWVudHMocHJlZml4LCBzdWJ0cmVlLCB0YXJnZXRzKSB7XG4gICAgbGV0IGFjdHVhbFByZWZpeCA9ICghcHJlZml4IHx8IGluY29tcGxldGVQcmVmaXhSZWdleHAudGVzdChwcmVmaXgpKSA/XG4gICAgICBwcmVmaXggKyBcIipcIiA6IHByZWZpeDtcbiAgICBsZXQgZWxlbWVudHMgPSBzY29wZWRRdWVyeVNlbGVjdG9yQWxsKHN1YnRyZWUsIGFjdHVhbFByZWZpeCk7XG4gICAgaWYgKGVsZW1lbnRzKSB7XG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICAgIC8vIElmIHRoZSBlbGVtZW50IGlzIG5laXRoZXIgYW4gYW5jZXN0b3Igbm9yIGEgZGVzY2VuZGFudCBvZiBvbmUgb2YgdGhlXG4gICAgICAgIC8vIHRhcmdldHMsIHdlIGNhbiBza2lwIGl0LlxuICAgICAgICBpZiAodGFyZ2V0cyAmJiAhdGFyZ2V0cy5zb21lKHRhcmdldCA9PiBlbGVtZW50LmNvbnRhaW5zKHRhcmdldCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNvbnRhaW5zKGVsZW1lbnQpKSkge1xuICAgICAgICAgIHlpZWxkIG51bGw7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGVzdEluZm8pIHtcbiAgICAgICAgICB0ZXN0SW5mby5sYXN0UHJvY2Vzc2VkRWxlbWVudHMuYWRkKGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pbm5lclBhdHRlcm4ubWF0Y2hlcyhlbGVtZW50LCBzdWJ0cmVlKSkge1xuICAgICAgICAgIHlpZWxkIGVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICB5aWVsZCBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldFN0eWxlcyhzdHlsZXMpIHtcbiAgICB0aGlzLl9pbm5lclBhdHRlcm4uc2V0U3R5bGVzKHN0eWxlcyk7XG4gIH1cbn1cblxuY2xhc3MgSGFzU2VsZWN0b3Ige1xuICBjb25zdHJ1Y3RvcihzZWxlY3RvcnMpIHtcbiAgICB0aGlzLl9pbm5lclBhdHRlcm4gPSBuZXcgUGF0dGVybihzZWxlY3RvcnMpO1xuICB9XG5cbiAgZ2V0IGRlcGVuZHNPblN0eWxlcygpIHtcbiAgICByZXR1cm4gdGhpcy5faW5uZXJQYXR0ZXJuLmRlcGVuZHNPblN0eWxlcztcbiAgfVxuXG4gIGdldCBkZXBlbmRzT25DaGFyYWN0ZXJEYXRhKCkge1xuICAgIHJldHVybiB0aGlzLl9pbm5lclBhdHRlcm4uZGVwZW5kc09uQ2hhcmFjdGVyRGF0YTtcbiAgfVxuXG4gIGdldCBtYXliZURlcGVuZHNPbkF0dHJpYnV0ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lubmVyUGF0dGVybi5tYXliZURlcGVuZHNPbkF0dHJpYnV0ZXM7XG4gIH1cblxuICAqZ2V0U2VsZWN0b3JzKHByZWZpeCwgc3VidHJlZSwgdGFyZ2V0cykge1xuICAgIGZvciAobGV0IGVsZW1lbnQgb2YgdGhpcy5nZXRFbGVtZW50cyhwcmVmaXgsIHN1YnRyZWUsIHRhcmdldHMpKSB7XG4gICAgICB5aWVsZCBbbWFrZVNlbGVjdG9yKGVsZW1lbnQpLCBlbGVtZW50XTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdG9yIGZ1bmN0aW9uIHJldHVybmluZyBzZWxlY3RlZCBlbGVtZW50cy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHByZWZpeCB0aGUgcHJlZml4IGZvciB0aGUgc2VsZWN0b3IuXG4gICAqIEBwYXJhbSB7Tm9kZX0gc3VidHJlZSB0aGUgc3VidHJlZSB3ZSB3b3JrIG9uLlxuICAgKiBAcGFyYW0ge05vZGVbXX0gW3RhcmdldHNdIHRoZSBub2RlcyB3ZSBhcmUgaW50ZXJlc3RlZCBpbi5cbiAgICovXG4gICpnZXRFbGVtZW50cyhwcmVmaXgsIHN1YnRyZWUsIHRhcmdldHMpIHtcbiAgICBsZXQgYWN0dWFsUHJlZml4ID0gKCFwcmVmaXggfHwgaW5jb21wbGV0ZVByZWZpeFJlZ2V4cC50ZXN0KHByZWZpeCkpID9cbiAgICAgIHByZWZpeCArIFwiKlwiIDogcHJlZml4O1xuICAgIGxldCBlbGVtZW50cyA9IHNjb3BlZFF1ZXJ5U2VsZWN0b3JBbGwoc3VidHJlZSwgYWN0dWFsUHJlZml4KTtcbiAgICBpZiAoZWxlbWVudHMpIHtcbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICAgICAgLy8gSWYgdGhlIGVsZW1lbnQgaXMgbmVpdGhlciBhbiBhbmNlc3RvciBub3IgYSBkZXNjZW5kYW50IG9mIG9uZSBvZiB0aGVcbiAgICAgICAgLy8gdGFyZ2V0cywgd2UgY2FuIHNraXAgaXQuXG4gICAgICAgIGlmICh0YXJnZXRzICYmICF0YXJnZXRzLnNvbWUodGFyZ2V0ID0+IGVsZW1lbnQuY29udGFpbnModGFyZ2V0KSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuY29udGFpbnMoZWxlbWVudCkpKSB7XG4gICAgICAgICAgeWllbGQgbnVsbDtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0ZXN0SW5mbykge1xuICAgICAgICAgIHRlc3RJbmZvLmxhc3RQcm9jZXNzZWRFbGVtZW50cy5hZGQoZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBzZWxlY3RvciBvZiB0aGlzLl9pbm5lclBhdHRlcm4uZXZhbHVhdGUoZWxlbWVudCwgdGFyZ2V0cykpIHtcbiAgICAgICAgICBpZiAoc2VsZWN0b3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgeWllbGQgbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoc2NvcGVkUXVlcnlTZWxlY3RvcihlbGVtZW50LCBzZWxlY3RvcikpIHtcbiAgICAgICAgICAgIHlpZWxkIGVsZW1lbnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgeWllbGQgbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRTdHlsZXMoc3R5bGVzKSB7XG4gICAgdGhpcy5faW5uZXJQYXR0ZXJuLnNldFN0eWxlcyhzdHlsZXMpO1xuICB9XG59XG5cbmNsYXNzIFhQYXRoU2VsZWN0b3Ige1xuICBjb25zdHJ1Y3Rvcih0ZXh0Q29udGVudCkge1xuICAgIHRoaXMuZGVwZW5kc09uQ2hhcmFjdGVyRGF0YSA9IHRydWU7XG4gICAgdGhpcy5tYXliZURlcGVuZHNPbkF0dHJpYnV0ZXMgPSB0cnVlO1xuXG4gICAgbGV0IGV2YWx1YXRvciA9IG5ldyBYUGF0aEV2YWx1YXRvcigpO1xuICAgIHRoaXMuX2V4cHJlc3Npb24gPSBldmFsdWF0b3IuY3JlYXRlRXhwcmVzc2lvbih0ZXh0Q29udGVudCwgbnVsbCk7XG4gIH1cblxuICAqZ2V0U2VsZWN0b3JzKHByZWZpeCwgc3VidHJlZSwgdGFyZ2V0cykge1xuICAgIGZvciAobGV0IGVsZW1lbnQgb2YgdGhpcy5nZXRFbGVtZW50cyhwcmVmaXgsIHN1YnRyZWUsIHRhcmdldHMpKSB7XG4gICAgICB5aWVsZCBbbWFrZVNlbGVjdG9yKGVsZW1lbnQpLCBlbGVtZW50XTtcbiAgICB9XG4gIH1cblxuICAqZ2V0RWxlbWVudHMocHJlZml4LCBzdWJ0cmVlLCB0YXJnZXRzKSB7XG4gICAgbGV0IHtPUkRFUkVEX05PREVfU05BUFNIT1RfVFlQRTogZmxhZ30gPSBYUGF0aFJlc3VsdDtcbiAgICBsZXQgZWxlbWVudHMgPSBwcmVmaXggPyBzY29wZWRRdWVyeVNlbGVjdG9yQWxsKHN1YnRyZWUsIHByZWZpeCkgOiBbc3VidHJlZV07XG4gICAgZm9yIChsZXQgcGFyZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICBsZXQgcmVzdWx0ID0gdGhpcy5fZXhwcmVzc2lvbi5ldmFsdWF0ZShwYXJlbnQsIGZsYWcsIG51bGwpO1xuICAgICAgZm9yIChsZXQgaSA9IDAsIHtzbmFwc2hvdExlbmd0aH0gPSByZXN1bHQ7IGkgPCBzbmFwc2hvdExlbmd0aDsgaSsrKSB7XG4gICAgICAgIHlpZWxkIHJlc3VsdC5zbmFwc2hvdEl0ZW0oaSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIENvbnRhaW5zU2VsZWN0b3Ige1xuICBjb25zdHJ1Y3Rvcih0ZXh0Q29udGVudCkge1xuICAgIHRoaXMuZGVwZW5kc09uQ2hhcmFjdGVyRGF0YSA9IHRydWU7XG5cbiAgICB0aGlzLl9yZWdleHAgPSBtYWtlUmVnRXhwUGFyYW1ldGVyKHRleHRDb250ZW50KTtcbiAgfVxuXG4gICpnZXRTZWxlY3RvcnMocHJlZml4LCBzdWJ0cmVlLCB0YXJnZXRzKSB7XG4gICAgZm9yIChsZXQgZWxlbWVudCBvZiB0aGlzLmdldEVsZW1lbnRzKHByZWZpeCwgc3VidHJlZSwgdGFyZ2V0cykpIHtcbiAgICAgIHlpZWxkIFttYWtlU2VsZWN0b3IoZWxlbWVudCksIHN1YnRyZWVdO1xuICAgIH1cbiAgfVxuXG4gICpnZXRFbGVtZW50cyhwcmVmaXgsIHN1YnRyZWUsIHRhcmdldHMpIHtcbiAgICBsZXQgYWN0dWFsUHJlZml4ID0gKCFwcmVmaXggfHwgaW5jb21wbGV0ZVByZWZpeFJlZ2V4cC50ZXN0KHByZWZpeCkpID9cbiAgICAgIHByZWZpeCArIFwiKlwiIDogcHJlZml4O1xuXG4gICAgbGV0IGVsZW1lbnRzID0gc2NvcGVkUXVlcnlTZWxlY3RvckFsbChzdWJ0cmVlLCBhY3R1YWxQcmVmaXgpO1xuXG4gICAgaWYgKGVsZW1lbnRzKSB7XG4gICAgICBsZXQgbGFzdFJvb3QgPSBudWxsO1xuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBlbGVtZW50cykge1xuICAgICAgICAvLyBGb3IgYSBmaWx0ZXIgbGlrZSBkaXY6LWFicC1jb250YWlucyhIZWxsbykgYW5kIGEgc3VidHJlZSBsaWtlXG4gICAgICAgIC8vIDxkaXYgaWQ9XCJhXCI+PGRpdiBpZD1cImJcIj48ZGl2IGlkPVwiY1wiPkhlbGxvPC9kaXY+PC9kaXY+PC9kaXY+XG4gICAgICAgIC8vIHdlJ3JlIG9ubHkgaW50ZXJlc3RlZCBpbiBkaXYjYVxuICAgICAgICBpZiAobGFzdFJvb3QgJiYgbGFzdFJvb3QuY29udGFpbnMoZWxlbWVudCkpIHtcbiAgICAgICAgICB5aWVsZCBudWxsO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGFzdFJvb3QgPSBlbGVtZW50O1xuXG4gICAgICAgIGlmICh0YXJnZXRzICYmICF0YXJnZXRzLnNvbWUodGFyZ2V0ID0+IGVsZW1lbnQuY29udGFpbnModGFyZ2V0KSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuY29udGFpbnMoZWxlbWVudCkpKSB7XG4gICAgICAgICAgeWllbGQgbnVsbDtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0ZXN0SW5mbykge1xuICAgICAgICAgIHRlc3RJbmZvLmxhc3RQcm9jZXNzZWRFbGVtZW50cy5hZGQoZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fcmVnZXhwICYmIHRoaXMuX3JlZ2V4cC50ZXN0KGVsZW1lbnQudGV4dENvbnRlbnQpKSB7XG4gICAgICAgICAgeWllbGQgZWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB5aWVsZCBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFByb3BzU2VsZWN0b3Ige1xuICBjb25zdHJ1Y3Rvcihwcm9wZXJ0eUV4cHJlc3Npb24pIHtcbiAgICB0aGlzLmRlcGVuZHNPblN0eWxlcyA9IHRydWU7XG4gICAgdGhpcy5tYXliZURlcGVuZHNPbkF0dHJpYnV0ZXMgPSB0cnVlO1xuXG4gICAgbGV0IHJlZ2V4cFN0cmluZztcbiAgICBpZiAocHJvcGVydHlFeHByZXNzaW9uLmxlbmd0aCA+PSAyICYmIHByb3BlcnR5RXhwcmVzc2lvblswXSA9PSBcIi9cIiAmJlxuICAgICAgICBwcm9wZXJ0eUV4cHJlc3Npb25bcHJvcGVydHlFeHByZXNzaW9uLmxlbmd0aCAtIDFdID09IFwiL1wiKSB7XG4gICAgICByZWdleHBTdHJpbmcgPSBwcm9wZXJ0eUV4cHJlc3Npb24uc2xpY2UoMSwgLTEpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJlZ2V4cFN0cmluZyA9IGZpbHRlclRvUmVnRXhwKHByb3BlcnR5RXhwcmVzc2lvbik7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVnZXhwID0gbmV3IFJlZ0V4cChyZWdleHBTdHJpbmcsIFwiaVwiKTtcblxuICAgIHRoaXMuX3N1YlNlbGVjdG9ycyA9IFtdO1xuICB9XG5cbiAgKmdldFNlbGVjdG9ycyhwcmVmaXgsIHN1YnRyZWUsIHRhcmdldHMpIHtcbiAgICBmb3IgKGxldCBzdWJTZWxlY3RvciBvZiB0aGlzLl9zdWJTZWxlY3RvcnMpIHtcbiAgICAgIGlmIChzdWJTZWxlY3Rvci5zdGFydHNXaXRoKFwiKlwiKSAmJlxuICAgICAgICAgICFpbmNvbXBsZXRlUHJlZml4UmVnZXhwLnRlc3QocHJlZml4KSkge1xuICAgICAgICBzdWJTZWxlY3RvciA9IHN1YlNlbGVjdG9yLnN1YnN0cmluZygxKTtcbiAgICAgIH1cblxuICAgICAgeWllbGQgW3F1YWxpZnlTZWxlY3RvcihzdWJTZWxlY3RvciwgcHJlZml4KSwgc3VidHJlZV07XG4gICAgfVxuICB9XG5cbiAgc2V0U3R5bGVzKHN0eWxlcykge1xuICAgIHRoaXMuX3N1YlNlbGVjdG9ycyA9IFtdO1xuICAgIGZvciAobGV0IHN0eWxlIG9mIHN0eWxlcykge1xuICAgICAgaWYgKHRoaXMuX3JlZ2V4cC50ZXN0KHN0eWxlLnN0eWxlKSkge1xuICAgICAgICBmb3IgKGxldCBzdWJTZWxlY3RvciBvZiBzdHlsZS5zdWJTZWxlY3RvcnMpIHtcbiAgICAgICAgICBsZXQgaWR4ID0gc3ViU2VsZWN0b3IubGFzdEluZGV4T2YoXCI6OlwiKTtcbiAgICAgICAgICBpZiAoaWR4ICE9IC0xKSB7XG4gICAgICAgICAgICBzdWJTZWxlY3RvciA9IHN1YlNlbGVjdG9yLnN1YnN0cmluZygwLCBpZHgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX3N1YlNlbGVjdG9ycy5wdXNoKHN1YlNlbGVjdG9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBQYXR0ZXJuIHtcbiAgY29uc3RydWN0b3Ioc2VsZWN0b3JzLCB0ZXh0LCByZW1vdmUgPSBmYWxzZSwgY3NzID0gbnVsbCkge1xuICAgIHRoaXMuc2VsZWN0b3JzID0gc2VsZWN0b3JzO1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgdGhpcy5yZW1vdmUgPSByZW1vdmU7XG4gICAgdGhpcy5jc3MgPSBjc3M7XG4gIH1cblxuICBnZXQgZGVwZW5kc09uU3R5bGVzKCkge1xuICAgIHJldHVybiBnZXRDYWNoZWRQcm9wZXJ0eVZhbHVlKFxuICAgICAgdGhpcywgXCJfZGVwZW5kc09uU3R5bGVzXCIsICgpID0+IHRoaXMuc2VsZWN0b3JzLnNvbWUoXG4gICAgICAgIHNlbGVjdG9yID0+IHNlbGVjdG9yLmRlcGVuZHNPblN0eWxlc1xuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBnZXQgbWF5YmVEZXBlbmRzT25BdHRyaWJ1dGVzKCkge1xuICAgIC8vIE9ic2VydmUgY2hhbmdlcyB0byBhdHRyaWJ1dGVzIGlmIGVpdGhlciB0aGVyZSdzIGEgcGxhaW4gc2VsZWN0b3IgdGhhdFxuICAgIC8vIGxvb2tzIGxpa2UgYW4gSUQgc2VsZWN0b3IsIGNsYXNzIHNlbGVjdG9yLCBvciBhdHRyaWJ1dGUgc2VsZWN0b3IgaW4gb25lXG4gICAgLy8gb2YgdGhlIHBhdHRlcm5zIChlLmcuIFwiYVtocmVmPSdodHRwczovL2V4YW1wbGUuY29tLyddXCIpXG4gICAgLy8gb3IgdGhlcmUncyBhIHByb3BlcnRpZXMgc2VsZWN0b3IgbmVzdGVkIGluc2lkZSBhIGhhcyBzZWxlY3RvclxuICAgIC8vIChlLmcuIFwiZGl2Oi1hYnAtaGFzKDotYWJwLXByb3BlcnRpZXMoY29sb3I6IGJsdWUpKVwiKVxuICAgIHJldHVybiBnZXRDYWNoZWRQcm9wZXJ0eVZhbHVlKFxuICAgICAgdGhpcywgXCJfbWF5YmVEZXBlbmRzT25BdHRyaWJ1dGVzXCIsICgpID0+IHRoaXMuc2VsZWN0b3JzLnNvbWUoXG4gICAgICAgIHNlbGVjdG9yID0+IHNlbGVjdG9yLm1heWJlRGVwZW5kc09uQXR0cmlidXRlcyB8fFxuICAgICAgICAgICAgICAgICAgICAoc2VsZWN0b3IgaW5zdGFuY2VvZiBIYXNTZWxlY3RvciAmJlxuICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3IuZGVwZW5kc09uU3R5bGVzKVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBnZXQgZGVwZW5kc09uQ2hhcmFjdGVyRGF0YSgpIHtcbiAgICAvLyBPYnNlcnZlIGNoYW5nZXMgdG8gY2hhcmFjdGVyIGRhdGEgb25seSBpZiB0aGVyZSdzIGEgY29udGFpbnMgc2VsZWN0b3IgaW5cbiAgICAvLyBvbmUgb2YgdGhlIHBhdHRlcm5zLlxuICAgIHJldHVybiBnZXRDYWNoZWRQcm9wZXJ0eVZhbHVlKFxuICAgICAgdGhpcywgXCJfZGVwZW5kc09uQ2hhcmFjdGVyRGF0YVwiLCAoKSA9PiB0aGlzLnNlbGVjdG9ycy5zb21lKFxuICAgICAgICBzZWxlY3RvciA9PiBzZWxlY3Rvci5kZXBlbmRzT25DaGFyYWN0ZXJEYXRhXG4gICAgICApXG4gICAgKTtcbiAgfVxuXG4gIGdldCBtYXliZUNvbnRhaW5zU2libGluZ0NvbWJpbmF0b3JzKCkge1xuICAgIHJldHVybiBnZXRDYWNoZWRQcm9wZXJ0eVZhbHVlKFxuICAgICAgdGhpcywgXCJfbWF5YmVDb250YWluc1NpYmxpbmdDb21iaW5hdG9yc1wiLCAoKSA9PiB0aGlzLnNlbGVjdG9ycy5zb21lKFxuICAgICAgICBzZWxlY3RvciA9PiBzZWxlY3Rvci5tYXliZUNvbnRhaW5zU2libGluZ0NvbWJpbmF0b3JzXG4gICAgICApXG4gICAgKTtcbiAgfVxuXG4gIG1hdGNoZXNNdXRhdGlvblR5cGVzKG11dGF0aW9uVHlwZXMpIHtcbiAgICBsZXQgbXV0YXRpb25UeXBlTWF0Y2hNYXAgPSBnZXRDYWNoZWRQcm9wZXJ0eVZhbHVlKFxuICAgICAgdGhpcywgXCJfbXV0YXRpb25UeXBlTWF0Y2hNYXBcIiwgKCkgPT4gbmV3IE1hcChbXG4gICAgICAgIC8vIEFsbCB0eXBlcyBvZiBET00tZGVwZW5kZW50IHBhdHRlcm5zIGFyZSBhZmZlY3RlZCBieSBtdXRhdGlvbnMgb2ZcbiAgICAgICAgLy8gdHlwZSBcImNoaWxkTGlzdFwiLlxuICAgICAgICBbXCJjaGlsZExpc3RcIiwgdHJ1ZV0sXG4gICAgICAgIFtcImF0dHJpYnV0ZXNcIiwgdGhpcy5tYXliZURlcGVuZHNPbkF0dHJpYnV0ZXNdLFxuICAgICAgICBbXCJjaGFyYWN0ZXJEYXRhXCIsIHRoaXMuZGVwZW5kc09uQ2hhcmFjdGVyRGF0YV1cbiAgICAgIF0pXG4gICAgKTtcblxuICAgIGZvciAobGV0IG11dGF0aW9uVHlwZSBvZiBtdXRhdGlvblR5cGVzKSB7XG4gICAgICBpZiAobXV0YXRpb25UeXBlTWF0Y2hNYXAuZ2V0KG11dGF0aW9uVHlwZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRvciBmdW5jdGlvbiByZXR1cm5pbmcgQ1NTIHNlbGVjdG9ycyBmb3IgYWxsIGVsZW1lbnRzIHRoYXRcbiAgICogbWF0Y2ggdGhlIHBhdHRlcm4uXG4gICAqXG4gICAqIFRoaXMgYWxsb3dzIHRyYW5zZm9ybWluZyBmcm9tIHNlbGVjdG9ycyB0aGF0IG1heSBjb250YWluIGN1c3RvbVxuICAgKiA6LWFicC0gc2VsZWN0b3JzIHRvIHB1cmUgQ1NTIHNlbGVjdG9ycyB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlbGVjdFxuICAgKiBlbGVtZW50cy5cbiAgICpcbiAgICogVGhlIHNlbGVjdG9ycyByZXR1cm5lZCBmcm9tIHRoaXMgZnVuY3Rpb24gbWF5IGJlIGludmFsaWRhdGVkIGJ5IERPTVxuICAgKiBtdXRhdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7Tm9kZX0gc3VidHJlZSB0aGUgc3VidHJlZSB3ZSB3b3JrIG9uXG4gICAqIEBwYXJhbSB7Tm9kZVtdfSBbdGFyZ2V0c10gdGhlIG5vZGVzIHdlIGFyZSBpbnRlcmVzdGVkIGluLiBNYXkgYmVcbiAgICogdXNlZCB0byBvcHRpbWl6ZSBzZWFyY2guXG4gICAqL1xuICAqZXZhbHVhdGUoc3VidHJlZSwgdGFyZ2V0cykge1xuICAgIGxldCBzZWxlY3RvcnMgPSB0aGlzLnNlbGVjdG9ycztcbiAgICBmdW5jdGlvbiogZXZhbHVhdGVJbm5lcihpbmRleCwgcHJlZml4LCBjdXJyZW50U3VidHJlZSkge1xuICAgICAgaWYgKGluZGV4ID49IHNlbGVjdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgeWllbGQgcHJlZml4O1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBbc2VsZWN0b3IsIGVsZW1lbnRdIG9mIHNlbGVjdG9yc1tpbmRleF0uZ2V0U2VsZWN0b3JzKFxuICAgICAgICBwcmVmaXgsIGN1cnJlbnRTdWJ0cmVlLCB0YXJnZXRzXG4gICAgICApKSB7XG4gICAgICAgIGlmIChzZWxlY3RvciA9PSBudWxsKSB7XG4gICAgICAgICAgeWllbGQgbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB5aWVsZCogZXZhbHVhdGVJbm5lcihpbmRleCArIDEsIHNlbGVjdG9yLCBlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gSnVzdCBpbiBjYXNlIHRoZSBnZXRTZWxlY3RvcnMoKSBnZW5lcmF0b3IgYWJvdmUgaGFkIHRvIHJ1biBzb21lIGhlYXZ5XG4gICAgICAvLyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCkgY2FsbCB3aGljaCBkaWRuJ3QgcHJvZHVjZSBhbnkgcmVzdWx0cywgbWFrZVxuICAgICAgLy8gc3VyZSB0aGVyZSBpcyBhdCBsZWFzdCBvbmUgcG9pbnQgd2hlcmUgZXhlY3V0aW9uIGNhbiBwYXVzZS5cbiAgICAgIHlpZWxkIG51bGw7XG4gICAgfVxuICAgIHlpZWxkKiBldmFsdWF0ZUlubmVyKDAsIFwiXCIsIHN1YnRyZWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIHBhdHRlcm4gbWF0Y2hlcyBhIHNwZWNpZmljIGVsZW1lbnRcbiAgICogQHBhcmFtIHtOb2RlfSBbdGFyZ2V0XSB0aGUgZWxlbWVudCB3ZSdyZSBpbnRlcmVzdGVkIGluIGNoZWNraW5nIGZvclxuICAgKiBtYXRjaGVzIG9uLlxuICAgKiBAcGFyYW0ge05vZGV9IHN1YnRyZWUgdGhlIHN1YnRyZWUgd2Ugd29yayBvblxuICAgKiBAcmV0dXJuIHtib29sfVxuICAgKi9cbiAgbWF0Y2hlcyh0YXJnZXQsIHN1YnRyZWUpIHtcbiAgICBsZXQgdGFyZ2V0RmlsdGVyID0gW3RhcmdldF07XG4gICAgaWYgKHRoaXMubWF5YmVDb250YWluc1NpYmxpbmdDb21iaW5hdG9ycykge1xuICAgICAgdGFyZ2V0RmlsdGVyID0gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgc2VsZWN0b3JHZW5lcmF0b3IgPSB0aGlzLmV2YWx1YXRlKHN1YnRyZWUsIHRhcmdldEZpbHRlcik7XG4gICAgZm9yIChsZXQgc2VsZWN0b3Igb2Ygc2VsZWN0b3JHZW5lcmF0b3IpIHtcbiAgICAgIGlmIChzZWxlY3RvciAmJiB0YXJnZXQubWF0Y2hlcyhzZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNldFN0eWxlcyhzdHlsZXMpIHtcbiAgICBmb3IgKGxldCBzZWxlY3RvciBvZiB0aGlzLnNlbGVjdG9ycykge1xuICAgICAgaWYgKHNlbGVjdG9yLmRlcGVuZHNPblN0eWxlcykge1xuICAgICAgICBzZWxlY3Rvci5zZXRTdHlsZXMoc3R5bGVzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZXh0cmFjdE11dGF0aW9uVHlwZXMobXV0YXRpb25zKSB7XG4gIGxldCB0eXBlcyA9IG5ldyBTZXQoKTtcblxuICBmb3IgKGxldCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpIHtcbiAgICB0eXBlcy5hZGQobXV0YXRpb24udHlwZSk7XG5cbiAgICAvLyBUaGVyZSBhcmUgb25seSAzIHR5cGVzIG9mIG11dGF0aW9uczogXCJhdHRyaWJ1dGVzXCIsIFwiY2hhcmFjdGVyRGF0YVwiLCBhbmRcbiAgICAvLyBcImNoaWxkTGlzdFwiLlxuICAgIGlmICh0eXBlcy5zaXplID09IDMpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0eXBlcztcbn1cblxuZnVuY3Rpb24gZXh0cmFjdE11dGF0aW9uVGFyZ2V0cyhtdXRhdGlvbnMpIHtcbiAgaWYgKCFtdXRhdGlvbnMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCB0YXJnZXRzID0gbmV3IFNldCgpO1xuXG4gIGZvciAobGV0IG11dGF0aW9uIG9mIG11dGF0aW9ucykge1xuICAgIGlmIChtdXRhdGlvbi50eXBlID09IFwiY2hpbGRMaXN0XCIpIHtcbiAgICAgIC8vIFdoZW4gbmV3IG5vZGVzIGFyZSBhZGRlZCwgd2UncmUgaW50ZXJlc3RlZCBpbiB0aGUgYWRkZWQgbm9kZXMgcmF0aGVyXG4gICAgICAvLyB0aGFuIHRoZSBwYXJlbnQuXG4gICAgICBmb3IgKGxldCBub2RlIG9mIG11dGF0aW9uLmFkZGVkTm9kZXMpIHtcbiAgICAgICAgdGFyZ2V0cy5hZGQobm9kZSk7XG4gICAgICB9XG4gICAgICBpZiAobXV0YXRpb24ucmVtb3ZlZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGFyZ2V0cy5hZGQobXV0YXRpb24udGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0YXJnZXRzLmFkZChtdXRhdGlvbi50YXJnZXQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBbLi4udGFyZ2V0c107XG59XG5cbmZ1bmN0aW9uIGZpbHRlclBhdHRlcm5zKHBhdHRlcm5zLCB7c3R5bGVzaGVldHMsIG11dGF0aW9uc30pIHtcbiAgaWYgKCFzdHlsZXNoZWV0cyAmJiAhbXV0YXRpb25zKSB7XG4gICAgcmV0dXJuIHBhdHRlcm5zLnNsaWNlKCk7XG4gIH1cblxuICBsZXQgbXV0YXRpb25UeXBlcyA9IG11dGF0aW9ucyA/IGV4dHJhY3RNdXRhdGlvblR5cGVzKG11dGF0aW9ucykgOiBudWxsO1xuXG4gIHJldHVybiBwYXR0ZXJucy5maWx0ZXIoXG4gICAgcGF0dGVybiA9PiAoc3R5bGVzaGVldHMgJiYgcGF0dGVybi5kZXBlbmRzT25TdHlsZXMpIHx8XG4gICAgICAgICAgICAgICAobXV0YXRpb25zICYmIHBhdHRlcm4ubWF0Y2hlc011dGF0aW9uVHlwZXMobXV0YXRpb25UeXBlcykpXG4gICk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZE9ic2VydmVBdHRyaWJ1dGVzKHBhdHRlcm5zKSB7XG4gIHJldHVybiBwYXR0ZXJucy5zb21lKHBhdHRlcm4gPT4gcGF0dGVybi5tYXliZURlcGVuZHNPbkF0dHJpYnV0ZXMpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRPYnNlcnZlQ2hhcmFjdGVyRGF0YShwYXR0ZXJucykge1xuICByZXR1cm4gcGF0dGVybnMuc29tZShwYXR0ZXJuID0+IHBhdHRlcm4uZGVwZW5kc09uQ2hhcmFjdGVyRGF0YSk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZE9ic2VydmVTdHlsZXMocGF0dGVybnMpIHtcbiAgcmV0dXJuIHBhdHRlcm5zLnNvbWUocGF0dGVybiA9PiBwYXR0ZXJuLmRlcGVuZHNPblN0eWxlcyk7XG59XG5cbi8qKlxuICogQGNhbGxiYWNrIGhpZGVFbGVtc0Z1bmNcbiAqIEBwYXJhbSB7Tm9kZVtdfSBlbGVtZW50cyBFbGVtZW50cyBvbiB0aGUgcGFnZSB0aGF0IHNob3VsZCBiZSBoaWRkZW5cbiAqIEBwYXJhbSB7c3RyaW5nW119IGVsZW1lbnRGaWx0ZXJzXG4gKiAgIFRoZSBmaWx0ZXIgdGV4dCB0aGF0IGNhdXNlZCB0aGUgZWxlbWVudHMgdG8gYmUgaGlkZGVuXG4gKi9cblxuLyoqXG4gKiBAY2FsbGJhY2sgdW5oaWRlRWxlbXNGdW5jXG4gKiBAcGFyYW0ge05vZGVbXX0gZWxlbWVudHMgRWxlbWVudHMgb24gdGhlIHBhZ2UgdGhhdCBzaG91bGQgYmUgaGlkZGVuXG4gKi9cblxuLyoqXG4gKiBAY2FsbGJhY2sgcmVtb3ZlRWxlbXNGdW5jXG4gKiBAcGFyYW0ge05vZGVbXX0gZWxlbWVudHMgRWxlbWVudHMgb24gdGhlIHBhZ2UgdGhhdCBzaG91bGQgYmUgcmVtb3ZlZFxuICogQHBhcmFtIHtzdHJpbmdbXX0gZWxlbWVudEZpbHRlcnNcbiAqICAgVGhlIGZpbHRlciB0ZXh0IHRoYXQgY2F1c2VkIHRoZSBlbGVtZW50cyB0byBiZSByZW1vdmVkXG4gKiByZW1vdmVkIGZyb20gdGhlIERPTVxuICovXG5cbi8qKlxuICogQGNhbGxiYWNrIGNzc0VsZW1zRnVuY1xuICogQHBhcmFtIHtOb2RlW119IGVsZW1lbnRzIEVsZW1lbnRzIG9uIHRoZSBwYWdlIHRoYXQgc2hvdWxkXG4gKiBhcHBseSBpbmxpbmUgQ1NTIHJ1bGVzXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBjc3NQYXR0ZXJucyBUaGUgQ1NTIHBhdHRlcm5zIHRvIGJlIGFwcGxpZWRcbiAqL1xuXG5cbi8qKlxuICogTWFuYWdlcyB0aGUgZnJvbnQtZW5kIHByb2Nlc3Npbmcgb2YgZWxlbWVudCBoaWRpbmcgZW11bGF0aW9uIGZpbHRlcnMuXG4gKi9cbmV4cG9ydHMuRWxlbUhpZGVFbXVsYXRpb24gPSBjbGFzcyBFbGVtSGlkZUVtdWxhdGlvbiB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge21vZHVsZTpjb250ZW50L2VsZW1IaWRlRW11bGF0aW9ufmhpZGVFbGVtc0Z1bmN9IGhpZGVFbGVtc0Z1bmNcbiAgICogICBBIGNhbGxiYWNrIHRoYXQgc2hvdWxkIGJlIHByb3ZpZGVkIHRvIGRvIHRoZSBhY3R1YWwgZWxlbWVudCBoaWRpbmcuXG4gICAqIEBwYXJhbSB7bW9kdWxlOmNvbnRlbnQvZWxlbUhpZGVFbXVsYXRpb25+dW5oaWRlRWxlbXNGdW5jfSB1bmhpZGVFbGVtc0Z1bmNcbiAgICogICBBIGNhbGxiYWNrIHRoYXQgc2hvdWxkIGJlIHByb3ZpZGVkIHRvIHVuaGlkZSBwcmV2aW91c2x5IGhpZGRlbiBlbGVtZW50cy5cbiAgICogQHBhcmFtIHttb2R1bGU6Y29udGVudC9lbGVtSGlkZUVtdWxhdGlvbn5yZW1vdmVFbGVtc0Z1bmN9IHJlbW92ZUVsZW1zRnVuY1xuICAgKiAgIEEgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgcHJvdmlkZWQgdG8gcmVtb3ZlIGVsZW1lbnRzIGZyb20gdGhlIERPTS5cbiAgICogQHBhcmFtIHttb2R1bGU6Y29udGVudC9lbGVtSGlkZUVtdWxhdGlvbn5jc3NFbGVtc0Z1bmN9IGNzc0VsZW1zRnVuY1xuICAgKiAgIEEgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgcHJvdmlkZWQgdG8gYXBwbHkgaW5saW5lIENTUyBydWxlcyB0byBlbGVtZW50c1xuICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBoaWRlRWxlbXNGdW5jID0gKCkgPT4ge30sXG4gICAgdW5oaWRlRWxlbXNGdW5jID0gKCkgPT4ge30sXG4gICAgcmVtb3ZlRWxlbXNGdW5jID0gKCkgPT4ge30sXG4gICAgY3NzRWxlbXNGdW5jID0gKCkgPT4ge31cbiAgKSB7XG4gICAgdGhpcy5fZmlsdGVyaW5nSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgIHRoaXMuX25leHRGaWx0ZXJpbmdTY2hlZHVsZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9sYXN0SW52b2NhdGlvbiA9IC1taW5JbnZvY2F0aW9uSW50ZXJ2YWw7XG4gICAgdGhpcy5fc2NoZWR1bGVkUHJvY2Vzc2luZyA9IG51bGw7XG5cbiAgICB0aGlzLmRvY3VtZW50ID0gZG9jdW1lbnQ7XG4gICAgdGhpcy5oaWRlRWxlbXNGdW5jID0gaGlkZUVsZW1zRnVuYztcbiAgICB0aGlzLnVuaGlkZUVsZW1zRnVuYyA9IHVuaGlkZUVsZW1zRnVuYztcbiAgICB0aGlzLnJlbW92ZUVsZW1zRnVuYyA9IHJlbW92ZUVsZW1zRnVuYztcbiAgICB0aGlzLmNzc0VsZW1zRnVuYyA9IGNzc0VsZW1zRnVuYztcbiAgICB0aGlzLm9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5vYnNlcnZlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuaGlkZGVuRWxlbWVudHMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICBpc1NhbWVPcmlnaW4oc3R5bGVzaGVldCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gbmV3IFVSTChzdHlsZXNoZWV0LmhyZWYpLm9yaWdpbiA9PSB0aGlzLmRvY3VtZW50LmxvY2F0aW9uLm9yaWdpbjtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgIC8vIEludmFsaWQgVVJMLCBhc3N1bWUgdGhhdCBpdCBpcyBmaXJzdC1wYXJ0eS5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZSB0aGUgc2VsZWN0b3JcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIHRoZSBzZWxlY3RvciB0byBwYXJzZVxuICAgKiBAcmV0dXJuIHtBcnJheX0gc2VsZWN0b3JzIGlzIGFuIGFycmF5IG9mIG9iamVjdHMsXG4gICAqIG9yIG51bGwgaW4gY2FzZSBvZiBlcnJvcnMuXG4gICAqL1xuICBwYXJzZVNlbGVjdG9yKHNlbGVjdG9yKSB7XG4gICAgaWYgKHNlbGVjdG9yLmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgbGV0IG1hdGNoID0gYWJwU2VsZWN0b3JSZWdleHAuZXhlYyhzZWxlY3Rvcik7XG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgcmV0dXJuIFtuZXcgUGxhaW5TZWxlY3RvcihzZWxlY3RvcildO1xuICAgIH1cblxuICAgIGxldCBzZWxlY3RvcnMgPSBbXTtcbiAgICBpZiAobWF0Y2guaW5kZXggPiAwKSB7XG4gICAgICBzZWxlY3RvcnMucHVzaChuZXcgUGxhaW5TZWxlY3RvcihzZWxlY3Rvci5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpKSk7XG4gICAgfVxuXG4gICAgbGV0IHN0YXJ0SW5kZXggPSBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aDtcbiAgICBsZXQgY29udGVudCA9IHBhcnNlU2VsZWN0b3JDb250ZW50KHNlbGVjdG9yLCBzdGFydEluZGV4KTtcbiAgICBpZiAoIWNvbnRlbnQpIHtcbiAgICAgIGNvbnNvbGUud2FybihuZXcgU3ludGF4RXJyb3IoXCJGYWlsZWQgdG8gcGFyc2UgQWRibG9jayBQbHVzIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHNlbGVjdG9yICR7c2VsZWN0b3J9IGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImR1ZSB0byB1bm1hdGNoZWQgcGFyZW50aGVzZXMuXCIpKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChtYXRjaFsxXSA9PSBcIi1hYnAtcHJvcGVydGllc1wiKSB7XG4gICAgICBzZWxlY3RvcnMucHVzaChuZXcgUHJvcHNTZWxlY3Rvcihjb250ZW50LnRleHQpKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobWF0Y2hbMV0gPT0gXCItYWJwLWhhc1wiIHx8IG1hdGNoWzFdID09IFwiaGFzXCIpIHtcbiAgICAgIGxldCBoYXNTZWxlY3RvcnMgPSB0aGlzLnBhcnNlU2VsZWN0b3IoY29udGVudC50ZXh0KTtcbiAgICAgIGlmIChoYXNTZWxlY3RvcnMgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHNlbGVjdG9ycy5wdXNoKG5ldyBIYXNTZWxlY3RvcihoYXNTZWxlY3RvcnMpKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobWF0Y2hbMV0gPT0gXCItYWJwLWNvbnRhaW5zXCIgfHwgbWF0Y2hbMV0gPT0gXCJoYXMtdGV4dFwiKSB7XG4gICAgICBzZWxlY3RvcnMucHVzaChuZXcgQ29udGFpbnNTZWxlY3Rvcihjb250ZW50LnRleHQpKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobWF0Y2hbMV0gPT09IFwieHBhdGhcIikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2VsZWN0b3JzLnB1c2gobmV3IFhQYXRoU2VsZWN0b3IoY29udGVudC50ZXh0KSk7XG4gICAgICB9XG4gICAgICBjYXRjaCAoe21lc3NhZ2V9KSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBuZXcgU3ludGF4RXJyb3IoXG4gICAgICAgICAgICBcIkZhaWxlZCB0byBwYXJzZSBBZGJsb2NrIFBsdXMgXCIgK1xuICAgICAgICAgICAgYHNlbGVjdG9yICR7c2VsZWN0b3J9LCBpbnZhbGlkIGAgK1xuICAgICAgICAgICAgYHhwYXRoOiAke2NvbnRlbnQudGV4dH0gYCArXG4gICAgICAgICAgICBgZXJyb3I6ICR7bWVzc2FnZX0uYFxuICAgICAgICAgIClcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAobWF0Y2hbMV0gPT0gXCJub3RcIikge1xuICAgICAgbGV0IG5vdFNlbGVjdG9ycyA9IHRoaXMucGFyc2VTZWxlY3Rvcihjb250ZW50LnRleHQpO1xuICAgICAgaWYgKG5vdFNlbGVjdG9ycyA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiBhbGwgb2YgdGhlIGlubmVyIHNlbGVjdG9ycyBhcmUgUGxhaW5TZWxlY3RvcnMsIHRoZW4gd2VcbiAgICAgIC8vIGRvbid0IGFjdHVhbGx5IG5lZWQgdG8gdXNlIG91ciBzZWxlY3RvciBhdCBhbGwuIFdlJ3JlIGJldHRlclxuICAgICAgLy8gb2ZmIGRlbGVnYXRpbmcgdG8gdGhlIGJyb3dzZXIgOm5vdCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIGlmIChub3RTZWxlY3RvcnMuZXZlcnkocyA9PiBzIGluc3RhbmNlb2YgUGxhaW5TZWxlY3RvcikpIHtcbiAgICAgICAgc2VsZWN0b3JzLnB1c2gobmV3IFBsYWluU2VsZWN0b3IoYDpub3QoJHtjb250ZW50LnRleHR9KWApKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBzZWxlY3RvcnMucHVzaChuZXcgTm90U2VsZWN0b3Iobm90U2VsZWN0b3JzKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gdGhpcyBpcyBhbiBlcnJvciwgY2FuJ3QgcGFyc2Ugc2VsZWN0b3IuXG4gICAgICBjb25zb2xlLndhcm4obmV3IFN5bnRheEVycm9yKFwiRmFpbGVkIHRvIHBhcnNlIEFkYmxvY2sgUGx1cyBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBzZWxlY3RvciAke3NlbGVjdG9yfSwgaW52YWxpZCBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHBzZXVkby1jbGFzcyA6JHttYXRjaFsxXX0oKS5gKSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgc3VmZml4ID0gdGhpcy5wYXJzZVNlbGVjdG9yKHNlbGVjdG9yLnN1YnN0cmluZyhjb250ZW50LmVuZCArIDEpKTtcbiAgICBpZiAoc3VmZml4ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHNlbGVjdG9ycy5wdXNoKC4uLnN1ZmZpeCk7XG5cbiAgICBpZiAoc2VsZWN0b3JzLmxlbmd0aCA9PSAxICYmIHNlbGVjdG9yc1swXSBpbnN0YW5jZW9mIENvbnRhaW5zU2VsZWN0b3IpIHtcbiAgICAgIGNvbnNvbGUud2FybihuZXcgU3ludGF4RXJyb3IoXCJGYWlsZWQgdG8gcGFyc2UgQWRibG9jayBQbHVzIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHNlbGVjdG9yICR7c2VsZWN0b3J9LCBjYW4ndCBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoYXZlIGEgbG9uZWx5IDotYWJwLWNvbnRhaW5zKCkuXCIpKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3JzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlYWRzIHRoZSBydWxlcyBvdXQgb2YgQ1NTIHN0eWxlc2hlZXRzXG4gICAqIEBwYXJhbSB7Q1NTU3R5bGVTaGVldFtdfSBbc3R5bGVzaGVldHNdIFRoZSBsaXN0IG9mIHN0eWxlc2hlZXRzIHRvXG4gICAqIHJlYWQuXG4gICAqIEByZXR1cm4ge0NTU1N0eWxlUnVsZVtdfVxuICAgKi9cbiAgX3JlYWRDc3NSdWxlcyhzdHlsZXNoZWV0cykge1xuICAgIGxldCBjc3NTdHlsZXMgPSBbXTtcblxuICAgIGZvciAobGV0IHN0eWxlc2hlZXQgb2Ygc3R5bGVzaGVldHMgfHwgW10pIHtcbiAgICAgIC8vIEV4cGxpY2l0bHkgaWdub3JlIHRoaXJkLXBhcnR5IHN0eWxlc2hlZXRzIHRvIGVuc3VyZSBjb25zaXN0ZW50IGJlaGF2aW9yXG4gICAgICAvLyBiZXR3ZWVuIEZpcmVmb3ggYW5kIENocm9tZS5cbiAgICAgIGlmICghdGhpcy5pc1NhbWVPcmlnaW4oc3R5bGVzaGVldCkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBydWxlcztcbiAgICAgIHRyeSB7XG4gICAgICAgIHJ1bGVzID0gc3R5bGVzaGVldC5jc3NSdWxlcztcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vIE9uIEZpcmVmb3gsIHRoZXJlIGlzIGEgY2hhbmNlIHRoYXQgYW4gSW52YWxpZEFjY2Vzc0Vycm9yXG4gICAgICAgIC8vIGdldCB0aHJvd24gd2hlbiBhY2Nlc3NpbmcgY3NzUnVsZXMuIEp1c3Qgc2tpcCB0aGUgc3R5bGVzaGVldFxuICAgICAgICAvLyBpbiB0aGF0IGNhc2UuXG4gICAgICAgIC8vIFNlZSBodHRwczovL3NlYXJjaGZveC5vcmcvbW96aWxsYS1jZW50cmFsL3Jldi9mNjVkNzUyOGUzNGVmMWE3NjY1YjRhMWE3YjdjZGIxMzg4ZmNkM2FhL2xheW91dC9zdHlsZS9TdHlsZVNoZWV0LmNwcCM2OTlcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICghcnVsZXMpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IHJ1bGUgb2YgcnVsZXMpIHtcbiAgICAgICAgaWYgKHJ1bGUudHlwZSAhPSBydWxlLlNUWUxFX1JVTEUpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNzc1N0eWxlcy5wdXNoKHN0cmluZ2lmeVN0eWxlKHJ1bGUpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNzc1N0eWxlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9jZXNzZXMgdGhlIGN1cnJlbnQgZG9jdW1lbnQgYW5kIGFwcGxpZXMgYWxsIHJ1bGVzIHRvIGl0LlxuICAgKiBAcGFyYW0ge0NTU1N0eWxlU2hlZXRbXX0gW3N0eWxlc2hlZXRzXVxuICAgKiAgICBUaGUgbGlzdCBvZiBuZXcgc3R5bGVzaGVldHMgdGhhdCBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIGRvY3VtZW50IGFuZFxuICAgKiAgICBtYWRlIHJlcHJvY2Vzc2luZyBuZWNlc3NhcnkuIFRoaXMgcGFyYW1ldGVyIHNob3VsZG4ndCBiZSBwYXNzZWQgaW4gZm9yXG4gICAqICAgIHRoZSBpbml0aWFsIHByb2Nlc3NpbmcsIGFsbCBvZiBkb2N1bWVudCdzIHN0eWxlc2hlZXRzIHdpbGwgYmUgY29uc2lkZXJlZFxuICAgKiAgICB0aGVuIGFuZCBhbGwgcnVsZXMsIGluY2x1ZGluZyB0aGUgb25lcyBub3QgZGVwZW5kZW50IG9uIHN0eWxlcy5cbiAgICogQHBhcmFtIHtNdXRhdGlvblJlY29yZFtdfSBbbXV0YXRpb25zXVxuICAgKiAgICBUaGUgbGlzdCBvZiBET00gbXV0YXRpb25zIHRoYXQgaGF2ZSBiZWVuIGFwcGxpZWQgdG8gdGhlIGRvY3VtZW50IGFuZFxuICAgKiAgICBtYWRlIHJlcHJvY2Vzc2luZyBuZWNlc3NhcnkuIFRoaXMgcGFyYW1ldGVyIHNob3VsZG4ndCBiZSBwYXNzZWQgaW4gZm9yXG4gICAqICAgIHRoZSBpbml0aWFsIHByb2Nlc3NpbmcsIHRoZSBlbnRpcmUgZG9jdW1lbnQgd2lsbCBiZSBjb25zaWRlcmVkXG4gICAqICAgIHRoZW4gYW5kIGFsbCBydWxlcywgaW5jbHVkaW5nIHRoZSBvbmVzIG5vdCBkZXBlbmRlbnQgb24gdGhlIERPTS5cbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICogICAgQSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIG9uY2UgYWxsIGZpbHRlcmluZyBpcyBjb21wbGV0ZWRcbiAgICovXG4gIGFzeW5jIF9hZGRTZWxlY3RvcnMoc3R5bGVzaGVldHMsIG11dGF0aW9ucykge1xuICAgIGlmICh0ZXN0SW5mbykge1xuICAgICAgdGVzdEluZm8ubGFzdFByb2Nlc3NlZEVsZW1lbnRzLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgbGV0IGRlYWRsaW5lID0gbmV3SWRsZURlYWRsaW5lKCk7XG5cbiAgICBpZiAoc2hvdWxkT2JzZXJ2ZVN0eWxlcyh0aGlzLnBhdHRlcm5zKSkge1xuICAgICAgdGhpcy5fcmVmcmVzaFBhdHRlcm5TdHlsZXMoKTtcbiAgICB9XG5cbiAgICBsZXQgcGF0dGVybnNUb0NoZWNrID0gZmlsdGVyUGF0dGVybnMoXG4gICAgICB0aGlzLnBhdHRlcm5zLCB7c3R5bGVzaGVldHMsIG11dGF0aW9uc31cbiAgICApO1xuXG4gICAgbGV0IHRhcmdldHMgPSBleHRyYWN0TXV0YXRpb25UYXJnZXRzKG11dGF0aW9ucyk7XG5cbiAgICBjb25zdCBlbGVtZW50c1RvSGlkZSA9IFtdO1xuICAgIGNvbnN0IGVsZW1lbnRzVG9IaWRlRmlsdGVycyA9IFtdO1xuICAgIGNvbnN0IGVsZW1lbnRzVG9SZW1vdmVGaWx0ZXJzID0gW107XG4gICAgY29uc3QgZWxlbWVudHNUb1JlbW92ZSA9IFtdO1xuICAgIGNvbnN0IGVsZW1lbnRzVG9BcHBseUNTUyA9IFtdO1xuICAgIGNvbnN0IGNzc1BhdHRlcm5zID0gW107XG4gICAgbGV0IGVsZW1lbnRzVG9VbmhpZGUgPSBuZXcgU2V0KHRoaXMuaGlkZGVuRWxlbWVudHMua2V5cygpKTtcbiAgICBmb3IgKGxldCBwYXR0ZXJuIG9mIHBhdHRlcm5zVG9DaGVjaykge1xuICAgICAgbGV0IGV2YWx1YXRpb25UYXJnZXRzID0gdGFyZ2V0cztcblxuICAgICAgLy8gSWYgdGhlIHBhdHRlcm4gYXBwZWFycyB0byBjb250YWluIGFueSBzaWJsaW5nIGNvbWJpbmF0b3JzLCB3ZSBjYW4ndFxuICAgICAgLy8gZWFzaWx5IG9wdGltaXplIGJhc2VkIG9uIHRoZSBtdXRhdGlvbiB0YXJnZXRzLiBTaW5jZSB0aGlzIGlzIGFcbiAgICAgIC8vIHNwZWNpYWwgY2FzZSwgc2tpcCB0aGUgb3B0aW1pemF0aW9uLiBCeSBzZXR0aW5nIGl0IHRvIG51bGwgaGVyZSB3ZVxuICAgICAgLy8gbWFrZSBzdXJlIHdlIHByb2Nlc3MgdGhlIGVudGlyZSBET00uXG4gICAgICBpZiAocGF0dGVybi5tYXliZUNvbnRhaW5zU2libGluZ0NvbWJpbmF0b3JzKSB7XG4gICAgICAgIGV2YWx1YXRpb25UYXJnZXRzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgbGV0IGdlbmVyYXRvciA9IHBhdHRlcm4uZXZhbHVhdGUodGhpcy5kb2N1bWVudCwgZXZhbHVhdGlvblRhcmdldHMpO1xuICAgICAgZm9yIChsZXQgc2VsZWN0b3Igb2YgZ2VuZXJhdG9yKSB7XG4gICAgICAgIGlmIChzZWxlY3RvciAhPSBudWxsKSB7XG4gICAgICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiB0aGlzLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICBpZiAocGF0dGVybi5yZW1vdmUpIHtcbiAgICAgICAgICAgICAgZWxlbWVudHNUb1JlbW92ZS5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgICBlbGVtZW50c1RvUmVtb3ZlRmlsdGVycy5wdXNoKHBhdHRlcm4udGV4dCk7XG4gICAgICAgICAgICAgIGVsZW1lbnRzVG9VbmhpZGUuZGVsZXRlKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocGF0dGVybi5jc3MpIHtcbiAgICAgICAgICAgICAgZWxlbWVudHNUb0FwcGx5Q1NTLnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICAgIGNzc1BhdHRlcm5zLnB1c2gocGF0dGVybik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghdGhpcy5oaWRkZW5FbGVtZW50cy5oYXMoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgZWxlbWVudHNUb0hpZGUucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgICAgZWxlbWVudHNUb0hpZGVGaWx0ZXJzLnB1c2gocGF0dGVybi50ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBlbGVtZW50c1RvVW5oaWRlLmRlbGV0ZShlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGVhZGxpbmUudGltZVJlbWFpbmluZygpIDw9IDApIHtcbiAgICAgICAgICBkZWFkbGluZSA9IGF3YWl0IHlpZWxkVGhyZWFkKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fcmVtb3ZlRWxlbXMoZWxlbWVudHNUb1JlbW92ZSwgZWxlbWVudHNUb1JlbW92ZUZpbHRlcnMpO1xuICAgIHRoaXMuX2FwcGx5Q1NTVG9FbGVtcyhlbGVtZW50c1RvQXBwbHlDU1MsIGNzc1BhdHRlcm5zKTtcbiAgICB0aGlzLl9oaWRlRWxlbXMoZWxlbWVudHNUb0hpZGUsIGVsZW1lbnRzVG9IaWRlRmlsdGVycyk7XG5cbiAgICAvLyBUaGUgc2VhcmNoIGZvciBlbGVtZW50cyB0byBoaWRlIGl0IG9wdGltaXplZCB0byBmaW5kIG5ldyB0aGluZ3NcbiAgICAvLyB0byBoaWRlIHF1aWNrbHksIGJ5IG5vdCBjaGVja2luZyBhbGwgcGF0dGVybnMgYW5kIG5vdCBjaGVja2luZ1xuICAgIC8vIHRoZSBmdWxsIERPTS4gVGhhdCdzIHdoeSB3ZSBuZWVkIHRvIGRvIGEgbW9yZSB0aG9yb3VnaCBjaGVja1xuICAgIC8vIGZvciBlYWNoIHJlbWFpbmluZyBlbGVtZW50IHRoYXQgbWlnaHQgbmVlZCB0byBiZSB1bmhpZGRlbixcbiAgICAvLyBjaGVja2luZyBhbGwgcGF0dGVybnMuXG4gICAgZm9yIChsZXQgZWxlbSBvZiBlbGVtZW50c1RvVW5oaWRlKSB7XG4gICAgICBpZiAoIWVsZW0uaXNDb25uZWN0ZWQpIHtcbiAgICAgICAgLy8gZWxlbWVudHMgdGhhdCBhcmUgbm8gbG9uZ2VyIGluIHRoZSBET00gc2hvdWxkIGJlIHVuaGlkZGVuXG4gICAgICAgIC8vIGluIGNhc2UgdGhleSdyZSBldmVyIHJlYWRkZWQsIGFuZCB0aGVuIGZvcmdvdHRlbiBhYm91dCBzb1xuICAgICAgICAvLyB3ZSBkb24ndCBjYXVzZSBhIG1lbW9yeSBsZWFrLlxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGxldCBtYXRjaGVzQW55ID0gdGhpcy5wYXR0ZXJucy5zb21lKHBhdHRlcm4gPT4gcGF0dGVybi5tYXRjaGVzKFxuICAgICAgICBlbGVtLCB0aGlzLmRvY3VtZW50XG4gICAgICApKTtcbiAgICAgIGlmIChtYXRjaGVzQW55KSB7XG4gICAgICAgIGVsZW1lbnRzVG9VbmhpZGUuZGVsZXRlKGVsZW0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGVhZGxpbmUudGltZVJlbWFpbmluZygpIDw9IDApIHtcbiAgICAgICAgZGVhZGxpbmUgPSBhd2FpdCB5aWVsZFRocmVhZCgpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl91bmhpZGVFbGVtcyhBcnJheS5mcm9tKGVsZW1lbnRzVG9VbmhpZGUpKTtcbiAgfVxuXG4gIF9yZW1vdmVFbGVtcyhlbGVtZW50c1RvUmVtb3ZlLCBlbGVtZW50RmlsdGVycykge1xuICAgIGlmIChlbGVtZW50c1RvUmVtb3ZlLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucmVtb3ZlRWxlbXNGdW5jKGVsZW1lbnRzVG9SZW1vdmUsIGVsZW1lbnRGaWx0ZXJzKTtcbiAgICAgIGZvciAobGV0IGVsZW0gb2YgZWxlbWVudHNUb1JlbW92ZSkge1xuICAgICAgICAvLyB0aGV5J3JlIG5vdCBoaWRkZW4gYW55bW9yZSAoaWYgdGhleSBldmVyIHdlcmUpLCB0aGV5J3JlXG4gICAgICAgIC8vIHJlbW92ZWQuIFRoZXJlJ3Mgbm8gdW5oaWRpbmcgdGhlc2Ugb25lcyFcbiAgICAgICAgdGhpcy5oaWRkZW5FbGVtZW50cy5kZWxldGUoZWxlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2FwcGx5Q1NTVG9FbGVtcyhlbGVtZW50cywgY3NzUGF0dGVybnMpIHtcbiAgICBpZiAoZWxlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5jc3NFbGVtc0Z1bmMoZWxlbWVudHMsIGNzc1BhdHRlcm5zKTtcbiAgICB9XG4gIH1cblxuICBfaGlkZUVsZW1zKGVsZW1lbnRzVG9IaWRlLCBlbGVtZW50RmlsdGVycykge1xuICAgIGlmIChlbGVtZW50c1RvSGlkZS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmhpZGVFbGVtc0Z1bmMoZWxlbWVudHNUb0hpZGUsIGVsZW1lbnRGaWx0ZXJzKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudHNUb0hpZGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5oaWRkZW5FbGVtZW50cy5zZXQoZWxlbWVudHNUb0hpZGVbaV0sIGVsZW1lbnRGaWx0ZXJzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfdW5oaWRlRWxlbXMoZWxlbWVudHNUb1VuaGlkZSkge1xuICAgIGlmIChlbGVtZW50c1RvVW5oaWRlLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMudW5oaWRlRWxlbXNGdW5jKGVsZW1lbnRzVG9VbmhpZGUpO1xuICAgICAgZm9yIChsZXQgZWxlbSBvZiBlbGVtZW50c1RvVW5oaWRlKSB7XG4gICAgICAgIHRoaXMuaGlkZGVuRWxlbWVudHMuZGVsZXRlKGVsZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtZWQgYW55IHNjaGVkdWxlZCBwcm9jZXNzaW5nLlxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGFzeW5jcm9ub3VzLCBhbmQgc2hvdWxkIG5vdCBiZSBydW4gbXVsdGlwbGVcbiAgICogdGltZXMgaW4gcGFyYWxsZWwuIFRoZSBmbGFnIGBfZmlsdGVyaW5nSW5Qcm9ncmVzc2AgaXMgc2V0IGFuZFxuICAgKiB1bnNldCBzbyB5b3UgY2FuIGNoZWNrIGlmIGl0J3MgYWxyZWFkeSBydW5uaW5nLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKiAgQSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIG9uY2UgYWxsIGZpbHRlcmluZyBpcyBjb21wbGV0ZWRcbiAgICovXG4gIGFzeW5jIF9wcm9jZXNzRmlsdGVyaW5nKCkge1xuICAgIGlmICh0aGlzLl9maWx0ZXJpbmdJblByb2dyZXNzKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJFbGVtSGlkZUVtdWxhdGlvbiBzY2hlZHVsaW5nIGVycm9yOiBcIiArXG4gICAgICAgICAgICAgICAgICAgXCJUcmllZCB0byBwcm9jZXNzIGZpbHRlcmluZyBpbiBwYXJhbGxlbC5cIik7XG4gICAgICBpZiAodGVzdEluZm8pIHtcbiAgICAgICAgdGVzdEluZm8uZmFpbGVkQXNzZXJ0aW9ucy5wdXNoKFxuICAgICAgICAgIFwiVHJpZWQgdG8gcHJvY2VzcyBmaWx0ZXJpbmcgaW4gcGFyYWxsZWxcIlxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHBhcmFtcyA9IHRoaXMuX3NjaGVkdWxlZFByb2Nlc3NpbmcgfHwge307XG4gICAgdGhpcy5fc2NoZWR1bGVkUHJvY2Vzc2luZyA9IG51bGw7XG4gICAgdGhpcy5fZmlsdGVyaW5nSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgdGhpcy5fbmV4dEZpbHRlcmluZ1NjaGVkdWxlZCA9IGZhbHNlO1xuICAgIGF3YWl0IHRoaXMuX2FkZFNlbGVjdG9ycyhcbiAgICAgIHBhcmFtcy5zdHlsZXNoZWV0cyxcbiAgICAgIHBhcmFtcy5tdXRhdGlvbnNcbiAgICApO1xuICAgIHRoaXMuX2xhc3RJbnZvY2F0aW9uID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgdGhpcy5fZmlsdGVyaW5nSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgIGlmICh0aGlzLl9zY2hlZHVsZWRQcm9jZXNzaW5nKSB7XG4gICAgICB0aGlzLl9zY2hlZHVsZU5leHRGaWx0ZXJpbmcoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBuZXcgY2hhbmdlcyB0byB0aGUgbGlzdCBvZiBmaWx0ZXJzIGZvciB0aGUgbmV4dCB0aW1lXG4gICAqIGZpbHRlcmluZyBpcyBydW4uXG4gICAqIEBwYXJhbSB7Q1NTU3R5bGVTaGVldFtdfSBbc3R5bGVzaGVldHNdXG4gICAqICAgIG5ldyBzdHlsZXNoZWV0cyB0byBiZSBwcm9jZXNzZWQuIFRoaXMgcGFyYW1ldGVyIHNob3VsZCBiZSBvbWl0dGVkXG4gICAqICAgIGZvciBmdWxsIHJlcHJvY2Vzc2luZy5cbiAgICogQHBhcmFtIHtNdXRhdGlvblJlY29yZFtdfSBbbXV0YXRpb25zXVxuICAgKiAgICBuZXcgRE9NIG11dGF0aW9ucyB0byBiZSBwcm9jZXNzZWQuIFRoaXMgcGFyYW1ldGVyIHNob3VsZCBiZSBvbWl0dGVkXG4gICAqICAgIGZvciBmdWxsIHJlcHJvY2Vzc2luZy5cbiAgICovXG4gIF9hcHBlbmRTY2hlZHVsZWRQcm9jZXNzaW5nKHN0eWxlc2hlZXRzLCBtdXRhdGlvbnMpIHtcbiAgICBpZiAoIXRoaXMuX3NjaGVkdWxlZFByb2Nlc3NpbmcpIHtcbiAgICAgIC8vIFRoZXJlIGlzbid0IGFueXRoaW5nIHNjaGVkdWxlZCB5ZXQuIE1ha2UgdGhlIHNjaGVkdWxlLlxuICAgICAgdGhpcy5fc2NoZWR1bGVkUHJvY2Vzc2luZyA9IHtzdHlsZXNoZWV0cywgbXV0YXRpb25zfTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIXN0eWxlc2hlZXRzICYmICFtdXRhdGlvbnMpIHtcbiAgICAgIC8vIFRoZSBuZXcgcmVxdWVzdCB3YXMgdG8gcmVwcm9jZXNzIGV2ZXJ5dGhpbmcsIGFuZCBzbyBhbnlcbiAgICAgIC8vIHByZXZpb3VzIGZpbHRlcnMgYXJlIGlycmVsZXZhbnQuXG4gICAgICB0aGlzLl9zY2hlZHVsZWRQcm9jZXNzaW5nID0ge307XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMuX3NjaGVkdWxlZFByb2Nlc3Npbmcuc3R5bGVzaGVldHMgfHxcbiAgICAgICAgICAgICB0aGlzLl9zY2hlZHVsZWRQcm9jZXNzaW5nLm11dGF0aW9ucykge1xuICAgICAgLy8gVGhlIHByZXZpb3VzIGZpbHRlcnMgYXJlIG5vdCB0byBmaWx0ZXIgZXZlcnl0aGluZywgc28gdGhlIG5ld1xuICAgICAgLy8gcGFyYW1ldGVycyBtYXR0ZXIuIFB1c2ggdGhlbSBvbnRvIHRoZSBhcHByb3ByaWF0ZSBsaXN0cy5cbiAgICAgIGlmIChzdHlsZXNoZWV0cykge1xuICAgICAgICBpZiAoIXRoaXMuX3NjaGVkdWxlZFByb2Nlc3Npbmcuc3R5bGVzaGVldHMpIHtcbiAgICAgICAgICB0aGlzLl9zY2hlZHVsZWRQcm9jZXNzaW5nLnN0eWxlc2hlZXRzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2NoZWR1bGVkUHJvY2Vzc2luZy5zdHlsZXNoZWV0cy5wdXNoKC4uLnN0eWxlc2hlZXRzKTtcbiAgICAgIH1cbiAgICAgIGlmIChtdXRhdGlvbnMpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zY2hlZHVsZWRQcm9jZXNzaW5nLm11dGF0aW9ucykge1xuICAgICAgICAgIHRoaXMuX3NjaGVkdWxlZFByb2Nlc3NpbmcubXV0YXRpb25zID0gW107XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2NoZWR1bGVkUHJvY2Vzc2luZy5tdXRhdGlvbnMucHVzaCguLi5tdXRhdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIHRoaXMuX3NjaGVkdWxlZFByb2Nlc3NpbmcgaXMgYWxyZWFkeSBnb2luZyB0byByZWNoZWNrXG4gICAgICAvLyBldmVyeXRoaW5nLCBzbyBubyBuZWVkIHRvIGRvIGFueXRoaW5nIGhlcmUuXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNjaGVkdWxlIGZpbHRlcmluZyB0byBiZSBwcm9jZXNzZWQgaW4gdGhlIGZ1dHVyZSwgb3Igc3RhcnRcbiAgICogcHJvY2Vzc2luZyBpbW1lZGlhdGVseS5cbiAgICpcbiAgICogSWYgcHJvY2Vzc2luZyBpcyBhbHJlYWR5IHNjaGVkdWxlZCwgdGhpcyBkb2VzIG5vdGhpbmcuXG4gICAqL1xuICBfc2NoZWR1bGVOZXh0RmlsdGVyaW5nKCkge1xuICAgIGlmICh0aGlzLl9uZXh0RmlsdGVyaW5nU2NoZWR1bGVkIHx8IHRoaXMuX2ZpbHRlcmluZ0luUHJvZ3Jlc3MpIHtcbiAgICAgIC8vIFRoZSBuZXh0IG9uZSBoYXMgYWxyZWFkeSBiZWVuIHNjaGVkdWxlZC4gT3VyIG5ldyBldmVudHMgYXJlXG4gICAgICAvLyBvbiB0aGUgcXVldWUsIHNvIG5vdGhpbmcgbW9yZSB0byBkby5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImxvYWRpbmdcIikge1xuICAgICAgLy8gRG9jdW1lbnQgaXNuJ3QgZnVsbHkgbG9hZGVkIHlldCwgc28gc2NoZWR1bGUgb3VyIGZpcnN0XG4gICAgICAvLyBmaWx0ZXJpbmcgYXMgc29vbiBhcyB0aGF0J3MgZG9uZS5cbiAgICAgIHRoaXMuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJET01Db250ZW50TG9hZGVkXCIsXG4gICAgICAgICgpID0+IHRoaXMuX3Byb2Nlc3NGaWx0ZXJpbmcoKSxcbiAgICAgICAge29uY2U6IHRydWV9XG4gICAgICApO1xuICAgICAgdGhpcy5fbmV4dEZpbHRlcmluZ1NjaGVkdWxlZCA9IHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKHBlcmZvcm1hbmNlLm5vdygpIC0gdGhpcy5fbGFzdEludm9jYXRpb24gPFxuICAgICAgICAgICAgIG1pbkludm9jYXRpb25JbnRlcnZhbCkge1xuICAgICAgLy8gSXQgaGFzbid0IGJlZW4gbG9uZyBlbm91Z2ggc2luY2Ugb3VyIGxhc3QgZmlsdGVyLiBTZXQgdGhlXG4gICAgICAvLyB0aW1lb3V0IGZvciB3aGVuIGl0J3MgdGltZSBmb3IgdGhhdC5cbiAgICAgIHNldFRpbWVvdXQoXG4gICAgICAgICgpID0+IHRoaXMuX3Byb2Nlc3NGaWx0ZXJpbmcoKSxcbiAgICAgICAgbWluSW52b2NhdGlvbkludGVydmFsIC0gKHBlcmZvcm1hbmNlLm5vdygpIC0gdGhpcy5fbGFzdEludm9jYXRpb24pXG4gICAgICApO1xuICAgICAgdGhpcy5fbmV4dEZpbHRlcmluZ1NjaGVkdWxlZCA9IHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gV2UgY2FuIGFjdHVhbGx5IGp1c3Qgc3RhcnQgZmlsdGVyaW5nIGltbWVkaWF0ZWx5IVxuICAgICAgdGhpcy5fcHJvY2Vzc0ZpbHRlcmluZygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZS1ydW4gZmlsdGVyaW5nIGVpdGhlciBpbW1lZGlhdGVseSBvciBxdWV1ZWQuXG4gICAqIEBwYXJhbSB7Q1NTU3R5bGVTaGVldFtdfSBbc3R5bGVzaGVldHNdXG4gICAqICAgIG5ldyBzdHlsZXNoZWV0cyB0byBiZSBwcm9jZXNzZWQuIFRoaXMgcGFyYW1ldGVyIHNob3VsZCBiZSBvbWl0dGVkXG4gICAqICAgIGZvciBmdWxsIHJlcHJvY2Vzc2luZy5cbiAgICogQHBhcmFtIHtNdXRhdGlvblJlY29yZFtdfSBbbXV0YXRpb25zXVxuICAgKiAgICBuZXcgRE9NIG11dGF0aW9ucyB0byBiZSBwcm9jZXNzZWQuIFRoaXMgcGFyYW1ldGVyIHNob3VsZCBiZSBvbWl0dGVkXG4gICAqICAgIGZvciBmdWxsIHJlcHJvY2Vzc2luZy5cbiAgICovXG4gIHF1ZXVlRmlsdGVyaW5nKHN0eWxlc2hlZXRzLCBtdXRhdGlvbnMpIHtcbiAgICB0aGlzLl9hcHBlbmRTY2hlZHVsZWRQcm9jZXNzaW5nKHN0eWxlc2hlZXRzLCBtdXRhdGlvbnMpO1xuICAgIHRoaXMuX3NjaGVkdWxlTmV4dEZpbHRlcmluZygpO1xuICB9XG5cbiAgX3JlZnJlc2hQYXR0ZXJuU3R5bGVzKHN0eWxlc2hlZXQpIHtcbiAgICBsZXQgYWxsQ3NzUnVsZXMgPSB0aGlzLl9yZWFkQ3NzUnVsZXModGhpcy5kb2N1bWVudC5zdHlsZVNoZWV0cyk7XG4gICAgZm9yIChsZXQgcGF0dGVybiBvZiB0aGlzLnBhdHRlcm5zKSB7XG4gICAgICBwYXR0ZXJuLnNldFN0eWxlcyhhbGxDc3NSdWxlcyk7XG4gICAgfVxuICB9XG5cbiAgb25Mb2FkKGV2ZW50KSB7XG4gICAgbGV0IHN0eWxlc2hlZXQgPSBldmVudC50YXJnZXQuc2hlZXQ7XG4gICAgaWYgKHN0eWxlc2hlZXQpIHtcbiAgICAgIHRoaXMucXVldWVGaWx0ZXJpbmcoW3N0eWxlc2hlZXRdKTtcbiAgICB9XG4gIH1cblxuICBvYnNlcnZlKG11dGF0aW9ucykge1xuICAgIGlmICh0ZXN0SW5mbykge1xuICAgICAgLy8gSW4gdGVzdCBtb2RlLCBmaWx0ZXIgb3V0IGFueSBtdXRhdGlvbnMgbGlrZWx5IGRvbmUgYnkgdXNcbiAgICAgIC8vIChpLmUuIHN0eWxlPVwiZGlzcGxheTogbm9uZSAhaW1wb3J0YW50XCIpLiBUaGlzIG1ha2VzIGl0IGVhc2llciB0b1xuICAgICAgLy8gb2JzZXJ2ZSBob3cgdGhlIGNvZGUgcmVzcG9uZHMgdG8gRE9NIG11dGF0aW9ucy5cbiAgICAgIG11dGF0aW9ucyA9IG11dGF0aW9ucy5maWx0ZXIoXG4gICAgICAgICh7dHlwZSwgYXR0cmlidXRlTmFtZSwgdGFyZ2V0OiB7c3R5bGU6IG5ld1ZhbHVlfSwgb2xkVmFsdWV9KSA9PlxuICAgICAgICAgICEodHlwZSA9PSBcImF0dHJpYnV0ZXNcIiAmJiBhdHRyaWJ1dGVOYW1lID09IFwic3R5bGVcIiAmJlxuICAgICAgICAgICAgbmV3VmFsdWUuZGlzcGxheSA9PSBcIm5vbmVcIiAmJlxuICAgICAgICAgICAgdG9DU1NTdHlsZURlY2xhcmF0aW9uKG9sZFZhbHVlKS5kaXNwbGF5ICE9IFwibm9uZVwiKVxuICAgICAgKTtcblxuICAgICAgaWYgKG11dGF0aW9ucy5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5xdWV1ZUZpbHRlcmluZyhudWxsLCBtdXRhdGlvbnMpO1xuICB9XG5cbiAgYXBwbHkocGF0dGVybnMpIHtcbiAgICBpZiAodGhpcy5wYXR0ZXJucykge1xuICAgICAgbGV0IHJlbW92ZWRQYXR0ZXJucyA9IFtdO1xuICAgICAgZm9yIChsZXQgb2xkUGF0dGVybiBvZiB0aGlzLnBhdHRlcm5zKSB7XG4gICAgICAgIGlmICghcGF0dGVybnMuZmluZChuZXdQYXR0ZXJuID0+IG5ld1BhdHRlcm4udGV4dCA9PSBvbGRQYXR0ZXJuLnRleHQpKSB7XG4gICAgICAgICAgcmVtb3ZlZFBhdHRlcm5zLnB1c2gob2xkUGF0dGVybik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBlbGVtZW50c1RvVW5oaWRlID0gW107XG4gICAgICBmb3IgKGxldCBwYXR0ZXJuIG9mIHJlbW92ZWRQYXR0ZXJucykge1xuICAgICAgICBmb3IgKGxldCBbZWxlbWVudCwgZmlsdGVyXSBvZiB0aGlzLmhpZGRlbkVsZW1lbnRzKSB7XG4gICAgICAgICAgaWYgKGZpbHRlciA9PSBwYXR0ZXJuLnRleHQpIHtcbiAgICAgICAgICAgIGVsZW1lbnRzVG9VbmhpZGUucHVzaChlbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChlbGVtZW50c1RvVW5oaWRlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5fdW5oaWRlRWxlbXMoZWxlbWVudHNUb1VuaGlkZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wYXR0ZXJucyA9IFtdO1xuICAgIGZvciAobGV0IHBhdHRlcm4gb2YgcGF0dGVybnMpIHtcbiAgICAgIGxldCBzZWxlY3RvcnMgPSB0aGlzLnBhcnNlU2VsZWN0b3IocGF0dGVybi5zZWxlY3Rvcik7XG4gICAgICBpZiAoc2VsZWN0b3JzICE9IG51bGwgJiYgc2VsZWN0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5wYXR0ZXJucy5wdXNoKFxuICAgICAgICAgIG5ldyBQYXR0ZXJuKHNlbGVjdG9ycywgcGF0dGVybi50ZXh0LCBwYXR0ZXJuLnJlbW92ZSwgcGF0dGVybi5jc3MpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGF0dGVybnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5xdWV1ZUZpbHRlcmluZygpO1xuXG4gICAgICBsZXQgYXR0cmlidXRlcyA9IHNob3VsZE9ic2VydmVBdHRyaWJ1dGVzKHRoaXMucGF0dGVybnMpO1xuICAgICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKFxuICAgICAgICB0aGlzLmRvY3VtZW50LFxuICAgICAgICB7XG4gICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgIGF0dHJpYnV0ZXMsXG4gICAgICAgICAgYXR0cmlidXRlT2xkVmFsdWU6IGF0dHJpYnV0ZXMgJiYgISF0ZXN0SW5mbyxcbiAgICAgICAgICBjaGFyYWN0ZXJEYXRhOiBzaG91bGRPYnNlcnZlQ2hhcmFjdGVyRGF0YSh0aGlzLnBhdHRlcm5zKSxcbiAgICAgICAgICBzdWJ0cmVlOiB0cnVlXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICBpZiAoc2hvdWxkT2JzZXJ2ZVN0eWxlcyh0aGlzLnBhdHRlcm5zKSkge1xuICAgICAgICBsZXQgb25Mb2FkID0gdGhpcy5vbkxvYWQuYmluZCh0aGlzKTtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJsb2FkaW5nXCIpIHtcbiAgICAgICAgICB0aGlzLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIG9uTG9hZCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBvbkxvYWQsIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgdGhpcy5vYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgdGhpcy5fdW5oaWRlRWxlbXMoQXJyYXkuZnJvbSh0aGlzLmhpZGRlbkVsZW1lbnRzLmtleXMoKSkpO1xuICB9XG59O1xuIiwiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEFkYmxvY2sgUGx1cyA8aHR0cHM6Ly9hZGJsb2NrcGx1cy5vcmcvPixcbiAqIENvcHlyaWdodCAoQykgMjAwNi1wcmVzZW50IGV5ZW8gR21iSFxuICpcbiAqIEFkYmxvY2sgUGx1cyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhc1xuICogcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24uXG4gKlxuICogQWRibG9jayBQbHVzIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBZGJsb2NrIFBsdXMuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuLyoqIEBtb2R1bGUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogVGhlIG1heGltdW0gbnVtYmVyIG9mIHBhdHRlcm5zIHRoYXRcbiAqIGB7QGxpbmsgbW9kdWxlOnBhdHRlcm5zLmNvbXBpbGVQYXR0ZXJucyBjb21waWxlUGF0dGVybnMoKX1gIHdpbGwgY29tcGlsZVxuICogaW50byByZWd1bGFyIGV4cHJlc3Npb25zLlxuICogQHR5cGUge251bWJlcn1cbiAqL1xuY29uc3QgQ09NUElMRV9QQVRURVJOU19NQVggPSAxMDA7XG5cbi8qKlxuICogUmVndWxhciBleHByZXNzaW9uIHVzZWQgdG8gbWF0Y2ggdGhlIGBeYCBzdWZmaXggaW4gYW4gb3RoZXJ3aXNlIGxpdGVyYWxcbiAqIHBhdHRlcm4uXG4gKiBAdHlwZSB7UmVnRXhwfVxuICovXG5sZXQgc2VwYXJhdG9yUmVnRXhwID0gL1tcXHgwMC1cXHgyNFxceDI2LVxceDJDXFx4MkZcXHgzQS1cXHg0MFxceDVCLVxceDVFXFx4NjBcXHg3Qi1cXHg3Rl0vO1xuXG5sZXQgZmlsdGVyVG9SZWdFeHAgPVxuLyoqXG4gKiBDb252ZXJ0cyBmaWx0ZXIgdGV4dCBpbnRvIHJlZ3VsYXIgZXhwcmVzc2lvbiBzdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IGFzIGluIEZpbHRlcigpXG4gKiBAcmV0dXJuIHtzdHJpbmd9IHJlZ3VsYXIgZXhwcmVzc2lvbiByZXByZXNlbnRhdGlvbiBvZiBmaWx0ZXIgdGV4dFxuICogQHBhY2thZ2VcbiAqL1xuZXhwb3J0cy5maWx0ZXJUb1JlZ0V4cCA9IGZ1bmN0aW9uIGZpbHRlclRvUmVnRXhwKHRleHQpIHtcbiAgLy8gcmVtb3ZlIG11bHRpcGxlIHdpbGRjYXJkc1xuICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXCorL2csIFwiKlwiKTtcblxuICAvLyByZW1vdmUgbGVhZGluZyB3aWxkY2FyZFxuICBpZiAodGV4dFswXSA9PSBcIipcIikge1xuICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZygxKTtcbiAgfVxuXG4gIC8vIHJlbW92ZSB0cmFpbGluZyB3aWxkY2FyZFxuICBpZiAodGV4dFt0ZXh0Lmxlbmd0aCAtIDFdID09IFwiKlwiKSB7XG4gICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIHRleHQubGVuZ3RoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gdGV4dFxuICAgIC8vIHJlbW92ZSBhbmNob3JzIGZvbGxvd2luZyBzZXBhcmF0b3IgcGxhY2Vob2xkZXJcbiAgICAucmVwbGFjZSgvXFxeXFx8JC8sIFwiXlwiKVxuICAgIC8vIGVzY2FwZSBzcGVjaWFsIHN5bWJvbHNcbiAgICAucmVwbGFjZSgvXFxXL2csIFwiXFxcXCQmXCIpXG4gICAgLy8gcmVwbGFjZSB3aWxkY2FyZHMgYnkgLipcbiAgICAucmVwbGFjZSgvXFxcXFxcKi9nLCBcIi4qXCIpXG4gICAgLy8gcHJvY2VzcyBzZXBhcmF0b3IgcGxhY2Vob2xkZXJzIChhbGwgQU5TSSBjaGFyYWN0ZXJzIGJ1dCBhbHBoYW51bWVyaWNcbiAgICAvLyBjaGFyYWN0ZXJzIGFuZCBfJS4tKVxuICAgIC5yZXBsYWNlKC9cXFxcXFxeL2csIGAoPzoke3NlcGFyYXRvclJlZ0V4cC5zb3VyY2V9fCQpYClcbiAgICAvLyBwcm9jZXNzIGV4dGVuZGVkIGFuY2hvciBhdCBleHByZXNzaW9uIHN0YXJ0XG4gICAgLnJlcGxhY2UoL15cXFxcXFx8XFxcXFxcfC8sIFwiXltcXFxcd1xcXFwtXSs6XFxcXC8rKD86W15cXFxcL10rXFxcXC4pP1wiKVxuICAgIC8vIHByb2Nlc3MgYW5jaG9yIGF0IGV4cHJlc3Npb24gc3RhcnRcbiAgICAucmVwbGFjZSgvXlxcXFxcXHwvLCBcIl5cIilcbiAgICAvLyBwcm9jZXNzIGFuY2hvciBhdCBleHByZXNzaW9uIGVuZFxuICAgIC5yZXBsYWNlKC9cXFxcXFx8JC8sIFwiJFwiKTtcbn07XG5cbi8qKlxuICogUmVndWxhciBleHByZXNzaW9uIHVzZWQgdG8gbWF0Y2ggdGhlIGB8fGAgcHJlZml4IGluIGFuIG90aGVyd2lzZSBsaXRlcmFsXG4gKiBwYXR0ZXJuLlxuICogQHR5cGUge1JlZ0V4cH1cbiAqL1xubGV0IGV4dGVuZGVkQW5jaG9yUmVnRXhwID0gbmV3IFJlZ0V4cChmaWx0ZXJUb1JlZ0V4cChcInx8XCIpICsgXCIkXCIpO1xuXG4vKipcbiAqIFJlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgbWF0Y2hpbmcgYSBrZXl3b3JkIGluIGEgZmlsdGVyLlxuICogQHR5cGUge1JlZ0V4cH1cbiAqL1xubGV0IGtleXdvcmRSZWdFeHAgPSAvW15hLXowLTklKl1bYS16MC05JV17Mix9KD89W15hLXowLTklKl0pLztcblxuLyoqXG4gKiBSZWd1bGFyIGV4cHJlc3Npb24gZm9yIG1hdGNoaW5nIGFsbCBrZXl3b3JkcyBpbiBhIGZpbHRlci5cbiAqIEB0eXBlIHtSZWdFeHB9XG4gKi9cbmxldCBhbGxLZXl3b3Jkc1JlZ0V4cCA9IG5ldyBSZWdFeHAoa2V5d29yZFJlZ0V4cCwgXCJnXCIpO1xuXG4vKipcbiAqIEEgYENvbXBpbGVkUGF0dGVybnNgIG9iamVjdCByZXByZXNlbnRzIHRoZSBjb21waWxlZCB2ZXJzaW9uIG9mIG11bHRpcGxlIFVSTFxuICogcmVxdWVzdCBwYXR0ZXJucy4gSXQgaXMgcmV0dXJuZWQgYnlcbiAqIGB7QGxpbmsgbW9kdWxlOnBhdHRlcm5zLmNvbXBpbGVQYXR0ZXJucyBjb21waWxlUGF0dGVybnMoKX1gLlxuICovXG5jbGFzcyBDb21waWxlZFBhdHRlcm5zIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gb2JqZWN0IHdpdGggdGhlIGdpdmVuIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIGNhc2Utc2Vuc2l0aXZlXG4gICAqIGFuZCBjYXNlLWluc2Vuc2l0aXZlIG1hdGNoaW5nIHJlc3BlY3RpdmVseS5cbiAgICogQHBhcmFtIHs/UmVnRXhwfSBbY2FzZVNlbnNpdGl2ZV1cbiAgICogQHBhcmFtIHs/UmVnRXhwfSBbY2FzZUluc2Vuc2l0aXZlXVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29uc3RydWN0b3IoY2FzZVNlbnNpdGl2ZSwgY2FzZUluc2Vuc2l0aXZlKSB7XG4gICAgdGhpcy5fY2FzZVNlbnNpdGl2ZSA9IGNhc2VTZW5zaXRpdmU7XG4gICAgdGhpcy5fY2FzZUluc2Vuc2l0aXZlID0gY2FzZUluc2Vuc2l0aXZlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRlc3RzIHdoZXRoZXIgdGhlIGdpdmVuIFVSTCByZXF1ZXN0IG1hdGNoZXMgdGhlIHBhdHRlcm5zIHVzZWQgdG8gY3JlYXRlXG4gICAqIHRoaXMgb2JqZWN0LlxuICAgKiBAcGFyYW0ge21vZHVsZTp1cmwuVVJMUmVxdWVzdH0gcmVxdWVzdFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIHRlc3QocmVxdWVzdCkge1xuICAgIHJldHVybiAoKHRoaXMuX2Nhc2VTZW5zaXRpdmUgJiZcbiAgICAgICAgICAgICB0aGlzLl9jYXNlU2Vuc2l0aXZlLnRlc3QocmVxdWVzdC5ocmVmKSkgfHxcbiAgICAgICAgICAgICh0aGlzLl9jYXNlSW5zZW5zaXRpdmUgJiZcbiAgICAgICAgICAgICB0aGlzLl9jYXNlSW5zZW5zaXRpdmUudGVzdChyZXF1ZXN0Lmxvd2VyQ2FzZUhyZWYpKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDb21waWxlcyBwYXR0ZXJucyBmcm9tIHRoZSBnaXZlbiBmaWx0ZXJzIGludG8gYSBzaW5nbGVcbiAqIGB7QGxpbmsgbW9kdWxlOnBhdHRlcm5zfkNvbXBpbGVkUGF0dGVybnMgQ29tcGlsZWRQYXR0ZXJuc31gIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge21vZHVsZTpmaWx0ZXJDbGFzc2VzLlVSTEZpbHRlcnxcbiAqICAgICAgICAgU2V0Ljxtb2R1bGU6ZmlsdGVyQ2xhc3Nlcy5VUkxGaWx0ZXI+fSBmaWx0ZXJzXG4gKiAgIFRoZSBmaWx0ZXJzLiBJZiB0aGUgbnVtYmVyIG9mIGZpbHRlcnMgZXhjZWVkc1xuICogICBge0BsaW5rIG1vZHVsZTpwYXR0ZXJuc35DT01QSUxFX1BBVFRFUk5TX01BWCBDT01QSUxFX1BBVFRFUk5TX01BWH1gLCB0aGVcbiAqICAgZnVuY3Rpb24gcmV0dXJucyBgbnVsbGAuXG4gKlxuICogQHJldHVybnMgez9tb2R1bGU6cGF0dGVybnN+Q29tcGlsZWRQYXR0ZXJuc31cbiAqXG4gKiBAcGFja2FnZVxuICovXG5leHBvcnRzLmNvbXBpbGVQYXR0ZXJucyA9IGZ1bmN0aW9uIGNvbXBpbGVQYXR0ZXJucyhmaWx0ZXJzKSB7XG4gIGxldCBsaXN0ID0gQXJyYXkuaXNBcnJheShmaWx0ZXJzKSA/IGZpbHRlcnMgOiBbZmlsdGVyc107XG5cbiAgLy8gSWYgdGhlIG51bWJlciBvZiBmaWx0ZXJzIGlzIHRvbyBsYXJnZSwgaXQgbWF5IGNob2tlIGVzcGVjaWFsbHkgb24gbG93LWVuZFxuICAvLyBwbGF0Zm9ybXMuIEFzIGEgcHJlY2F1dGlvbiwgd2UgcmVmdXNlIHRvIGNvbXBpbGUuIElkZWFsbHkgd2Ugd291bGQgY2hlY2tcbiAgLy8gdGhlIGxlbmd0aCBvZiB0aGUgcmVndWxhciBleHByZXNzaW9uIHNvdXJjZSByYXRoZXIgdGhhbiB0aGUgbnVtYmVyIG9mXG4gIC8vIGZpbHRlcnMsIGJ1dCB0aGlzIGlzIGZhciBtb3JlIHN0cmFpZ2h0Zm9yd2FyZCBhbmQgcHJhY3RpY2FsLlxuICBpZiAobGlzdC5sZW5ndGggPiBDT01QSUxFX1BBVFRFUk5TX01BWCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IGNhc2VTZW5zaXRpdmUgPSBcIlwiO1xuICBsZXQgY2FzZUluc2Vuc2l0aXZlID0gXCJcIjtcblxuICBmb3IgKGxldCBmaWx0ZXIgb2YgZmlsdGVycykge1xuICAgIGxldCBzb3VyY2UgPSBmaWx0ZXIudXJsUGF0dGVybi5yZWdleHBTb3VyY2U7XG5cbiAgICBpZiAoZmlsdGVyLm1hdGNoQ2FzZSkge1xuICAgICAgY2FzZVNlbnNpdGl2ZSArPSBzb3VyY2UgKyBcInxcIjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjYXNlSW5zZW5zaXRpdmUgKz0gc291cmNlICsgXCJ8XCI7XG4gICAgfVxuICB9XG5cbiAgbGV0IGNhc2VTZW5zaXRpdmVSZWdFeHAgPSBudWxsO1xuICBsZXQgY2FzZUluc2Vuc2l0aXZlUmVnRXhwID0gbnVsbDtcblxuICB0cnkge1xuICAgIGlmIChjYXNlU2Vuc2l0aXZlKSB7XG4gICAgICBjYXNlU2Vuc2l0aXZlUmVnRXhwID0gbmV3IFJlZ0V4cChjYXNlU2Vuc2l0aXZlLnNsaWNlKDAsIC0xKSk7XG4gICAgfVxuXG4gICAgaWYgKGNhc2VJbnNlbnNpdGl2ZSkge1xuICAgICAgY2FzZUluc2Vuc2l0aXZlUmVnRXhwID0gbmV3IFJlZ0V4cChjYXNlSW5zZW5zaXRpdmUuc2xpY2UoMCwgLTEpKTtcbiAgICB9XG4gIH1cbiAgY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gSXQgaXMgcG9zc2libGUgaW4gdGhlb3J5IGZvciB0aGUgcmVndWxhciBleHByZXNzaW9uIHRvIGJlIHRvbyBsYXJnZVxuICAgIC8vIGRlc3BpdGUgQ09NUElMRV9QQVRURVJOU19NQVhcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBuZXcgQ29tcGlsZWRQYXR0ZXJucyhjYXNlU2Vuc2l0aXZlUmVnRXhwLCBjYXNlSW5zZW5zaXRpdmVSZWdFeHApO1xufTtcblxuLyoqXG4gKiBQYXR0ZXJucyBmb3IgbWF0Y2hpbmcgYWdhaW5zdCBVUkxzLlxuICpcbiAqIEludGVybmFsbHksIHRoaXMgbWF5IGJlIGEgUmVnRXhwIG9yIG1hdGNoIGRpcmVjdGx5IGFnYWluc3QgdGhlXG4gKiBwYXR0ZXJuIGZvciBzaW1wbGUgbGl0ZXJhbCBwYXR0ZXJucy5cbiAqL1xuZXhwb3J0cy5QYXR0ZXJuID0gY2xhc3MgUGF0dGVybiB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0dGVybiBwYXR0ZXJuIHRoYXQgcmVxdWVzdHMgVVJMcyBzaG91bGQgYmVcbiAgICogbWF0Y2hlZCBhZ2FpbnN0IGluIGZpbHRlciB0ZXh0IG5vdGF0aW9uXG4gICAqIEBwYXJhbSB7Ym9vbH0gbWF0Y2hDYXNlIGB0cnVlYCBpZiBjb21wYXJpc29ucyBtdXN0IGJlIGNhc2VcbiAgICogc2Vuc2l0aXZlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXR0ZXJuLCBtYXRjaENhc2UpIHtcbiAgICB0aGlzLm1hdGNoQ2FzZSA9IG1hdGNoQ2FzZSB8fCBmYWxzZTtcblxuICAgIGlmICghdGhpcy5tYXRjaENhc2UpIHtcbiAgICAgIHBhdHRlcm4gPSBwYXR0ZXJuLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgaWYgKHBhdHRlcm4ubGVuZ3RoID49IDIgJiZcbiAgICAgICAgcGF0dGVyblswXSA9PSBcIi9cIiAmJlxuICAgICAgICBwYXR0ZXJuW3BhdHRlcm4ubGVuZ3RoIC0gMV0gPT0gXCIvXCIpIHtcbiAgICAgIC8vIFRoZSBmaWx0ZXIgaXMgYSByZWd1bGFyIGV4cHJlc3Npb24gLSBjb252ZXJ0IGl0IGltbWVkaWF0ZWx5IHRvXG4gICAgICAvLyBjYXRjaCBzeW50YXggZXJyb3JzXG4gICAgICBwYXR0ZXJuID0gcGF0dGVybi5zdWJzdHJpbmcoMSwgcGF0dGVybi5sZW5ndGggLSAxKTtcbiAgICAgIHRoaXMuX3JlZ2V4cCA9IG5ldyBSZWdFeHAocGF0dGVybik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gUGF0dGVybnMgbGlrZSAvZm9vL2Jhci8qIGV4aXN0IHNvIHRoYXQgdGhleSBhcmUgbm90IHRyZWF0ZWQgYXMgcmVndWxhclxuICAgICAgLy8gZXhwcmVzc2lvbnMuIFdlIGRyb3AgYW55IHN1cGVyZmx1b3VzIHdpbGRjYXJkcyBoZXJlIHNvIG91clxuICAgICAgLy8gb3B0aW1pemF0aW9ucyBjYW4ga2ljayBpbi5cbiAgICAgIHBhdHRlcm4gPSBwYXR0ZXJuLnJlcGxhY2UoL15cXCorLywgXCJcIikucmVwbGFjZSgvXFwqKyQvLCBcIlwiKTtcblxuICAgICAgLy8gTm8gbmVlZCB0byBjb252ZXJ0IHRoaXMgZmlsdGVyIHRvIHJlZ3VsYXIgZXhwcmVzc2lvbiB5ZXQsIGRvIGl0IG9uXG4gICAgICAvLyBkZW1hbmRcbiAgICAgIHRoaXMucGF0dGVybiA9IHBhdHRlcm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSBwYXR0ZXJuIGlzIGEgc3RyaW5nIG9mIGxpdGVyYWwgY2hhcmFjdGVycyB3aXRoXG4gICAqIG5vIHdpbGRjYXJkcyBvciBhbnkgb3RoZXIgc3BlY2lhbCBjaGFyYWN0ZXJzLlxuICAgKlxuICAgKiBJZiB0aGUgcGF0dGVybiBpcyBwcmVmaXhlZCB3aXRoIGEgYHx8YCBvciBzdWZmaXhlZCB3aXRoIGEgYF5gIGJ1dCBvdGhlcndpc2VcbiAgICogY29udGFpbnMgbm8gc3BlY2lhbCBjaGFyYWN0ZXJzLCBpdCBpcyBzdGlsbCBjb25zaWRlcmVkIHRvIGJlIGEgbGl0ZXJhbFxuICAgKiBwYXR0ZXJuLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzTGl0ZXJhbFBhdHRlcm4oKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzLnBhdHRlcm4gIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICEvWypefF0vLnRlc3QodGhpcy5wYXR0ZXJuLnJlcGxhY2UoL15cXHx7MSwyfS8sIFwiXCIpLnJlcGxhY2UoL1t8Xl0kLywgXCJcIikpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ3VsYXIgZXhwcmVzc2lvbiB0byBiZSB1c2VkIHdoZW4gdGVzdGluZyBhZ2FpbnN0IHRoaXMgcGF0dGVybi5cbiAgICpcbiAgICogbnVsbCBpZiB0aGUgcGF0dGVybiBpcyBtYXRjaGVkIHdpdGhvdXQgdXNpbmcgcmVndWxhciBleHByZXNzaW9ucy5cbiAgICogQHR5cGUge1JlZ0V4cH1cbiAgICovXG4gIGdldCByZWdleHAoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9yZWdleHAgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5fcmVnZXhwID0gdGhpcy5pc0xpdGVyYWxQYXR0ZXJuKCkgP1xuICAgICAgICBudWxsIDogbmV3IFJlZ0V4cChmaWx0ZXJUb1JlZ0V4cCh0aGlzLnBhdHRlcm4pKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3JlZ2V4cDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXR0ZXJuIGluIHJlZ3VsYXIgZXhwcmVzc2lvbiBub3RhdGlvbi4gVGhpcyB3aWxsIGhhdmUgYSB2YWx1ZVxuICAgKiBldmVuIGlmIGByZWdleHBgIHJldHVybnMgbnVsbC5cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIGdldCByZWdleHBTb3VyY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlZ2V4cCA/IHRoaXMuX3JlZ2V4cC5zb3VyY2UgOiBmaWx0ZXJUb1JlZ0V4cCh0aGlzLnBhdHRlcm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBVUkwgcmVxdWVzdCBtYXRjaGVzIHRoaXMgZmlsdGVyJ3MgcGF0dGVybi5cbiAgICogQHBhcmFtIHttb2R1bGU6dXJsLlVSTFJlcXVlc3R9IHJlcXVlc3QgVGhlIFVSTCByZXF1ZXN0IHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIHRoZSBVUkwgcmVxdWVzdCBtYXRjaGVzLlxuICAgKi9cbiAgbWF0Y2hlc0xvY2F0aW9uKHJlcXVlc3QpIHtcbiAgICBsZXQgbG9jYXRpb24gPSB0aGlzLm1hdGNoQ2FzZSA/IHJlcXVlc3QuaHJlZiA6IHJlcXVlc3QubG93ZXJDYXNlSHJlZjtcbiAgICBsZXQgcmVnZXhwID0gdGhpcy5yZWdleHA7XG4gICAgaWYgKHJlZ2V4cCkge1xuICAgICAgcmV0dXJuIHJlZ2V4cC50ZXN0KGxvY2F0aW9uKTtcbiAgICB9XG5cbiAgICBsZXQgcGF0dGVybiA9IHRoaXMucGF0dGVybjtcbiAgICBsZXQgc3RhcnRzV2l0aEFuY2hvciA9IHBhdHRlcm5bMF0gPT0gXCJ8XCI7XG4gICAgbGV0IHN0YXJ0c1dpdGhFeHRlbmRlZEFuY2hvciA9IHN0YXJ0c1dpdGhBbmNob3IgJiYgcGF0dGVyblsxXSA9PSBcInxcIjtcbiAgICBsZXQgZW5kc1dpdGhTZXBhcmF0b3IgPSBwYXR0ZXJuW3BhdHRlcm4ubGVuZ3RoIC0gMV0gPT0gXCJeXCI7XG4gICAgbGV0IGVuZHNXaXRoQW5jaG9yID0gIWVuZHNXaXRoU2VwYXJhdG9yICYmXG4gICAgICAgIHBhdHRlcm5bcGF0dGVybi5sZW5ndGggLSAxXSA9PSBcInxcIjtcblxuICAgIGlmIChzdGFydHNXaXRoRXh0ZW5kZWRBbmNob3IpIHtcbiAgICAgIHBhdHRlcm4gPSBwYXR0ZXJuLnN1YnN0cigyKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoc3RhcnRzV2l0aEFuY2hvcikge1xuICAgICAgcGF0dGVybiA9IHBhdHRlcm4uc3Vic3RyKDEpO1xuICAgIH1cblxuICAgIGlmIChlbmRzV2l0aFNlcGFyYXRvciB8fCBlbmRzV2l0aEFuY2hvcikge1xuICAgICAgcGF0dGVybiA9IHBhdHRlcm4uc2xpY2UoMCwgLTEpO1xuICAgIH1cblxuICAgIGxldCBpbmRleCA9IGxvY2F0aW9uLmluZGV4T2YocGF0dGVybik7XG5cbiAgICB3aGlsZSAoaW5kZXggIT0gLTEpIHtcbiAgICAgIC8vIFRoZSBcInx8XCIgcHJlZml4IHJlcXVpcmVzIHRoYXQgdGhlIHRleHQgdGhhdCBmb2xsb3dzIGRvZXMgbm90IHN0YXJ0XG4gICAgICAvLyB3aXRoIGEgZm9yd2FyZCBzbGFzaC5cbiAgICAgIGlmICgoc3RhcnRzV2l0aEV4dGVuZGVkQW5jaG9yID9cbiAgICAgICAgICAgbG9jYXRpb25baW5kZXhdICE9IFwiL1wiICYmXG4gICAgICAgICAgIGV4dGVuZGVkQW5jaG9yUmVnRXhwLnRlc3QobG9jYXRpb24uc3Vic3RyaW5nKDAsIGluZGV4KSkgOlxuICAgICAgICAgICBzdGFydHNXaXRoQW5jaG9yID9cbiAgICAgICAgICAgaW5kZXggPT0gMCA6XG4gICAgICAgICAgIHRydWUpICYmXG4gICAgICAgICAgKGVuZHNXaXRoU2VwYXJhdG9yID9cbiAgICAgICAgICAgIWxvY2F0aW9uW2luZGV4ICsgcGF0dGVybi5sZW5ndGhdIHx8XG4gICAgICAgICAgIHNlcGFyYXRvclJlZ0V4cC50ZXN0KGxvY2F0aW9uW2luZGV4ICsgcGF0dGVybi5sZW5ndGhdKSA6XG4gICAgICAgICAgIGVuZHNXaXRoQW5jaG9yID9cbiAgICAgICAgICAgaW5kZXggPT0gbG9jYXRpb24ubGVuZ3RoIC0gcGF0dGVybi5sZW5ndGggOlxuICAgICAgICAgICB0cnVlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhdHRlcm4gPT0gXCJcIikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaW5kZXggPSBsb2NhdGlvbi5pbmRleE9mKHBhdHRlcm4sIGluZGV4ICsgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSBwYXR0ZXJuIGhhcyBrZXl3b3Jkc1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGhhc0tleXdvcmRzKCkge1xuICAgIHJldHVybiB0aGlzLnBhdHRlcm4gJiYga2V5d29yZFJlZ0V4cC50ZXN0KHRoaXMucGF0dGVybik7XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgYWxsIGtleXdvcmRzIHRoYXQgY291bGQgYmUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgcGF0dGVyblxuICAgKiBAcmV0dXJucyB7c3RyaW5nW119XG4gICAqL1xuICBrZXl3b3JkQ2FuZGlkYXRlcygpIHtcbiAgICBpZiAoIXRoaXMucGF0dGVybikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBhdHRlcm4udG9Mb3dlckNhc2UoKS5tYXRjaChhbGxLZXl3b3Jkc1JlZ0V4cCk7XG4gIH1cbn07XG4iLCIvKiB3ZWJleHRlbnNpb24tcG9seWZpbGwgLSB2MC44LjAgLSBUdWUgQXByIDIwIDIwMjEgMTE6Mjc6MzggKi9cbi8qIC0qLSBNb2RlOiBpbmRlbnQtdGFicy1tb2RlOiBuaWw7IGpzLWluZGVudC1sZXZlbDogMiAtKi0gKi9cbi8qIHZpbTogc2V0IHN0cz0yIHN3PTIgZXQgdHc9ODA6ICovXG4vKiBUaGlzIFNvdXJjZSBDb2RlIEZvcm0gaXMgc3ViamVjdCB0byB0aGUgdGVybXMgb2YgdGhlIE1vemlsbGEgUHVibGljXG4gKiBMaWNlbnNlLCB2LiAyLjAuIElmIGEgY29weSBvZiB0aGUgTVBMIHdhcyBub3QgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzXG4gKiBmaWxlLCBZb3UgY2FuIG9idGFpbiBvbmUgYXQgaHR0cDovL21vemlsbGEub3JnL01QTC8yLjAvLiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmlmICh0eXBlb2YgYnJvd3NlciA9PT0gXCJ1bmRlZmluZWRcIiB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYnJvd3NlcikgIT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgY29uc3QgQ0hST01FX1NFTkRfTUVTU0FHRV9DQUxMQkFDS19OT19SRVNQT05TRV9NRVNTQUdFID0gXCJUaGUgbWVzc2FnZSBwb3J0IGNsb3NlZCBiZWZvcmUgYSByZXNwb25zZSB3YXMgcmVjZWl2ZWQuXCI7XG4gIGNvbnN0IFNFTkRfUkVTUE9OU0VfREVQUkVDQVRJT05fV0FSTklORyA9IFwiUmV0dXJuaW5nIGEgUHJvbWlzZSBpcyB0aGUgcHJlZmVycmVkIHdheSB0byBzZW5kIGEgcmVwbHkgZnJvbSBhbiBvbk1lc3NhZ2Uvb25NZXNzYWdlRXh0ZXJuYWwgbGlzdGVuZXIsIGFzIHRoZSBzZW5kUmVzcG9uc2Ugd2lsbCBiZSByZW1vdmVkIGZyb20gdGhlIHNwZWNzIChTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZG9jcy9Nb3ppbGxhL0FkZC1vbnMvV2ViRXh0ZW5zaW9ucy9BUEkvcnVudGltZS9vbk1lc3NhZ2UpXCI7XG5cbiAgLy8gV3JhcHBpbmcgdGhlIGJ1bGsgb2YgdGhpcyBwb2x5ZmlsbCBpbiBhIG9uZS10aW1lLXVzZSBmdW5jdGlvbiBpcyBhIG1pbm9yXG4gIC8vIG9wdGltaXphdGlvbiBmb3IgRmlyZWZveC4gU2luY2UgU3BpZGVybW9ua2V5IGRvZXMgbm90IGZ1bGx5IHBhcnNlIHRoZVxuICAvLyBjb250ZW50cyBvZiBhIGZ1bmN0aW9uIHVudGlsIHRoZSBmaXJzdCB0aW1lIGl0J3MgY2FsbGVkLCBhbmQgc2luY2UgaXQgd2lsbFxuICAvLyBuZXZlciBhY3R1YWxseSBuZWVkIHRvIGJlIGNhbGxlZCwgdGhpcyBhbGxvd3MgdGhlIHBvbHlmaWxsIHRvIGJlIGluY2x1ZGVkXG4gIC8vIGluIEZpcmVmb3ggbmVhcmx5IGZvciBmcmVlLlxuICBjb25zdCB3cmFwQVBJcyA9IGV4dGVuc2lvbkFQSXMgPT4ge1xuICAgIC8vIE5PVEU6IGFwaU1ldGFkYXRhIGlzIGFzc29jaWF0ZWQgdG8gdGhlIGNvbnRlbnQgb2YgdGhlIGFwaS1tZXRhZGF0YS5qc29uIGZpbGVcbiAgICAvLyBhdCBidWlsZCB0aW1lIGJ5IHJlcGxhY2luZyB0aGUgZm9sbG93aW5nIFwiaW5jbHVkZVwiIHdpdGggdGhlIGNvbnRlbnQgb2YgdGhlXG4gICAgLy8gSlNPTiBmaWxlLlxuICAgIGNvbnN0IGFwaU1ldGFkYXRhID0ge1xuICAgICAgXCJhbGFybXNcIjoge1xuICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcImNsZWFyQWxsXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICB9LFxuICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcImJvb2ttYXJrc1wiOiB7XG4gICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJnZXRDaGlsZHJlblwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJnZXRSZWNlbnRcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwiZ2V0U3ViVHJlZVwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJnZXRUcmVlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICB9LFxuICAgICAgICBcIm1vdmVcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgIH0sXG4gICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcInJlbW92ZVRyZWVcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwiYnJvd3NlckFjdGlvblwiOiB7XG4gICAgICAgIFwiZGlzYWJsZVwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiZW5hYmxlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJnZXRCYWRnZUJhY2tncm91bmRDb2xvclwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJnZXRCYWRnZVRleHRcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwiZ2V0UG9wdXBcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwiZ2V0VGl0bGVcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwib3BlblBvcHVwXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICB9LFxuICAgICAgICBcInNldEJhZGdlQmFja2dyb3VuZENvbG9yXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJzZXRCYWRnZVRleHRcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcInNldEljb25cIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwic2V0UG9wdXBcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcInNldFRpdGxlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwiYnJvd3NpbmdEYXRhXCI6IHtcbiAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgIH0sXG4gICAgICAgIFwicmVtb3ZlQ2FjaGVcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwicmVtb3ZlQ29va2llc1wiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJyZW1vdmVEb3dubG9hZHNcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwicmVtb3ZlRm9ybURhdGFcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwicmVtb3ZlSGlzdG9yeVwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJyZW1vdmVMb2NhbFN0b3JhZ2VcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwicmVtb3ZlUGFzc3dvcmRzXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcInJlbW92ZVBsdWdpbkRhdGFcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwic2V0dGluZ3NcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcImNvbW1hbmRzXCI6IHtcbiAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcImNvbnRleHRNZW51c1wiOiB7XG4gICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcInJlbW92ZUFsbFwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgfSxcbiAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcImNvb2tpZXNcIjoge1xuICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwiZ2V0QWxsQ29va2llU3RvcmVzXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICB9LFxuICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJzZXRcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcImRldnRvb2xzXCI6IHtcbiAgICAgICAgXCJpbnNwZWN0ZWRXaW5kb3dcIjoge1xuICAgICAgICAgIFwiZXZhbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJzaW5nbGVDYWxsYmFja0FyZ1wiOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJwYW5lbHNcIjoge1xuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAzLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDMsXG4gICAgICAgICAgICBcInNpbmdsZUNhbGxiYWNrQXJnXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZWxlbWVudHNcIjoge1xuICAgICAgICAgICAgXCJjcmVhdGVTaWRlYmFyUGFuZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwiZG93bmxvYWRzXCI6IHtcbiAgICAgICAgXCJjYW5jZWxcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwiZG93bmxvYWRcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwiZXJhc2VcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwiZ2V0RmlsZUljb25cIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgIH0sXG4gICAgICAgIFwib3BlblwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwicGF1c2VcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwicmVtb3ZlRmlsZVwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJyZXN1bWVcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcInNob3dcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJleHRlbnNpb25cIjoge1xuICAgICAgICBcImlzQWxsb3dlZEZpbGVTY2hlbWVBY2Nlc3NcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgIH0sXG4gICAgICAgIFwiaXNBbGxvd2VkSW5jb2duaXRvQWNjZXNzXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJoaXN0b3J5XCI6IHtcbiAgICAgICAgXCJhZGRVcmxcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwiZGVsZXRlQWxsXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICB9LFxuICAgICAgICBcImRlbGV0ZVJhbmdlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcImRlbGV0ZVVybFwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJnZXRWaXNpdHNcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJpMThuXCI6IHtcbiAgICAgICAgXCJkZXRlY3RMYW5ndWFnZVwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJnZXRBY2NlcHRMYW5ndWFnZXNcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcImlkZW50aXR5XCI6IHtcbiAgICAgICAgXCJsYXVuY2hXZWJBdXRoRmxvd1wiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwiaWRsZVwiOiB7XG4gICAgICAgIFwicXVlcnlTdGF0ZVwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwibWFuYWdlbWVudFwiOiB7XG4gICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgfSxcbiAgICAgICAgXCJnZXRTZWxmXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICB9LFxuICAgICAgICBcInNldEVuYWJsZWRcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgIH0sXG4gICAgICAgIFwidW5pbnN0YWxsU2VsZlwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwibm90aWZpY2F0aW9uc1wiOiB7XG4gICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICB9LFxuICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgfSxcbiAgICAgICAgXCJnZXRQZXJtaXNzaW9uTGV2ZWxcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgIH0sXG4gICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJwYWdlQWN0aW9uXCI6IHtcbiAgICAgICAgXCJnZXRQb3B1cFwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJnZXRUaXRsZVwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJoaWRlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJzZXRJY29uXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcInNldFBvcHVwXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJzZXRUaXRsZVwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwic2hvd1wiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcInBlcm1pc3Npb25zXCI6IHtcbiAgICAgICAgXCJjb250YWluc1wiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgIH0sXG4gICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcInJlcXVlc3RcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcInJ1bnRpbWVcIjoge1xuICAgICAgICBcImdldEJhY2tncm91bmRQYWdlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICB9LFxuICAgICAgICBcImdldFBsYXRmb3JtSW5mb1wiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgfSxcbiAgICAgICAgXCJvcGVuT3B0aW9uc1BhZ2VcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgIH0sXG4gICAgICAgIFwicmVxdWVzdFVwZGF0ZUNoZWNrXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICB9LFxuICAgICAgICBcInNlbmRNZXNzYWdlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogM1xuICAgICAgICB9LFxuICAgICAgICBcInNlbmROYXRpdmVNZXNzYWdlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICB9LFxuICAgICAgICBcInNldFVuaW5zdGFsbFVSTFwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwic2Vzc2lvbnNcIjoge1xuICAgICAgICBcImdldERldmljZXNcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwiZ2V0UmVjZW50bHlDbG9zZWRcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwicmVzdG9yZVwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwic3RvcmFnZVwiOiB7XG4gICAgICAgIFwibG9jYWxcIjoge1xuICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRCeXRlc0luVXNlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwibWFuYWdlZFwiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRCeXRlc0luVXNlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwic3luY1wiOiB7XG4gICAgICAgICAgXCJjbGVhclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwidGFic1wiOiB7XG4gICAgICAgIFwiY2FwdHVyZVZpc2libGVUYWJcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgIH0sXG4gICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcImRldGVjdExhbmd1YWdlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcImRpc2NhcmRcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwiZHVwbGljYXRlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcImV4ZWN1dGVTY3JpcHRcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgIH0sXG4gICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcImdldEN1cnJlbnRcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgIH0sXG4gICAgICAgIFwiZ2V0Wm9vbVwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJnZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwiZ29CYWNrXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcImdvRm9yd2FyZFwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJoaWdobGlnaHRcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwiaW5zZXJ0Q1NTXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICB9LFxuICAgICAgICBcIm1vdmVcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgIH0sXG4gICAgICAgIFwicXVlcnlcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwicmVsb2FkXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICB9LFxuICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJyZW1vdmVDU1NcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgIH0sXG4gICAgICAgIFwic2VuZE1lc3NhZ2VcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAzXG4gICAgICAgIH0sXG4gICAgICAgIFwic2V0Wm9vbVwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgfSxcbiAgICAgICAgXCJzZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgIH0sXG4gICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJ0b3BTaXRlc1wiOiB7XG4gICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJ3ZWJOYXZpZ2F0aW9uXCI6IHtcbiAgICAgICAgXCJnZXRBbGxGcmFtZXNcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwiZ2V0RnJhbWVcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcIndlYlJlcXVlc3RcIjoge1xuICAgICAgICBcImhhbmRsZXJCZWhhdmlvckNoYW5nZWRcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcIndpbmRvd3NcIjoge1xuICAgICAgICBcImNyZWF0ZVwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgfSxcbiAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgIH0sXG4gICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcImdldEN1cnJlbnRcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwiZ2V0TGFzdEZvY3VzZWRcIjoge1xuICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICB9LFxuICAgICAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoT2JqZWN0LmtleXMoYXBpTWV0YWRhdGEpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYXBpLW1ldGFkYXRhLmpzb24gaGFzIG5vdCBiZWVuIGluY2x1ZGVkIGluIGJyb3dzZXItcG9seWZpbGxcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBXZWFrTWFwIHN1YmNsYXNzIHdoaWNoIGNyZWF0ZXMgYW5kIHN0b3JlcyBhIHZhbHVlIGZvciBhbnkga2V5IHdoaWNoIGRvZXNcbiAgICAgKiBub3QgZXhpc3Qgd2hlbiBhY2Nlc3NlZCwgYnV0IGJlaGF2ZXMgZXhhY3RseSBhcyBhbiBvcmRpbmFyeSBXZWFrTWFwXG4gICAgICogb3RoZXJ3aXNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY3JlYXRlSXRlbVxuICAgICAqICAgICAgICBBIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgY2FsbGVkIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGUgdmFsdWUgZm9yIGFueVxuICAgICAqICAgICAgICBrZXkgd2hpY2ggZG9lcyBub3QgZXhpc3QsIHRoZSBmaXJzdCB0aW1lIGl0IGlzIGFjY2Vzc2VkLiBUaGVcbiAgICAgKiAgICAgICAgZnVuY3Rpb24gcmVjZWl2ZXMsIGFzIGl0cyBvbmx5IGFyZ3VtZW50LCB0aGUga2V5IGJlaW5nIGNyZWF0ZWQuXG4gICAgICovXG4gICAgY2xhc3MgRGVmYXVsdFdlYWtNYXAgZXh0ZW5kcyBXZWFrTWFwIHtcbiAgICAgIGNvbnN0cnVjdG9yKGNyZWF0ZUl0ZW0sIGl0ZW1zID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHN1cGVyKGl0ZW1zKTtcbiAgICAgICAgdGhpcy5jcmVhdGVJdGVtID0gY3JlYXRlSXRlbTtcbiAgICAgIH1cblxuICAgICAgZ2V0KGtleSkge1xuICAgICAgICBpZiAoIXRoaXMuaGFzKGtleSkpIHtcbiAgICAgICAgICB0aGlzLnNldChrZXksIHRoaXMuY3JlYXRlSXRlbShrZXkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdXBlci5nZXQoa2V5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIG9iamVjdCBpcyBhbiBvYmplY3Qgd2l0aCBhIGB0aGVuYCBtZXRob2QsIGFuZCBjYW5cbiAgICAgKiB0aGVyZWZvcmUgYmUgYXNzdW1lZCB0byBiZWhhdmUgYXMgYSBQcm9taXNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdC5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdGhlbmFibGUuXG4gICAgICovXG4gICAgY29uc3QgaXNUaGVuYWJsZSA9IHZhbHVlID0+IHtcbiAgICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHZhbHVlLnRoZW4gPT09IFwiZnVuY3Rpb25cIjtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbmQgcmV0dXJucyBhIGZ1bmN0aW9uIHdoaWNoLCB3aGVuIGNhbGxlZCwgd2lsbCByZXNvbHZlIG9yIHJlamVjdFxuICAgICAqIHRoZSBnaXZlbiBwcm9taXNlIGJhc2VkIG9uIGhvdyBpdCBpcyBjYWxsZWQ6XG4gICAgICpcbiAgICAgKiAtIElmLCB3aGVuIGNhbGxlZCwgYGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcmAgY29udGFpbnMgYSBub24tbnVsbCBvYmplY3QsXG4gICAgICogICB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCB3aXRoIHRoYXQgdmFsdWUuXG4gICAgICogLSBJZiB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggZXhhY3RseSBvbmUgYXJndW1lbnQsIHRoZSBwcm9taXNlIGlzXG4gICAgICogICByZXNvbHZlZCB0byB0aGF0IHZhbHVlLlxuICAgICAqIC0gT3RoZXJ3aXNlLCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB0byBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGVcbiAgICAgKiAgIGZ1bmN0aW9uJ3MgYXJndW1lbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHByb21pc2VcbiAgICAgKiAgICAgICAgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHJlc29sdXRpb24gYW5kIHJlamVjdGlvbiBmdW5jdGlvbnMgb2YgYVxuICAgICAqICAgICAgICBwcm9taXNlLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVzb2x2ZVxuICAgICAqICAgICAgICBUaGUgcHJvbWlzZSdzIHJlc29sdXRpb24gZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gcHJvbWlzZS5yZWplY3RcbiAgICAgKiAgICAgICAgVGhlIHByb21pc2UncyByZWplY3Rpb24gZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG1ldGFkYXRhXG4gICAgICogICAgICAgIE1ldGFkYXRhIGFib3V0IHRoZSB3cmFwcGVkIG1ldGhvZCB3aGljaCBoYXMgY3JlYXRlZCB0aGUgY2FsbGJhY2suXG4gICAgICogQHBhcmFtIHtib29sZWFufSBtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZ1xuICAgICAqICAgICAgICBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIG9ubHkgdGhlIGZpcnN0XG4gICAgICogICAgICAgIGFyZ3VtZW50IG9mIHRoZSBjYWxsYmFjaywgYWx0ZXJuYXRpdmVseSBhbiBhcnJheSBvZiBhbGwgdGhlXG4gICAgICogICAgICAgIGNhbGxiYWNrIGFyZ3VtZW50cyBpcyByZXNvbHZlZC4gQnkgZGVmYXVsdCwgaWYgdGhlIGNhbGxiYWNrXG4gICAgICogICAgICAgIGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBvbmx5IGEgc2luZ2xlIGFyZ3VtZW50LCB0aGF0IHdpbGwgYmVcbiAgICAgKiAgICAgICAgcmVzb2x2ZWQgdG8gdGhlIHByb21pc2UsIHdoaWxlIGFsbCBhcmd1bWVudHMgd2lsbCBiZSByZXNvbHZlZCBhc1xuICAgICAqICAgICAgICBhbiBhcnJheSBpZiBtdWx0aXBsZSBhcmUgZ2l2ZW4uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gICAgICogICAgICAgIFRoZSBnZW5lcmF0ZWQgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICovXG4gICAgY29uc3QgbWFrZUNhbGxiYWNrID0gKHByb21pc2UsIG1ldGFkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gKC4uLmNhbGxiYWNrQXJncykgPT4ge1xuICAgICAgICBpZiAoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgIHByb21pc2UucmVqZWN0KG5ldyBFcnJvcihleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpKTtcbiAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZyB8fFxuICAgICAgICAgICAgICAgICAgIChjYWxsYmFja0FyZ3MubGVuZ3RoIDw9IDEgJiYgbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmcgIT09IGZhbHNlKSkge1xuICAgICAgICAgIHByb21pc2UucmVzb2x2ZShjYWxsYmFja0FyZ3NbMF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb21pc2UucmVzb2x2ZShjYWxsYmFja0FyZ3MpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBjb25zdCBwbHVyYWxpemVBcmd1bWVudHMgPSAobnVtQXJncykgPT4gbnVtQXJncyA9PSAxID8gXCJhcmd1bWVudFwiIDogXCJhcmd1bWVudHNcIjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSB3cmFwcGVyIGZ1bmN0aW9uIGZvciBhIG1ldGhvZCB3aXRoIHRoZSBnaXZlbiBuYW1lIGFuZCBtZXRhZGF0YS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAgICogICAgICAgIFRoZSBuYW1lIG9mIHRoZSBtZXRob2Qgd2hpY2ggaXMgYmVpbmcgd3JhcHBlZC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgKiAgICAgICAgTWV0YWRhdGEgYWJvdXQgdGhlIG1ldGhvZCBiZWluZyB3cmFwcGVkLlxuICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbWV0YWRhdGEubWluQXJnc1xuICAgICAqICAgICAgICBUaGUgbWluaW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHdoaWNoIG11c3QgYmUgcGFzc2VkIHRvIHRoZVxuICAgICAqICAgICAgICBmdW5jdGlvbi4gSWYgY2FsbGVkIHdpdGggZmV3ZXIgdGhhbiB0aGlzIG51bWJlciBvZiBhcmd1bWVudHMsIHRoZVxuICAgICAqICAgICAgICB3cmFwcGVyIHdpbGwgcmFpc2UgYW4gZXhjZXB0aW9uLlxuICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbWV0YWRhdGEubWF4QXJnc1xuICAgICAqICAgICAgICBUaGUgbWF4aW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHdoaWNoIG1heSBiZSBwYXNzZWQgdG8gdGhlXG4gICAgICogICAgICAgIGZ1bmN0aW9uLiBJZiBjYWxsZWQgd2l0aCBtb3JlIHRoYW4gdGhpcyBudW1iZXIgb2YgYXJndW1lbnRzLCB0aGVcbiAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1ldGFkYXRhLnNpbmdsZUNhbGxiYWNrQXJnXG4gICAgICogICAgICAgIFdoZXRoZXIgb3Igbm90IHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggb25seSB0aGUgZmlyc3RcbiAgICAgKiAgICAgICAgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrLCBhbHRlcm5hdGl2ZWx5IGFuIGFycmF5IG9mIGFsbCB0aGVcbiAgICAgKiAgICAgICAgY2FsbGJhY2sgYXJndW1lbnRzIGlzIHJlc29sdmVkLiBCeSBkZWZhdWx0LCBpZiB0aGUgY2FsbGJhY2tcbiAgICAgKiAgICAgICAgZnVuY3Rpb24gaXMgaW52b2tlZCB3aXRoIG9ubHkgYSBzaW5nbGUgYXJndW1lbnQsIHRoYXQgd2lsbCBiZVxuICAgICAqICAgICAgICByZXNvbHZlZCB0byB0aGUgcHJvbWlzZSwgd2hpbGUgYWxsIGFyZ3VtZW50cyB3aWxsIGJlIHJlc29sdmVkIGFzXG4gICAgICogICAgICAgIGFuIGFycmF5IGlmIG11bHRpcGxlIGFyZSBnaXZlbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbihvYmplY3QsIC4uLiopfVxuICAgICAqICAgICAgIFRoZSBnZW5lcmF0ZWQgd3JhcHBlciBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBjb25zdCB3cmFwQXN5bmNGdW5jdGlvbiA9IChuYW1lLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFzeW5jRnVuY3Rpb25XcmFwcGVyKHRhcmdldCwgLi4uYXJncykge1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPCBtZXRhZGF0YS5taW5BcmdzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBsZWFzdCAke21ldGFkYXRhLm1pbkFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1pbkFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IG1ldGFkYXRhLm1heEFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IG1vc3QgJHttZXRhZGF0YS5tYXhBcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5tYXhBcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGlmIChtZXRhZGF0YS5mYWxsYmFja1RvTm9DYWxsYmFjaykge1xuICAgICAgICAgICAgLy8gVGhpcyBBUEkgbWV0aG9kIGhhcyBjdXJyZW50bHkgbm8gY2FsbGJhY2sgb24gQ2hyb21lLCBidXQgaXQgcmV0dXJuIGEgcHJvbWlzZSBvbiBGaXJlZm94LFxuICAgICAgICAgICAgLy8gYW5kIHNvIHRoZSBwb2x5ZmlsbCB3aWxsIHRyeSB0byBjYWxsIGl0IHdpdGggYSBjYWxsYmFjayBmaXJzdCwgYW5kIGl0IHdpbGwgZmFsbGJhY2tcbiAgICAgICAgICAgIC8vIHRvIG5vdCBwYXNzaW5nIHRoZSBjYWxsYmFjayBpZiB0aGUgZmlyc3QgY2FsbCBmYWlscy5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzLCBtYWtlQ2FsbGJhY2soe3Jlc29sdmUsIHJlamVjdH0sIG1ldGFkYXRhKSk7XG4gICAgICAgICAgICB9IGNhdGNoIChjYkVycm9yKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihgJHtuYW1lfSBBUEkgbWV0aG9kIGRvZXNuJ3Qgc2VlbSB0byBzdXBwb3J0IHRoZSBjYWxsYmFjayBwYXJhbWV0ZXIsIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmYWxsaW5nIGJhY2sgdG8gY2FsbCBpdCB3aXRob3V0IGEgY2FsbGJhY2s6IFwiLCBjYkVycm9yKTtcblxuICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncyk7XG5cbiAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBBUEkgbWV0aG9kIG1ldGFkYXRhLCBzbyB0aGF0IHRoZSBuZXh0IEFQSSBjYWxscyB3aWxsIG5vdCB0cnkgdG9cbiAgICAgICAgICAgICAgLy8gdXNlIHRoZSB1bnN1cHBvcnRlZCBjYWxsYmFjayBhbnltb3JlLlxuICAgICAgICAgICAgICBtZXRhZGF0YS5mYWxsYmFja1RvTm9DYWxsYmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgICBtZXRhZGF0YS5ub0NhbGxiYWNrID0gdHJ1ZTtcblxuICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5ub0NhbGxiYWNrKSB7XG4gICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncyk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzLCBtYWtlQ2FsbGJhY2soe3Jlc29sdmUsIHJlamVjdH0sIG1ldGFkYXRhKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFdyYXBzIGFuIGV4aXN0aW5nIG1ldGhvZCBvZiB0aGUgdGFyZ2V0IG9iamVjdCwgc28gdGhhdCBjYWxscyB0byBpdCBhcmVcbiAgICAgKiBpbnRlcmNlcHRlZCBieSB0aGUgZ2l2ZW4gd3JhcHBlciBmdW5jdGlvbi4gVGhlIHdyYXBwZXIgZnVuY3Rpb24gcmVjZWl2ZXMsXG4gICAgICogYXMgaXRzIGZpcnN0IGFyZ3VtZW50LCB0aGUgb3JpZ2luYWwgYHRhcmdldGAgb2JqZWN0LCBmb2xsb3dlZCBieSBlYWNoIG9mXG4gICAgICogdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAgICAgKiAgICAgICAgVGhlIG9yaWdpbmFsIHRhcmdldCBvYmplY3QgdGhhdCB0aGUgd3JhcHBlZCBtZXRob2QgYmVsb25ncyB0by5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBtZXRob2RcbiAgICAgKiAgICAgICAgVGhlIG1ldGhvZCBiZWluZyB3cmFwcGVkLiBUaGlzIGlzIHVzZWQgYXMgdGhlIHRhcmdldCBvZiB0aGUgUHJveHlcbiAgICAgKiAgICAgICAgb2JqZWN0IHdoaWNoIGlzIGNyZWF0ZWQgdG8gd3JhcCB0aGUgbWV0aG9kLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHdyYXBwZXJcbiAgICAgKiAgICAgICAgVGhlIHdyYXBwZXIgZnVuY3Rpb24gd2hpY2ggaXMgY2FsbGVkIGluIHBsYWNlIG9mIGEgZGlyZWN0IGludm9jYXRpb25cbiAgICAgKiAgICAgICAgb2YgdGhlIHdyYXBwZWQgbWV0aG9kLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1Byb3h5PGZ1bmN0aW9uPn1cbiAgICAgKiAgICAgICAgQSBQcm94eSBvYmplY3QgZm9yIHRoZSBnaXZlbiBtZXRob2QsIHdoaWNoIGludm9rZXMgdGhlIGdpdmVuIHdyYXBwZXJcbiAgICAgKiAgICAgICAgbWV0aG9kIGluIGl0cyBwbGFjZS5cbiAgICAgKi9cbiAgICBjb25zdCB3cmFwTWV0aG9kID0gKHRhcmdldCwgbWV0aG9kLCB3cmFwcGVyKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb3h5KG1ldGhvZCwge1xuICAgICAgICBhcHBseSh0YXJnZXRNZXRob2QsIHRoaXNPYmosIGFyZ3MpIHtcbiAgICAgICAgICByZXR1cm4gd3JhcHBlci5jYWxsKHRoaXNPYmosIHRhcmdldCwgLi4uYXJncyk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgbGV0IGhhc093blByb3BlcnR5ID0gRnVuY3Rpb24uY2FsbC5iaW5kKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpO1xuXG4gICAgLyoqXG4gICAgICogV3JhcHMgYW4gb2JqZWN0IGluIGEgUHJveHkgd2hpY2ggaW50ZXJjZXB0cyBhbmQgd3JhcHMgY2VydGFpbiBtZXRob2RzXG4gICAgICogYmFzZWQgb24gdGhlIGdpdmVuIGB3cmFwcGVyc2AgYW5kIGBtZXRhZGF0YWAgb2JqZWN0cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAgICAgKiAgICAgICAgVGhlIHRhcmdldCBvYmplY3QgdG8gd3JhcC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbd3JhcHBlcnMgPSB7fV1cbiAgICAgKiAgICAgICAgQW4gb2JqZWN0IHRyZWUgY29udGFpbmluZyB3cmFwcGVyIGZ1bmN0aW9ucyBmb3Igc3BlY2lhbCBjYXNlcy4gQW55XG4gICAgICogICAgICAgIGZ1bmN0aW9uIHByZXNlbnQgaW4gdGhpcyBvYmplY3QgdHJlZSBpcyBjYWxsZWQgaW4gcGxhY2Ugb2YgdGhlXG4gICAgICogICAgICAgIG1ldGhvZCBpbiB0aGUgc2FtZSBsb2NhdGlvbiBpbiB0aGUgYHRhcmdldGAgb2JqZWN0IHRyZWUuIFRoZXNlXG4gICAgICogICAgICAgIHdyYXBwZXIgbWV0aG9kcyBhcmUgaW52b2tlZCBhcyBkZXNjcmliZWQgaW4ge0BzZWUgd3JhcE1ldGhvZH0uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW21ldGFkYXRhID0ge31dXG4gICAgICogICAgICAgIEFuIG9iamVjdCB0cmVlIGNvbnRhaW5pbmcgbWV0YWRhdGEgdXNlZCB0byBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlXG4gICAgICogICAgICAgIFByb21pc2UtYmFzZWQgd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFzeW5jaHJvbm91cy4gQW55IGZ1bmN0aW9uIGluXG4gICAgICogICAgICAgIHRoZSBgdGFyZ2V0YCBvYmplY3QgdHJlZSB3aGljaCBoYXMgYSBjb3JyZXNwb25kaW5nIG1ldGFkYXRhIG9iamVjdFxuICAgICAqICAgICAgICBpbiB0aGUgc2FtZSBsb2NhdGlvbiBpbiB0aGUgYG1ldGFkYXRhYCB0cmVlIGlzIHJlcGxhY2VkIHdpdGggYW5cbiAgICAgKiAgICAgICAgYXV0b21hdGljYWxseS1nZW5lcmF0ZWQgd3JhcHBlciBmdW5jdGlvbiwgYXMgZGVzY3JpYmVkIGluXG4gICAgICogICAgICAgIHtAc2VlIHdyYXBBc3luY0Z1bmN0aW9ufVxuICAgICAqXG4gICAgICogQHJldHVybnMge1Byb3h5PG9iamVjdD59XG4gICAgICovXG4gICAgY29uc3Qgd3JhcE9iamVjdCA9ICh0YXJnZXQsIHdyYXBwZXJzID0ge30sIG1ldGFkYXRhID0ge30pID0+IHtcbiAgICAgIGxldCBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICBsZXQgaGFuZGxlcnMgPSB7XG4gICAgICAgIGhhcyhwcm94eVRhcmdldCwgcHJvcCkge1xuICAgICAgICAgIHJldHVybiBwcm9wIGluIHRhcmdldCB8fCBwcm9wIGluIGNhY2hlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldChwcm94eVRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICBpZiAocHJvcCBpbiBjYWNoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3Byb3BdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghKHByb3AgaW4gdGFyZ2V0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbcHJvcF07XG5cbiAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBtZXRob2Qgb24gdGhlIHVuZGVybHlpbmcgb2JqZWN0LiBDaGVjayBpZiB3ZSBuZWVkIHRvIGRvXG4gICAgICAgICAgICAvLyBhbnkgd3JhcHBpbmcuXG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd3JhcHBlcnNbcHJvcF0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAvLyBXZSBoYXZlIGEgc3BlY2lhbC1jYXNlIHdyYXBwZXIgZm9yIHRoaXMgbWV0aG9kLlxuICAgICAgICAgICAgICB2YWx1ZSA9IHdyYXBNZXRob2QodGFyZ2V0LCB0YXJnZXRbcHJvcF0sIHdyYXBwZXJzW3Byb3BdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzT3duUHJvcGVydHkobWV0YWRhdGEsIHByb3ApKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgaXMgYW4gYXN5bmMgbWV0aG9kIHRoYXQgd2UgaGF2ZSBtZXRhZGF0YSBmb3IuIENyZWF0ZSBhXG4gICAgICAgICAgICAgIC8vIFByb21pc2Ugd3JhcHBlciBmb3IgaXQuXG4gICAgICAgICAgICAgIGxldCB3cmFwcGVyID0gd3JhcEFzeW5jRnVuY3Rpb24ocHJvcCwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgICB2YWx1ZSA9IHdyYXBNZXRob2QodGFyZ2V0LCB0YXJnZXRbcHJvcF0sIHdyYXBwZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCB0aGF0IHdlIGRvbid0IGtub3cgb3IgY2FyZSBhYm91dC4gUmV0dXJuIHRoZVxuICAgICAgICAgICAgICAvLyBvcmlnaW5hbCBtZXRob2QsIGJvdW5kIHRvIHRoZSB1bmRlcmx5aW5nIG9iamVjdC5cbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5iaW5kKHRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgICAgICAgICAgIChoYXNPd25Qcm9wZXJ0eSh3cmFwcGVycywgcHJvcCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICBoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgcHJvcCkpKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGlzIGFuIG9iamVjdCB0aGF0IHdlIG5lZWQgdG8gZG8gc29tZSB3cmFwcGluZyBmb3IgdGhlIGNoaWxkcmVuXG4gICAgICAgICAgICAvLyBvZi4gQ3JlYXRlIGEgc3ViLW9iamVjdCB3cmFwcGVyIGZvciBpdCB3aXRoIHRoZSBhcHByb3ByaWF0ZSBjaGlsZFxuICAgICAgICAgICAgLy8gbWV0YWRhdGEuXG4gICAgICAgICAgICB2YWx1ZSA9IHdyYXBPYmplY3QodmFsdWUsIHdyYXBwZXJzW3Byb3BdLCBtZXRhZGF0YVtwcm9wXSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgXCIqXCIpKSB7XG4gICAgICAgICAgICAvLyBXcmFwIGFsbCBwcm9wZXJ0aWVzIGluICogbmFtZXNwYWNlLlxuICAgICAgICAgICAgdmFsdWUgPSB3cmFwT2JqZWN0KHZhbHVlLCB3cmFwcGVyc1twcm9wXSwgbWV0YWRhdGFbXCIqXCJdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gV2UgZG9uJ3QgbmVlZCB0byBkbyBhbnkgd3JhcHBpbmcgZm9yIHRoaXMgcHJvcGVydHksXG4gICAgICAgICAgICAvLyBzbyBqdXN0IGZvcndhcmQgYWxsIGFjY2VzcyB0byB0aGUgdW5kZXJseWluZyBvYmplY3QuXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2FjaGUsIHByb3AsIHtcbiAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wXTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNhY2hlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldChwcm94eVRhcmdldCwgcHJvcCwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgaWYgKHByb3AgaW4gY2FjaGUpIHtcbiAgICAgICAgICAgIGNhY2hlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZWZpbmVQcm9wZXJ0eShwcm94eVRhcmdldCwgcHJvcCwgZGVzYykge1xuICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KGNhY2hlLCBwcm9wLCBkZXNjKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZWxldGVQcm9wZXJ0eShwcm94eVRhcmdldCwgcHJvcCkge1xuICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KGNhY2hlLCBwcm9wKTtcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIC8vIFBlciBjb250cmFjdCBvZiB0aGUgUHJveHkgQVBJLCB0aGUgXCJnZXRcIiBwcm94eSBoYW5kbGVyIG11c3QgcmV0dXJuIHRoZVxuICAgICAgLy8gb3JpZ2luYWwgdmFsdWUgb2YgdGhlIHRhcmdldCBpZiB0aGF0IHZhbHVlIGlzIGRlY2xhcmVkIHJlYWQtb25seSBhbmRcbiAgICAgIC8vIG5vbi1jb25maWd1cmFibGUuIEZvciB0aGlzIHJlYXNvbiwgd2UgY3JlYXRlIGFuIG9iamVjdCB3aXRoIHRoZVxuICAgICAgLy8gcHJvdG90eXBlIHNldCB0byBgdGFyZ2V0YCBpbnN0ZWFkIG9mIHVzaW5nIGB0YXJnZXRgIGRpcmVjdGx5LlxuICAgICAgLy8gT3RoZXJ3aXNlIHdlIGNhbm5vdCByZXR1cm4gYSBjdXN0b20gb2JqZWN0IGZvciBBUElzIHRoYXRcbiAgICAgIC8vIGFyZSBkZWNsYXJlZCByZWFkLW9ubHkgYW5kIG5vbi1jb25maWd1cmFibGUsIHN1Y2ggYXMgYGNocm9tZS5kZXZ0b29sc2AuXG4gICAgICAvL1xuICAgICAgLy8gVGhlIHByb3h5IGhhbmRsZXJzIHRoZW1zZWx2ZXMgd2lsbCBzdGlsbCB1c2UgdGhlIG9yaWdpbmFsIGB0YXJnZXRgXG4gICAgICAvLyBpbnN0ZWFkIG9mIHRoZSBgcHJveHlUYXJnZXRgLCBzbyB0aGF0IHRoZSBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGFyZVxuICAgICAgLy8gZGVyZWZlcmVuY2VkIHZpYSB0aGUgb3JpZ2luYWwgdGFyZ2V0cy5cbiAgICAgIGxldCBwcm94eVRhcmdldCA9IE9iamVjdC5jcmVhdGUodGFyZ2V0KTtcbiAgICAgIHJldHVybiBuZXcgUHJveHkocHJveHlUYXJnZXQsIGhhbmRsZXJzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHNldCBvZiB3cmFwcGVyIGZ1bmN0aW9ucyBmb3IgYW4gZXZlbnQgb2JqZWN0LCB3aGljaCBoYW5kbGVzXG4gICAgICogd3JhcHBpbmcgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRoYXQgdGhvc2UgbWVzc2FnZXMgYXJlIHBhc3NlZC5cbiAgICAgKlxuICAgICAqIEEgc2luZ2xlIHdyYXBwZXIgaXMgY3JlYXRlZCBmb3IgZWFjaCBsaXN0ZW5lciBmdW5jdGlvbiwgYW5kIHN0b3JlZCBpbiBhXG4gICAgICogbWFwLiBTdWJzZXF1ZW50IGNhbGxzIHRvIGBhZGRMaXN0ZW5lcmAsIGBoYXNMaXN0ZW5lcmAsIG9yIGByZW1vdmVMaXN0ZW5lcmBcbiAgICAgKiByZXRyaWV2ZSB0aGUgb3JpZ2luYWwgd3JhcHBlciwgc28gdGhhdCAgYXR0ZW1wdHMgdG8gcmVtb3ZlIGFcbiAgICAgKiBwcmV2aW91c2x5LWFkZGVkIGxpc3RlbmVyIHdvcmsgYXMgZXhwZWN0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0RlZmF1bHRXZWFrTWFwPGZ1bmN0aW9uLCBmdW5jdGlvbj59IHdyYXBwZXJNYXBcbiAgICAgKiAgICAgICAgQSBEZWZhdWx0V2Vha01hcCBvYmplY3Qgd2hpY2ggd2lsbCBjcmVhdGUgdGhlIGFwcHJvcHJpYXRlIHdyYXBwZXJcbiAgICAgKiAgICAgICAgZm9yIGEgZ2l2ZW4gbGlzdGVuZXIgZnVuY3Rpb24gd2hlbiBvbmUgZG9lcyBub3QgZXhpc3QsIGFuZCByZXRyaWV2ZVxuICAgICAqICAgICAgICBhbiBleGlzdGluZyBvbmUgd2hlbiBpdCBkb2VzLlxuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCB3cmFwRXZlbnQgPSB3cmFwcGVyTWFwID0+ICh7XG4gICAgICBhZGRMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyLCAuLi5hcmdzKSB7XG4gICAgICAgIHRhcmdldC5hZGRMaXN0ZW5lcih3cmFwcGVyTWFwLmdldChsaXN0ZW5lciksIC4uLmFyZ3MpO1xuICAgICAgfSxcblxuICAgICAgaGFzTGlzdGVuZXIodGFyZ2V0LCBsaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gdGFyZ2V0Lmhhc0xpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSk7XG4gICAgICB9LFxuXG4gICAgICByZW1vdmVMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHRhcmdldC5yZW1vdmVMaXN0ZW5lcih3cmFwcGVyTWFwLmdldChsaXN0ZW5lcikpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG9uUmVxdWVzdEZpbmlzaGVkV3JhcHBlcnMgPSBuZXcgRGVmYXVsdFdlYWtNYXAobGlzdGVuZXIgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBXcmFwcyBhbiBvblJlcXVlc3RGaW5pc2hlZCBsaXN0ZW5lciBmdW5jdGlvbiBzbyB0aGF0IGl0IHdpbGwgcmV0dXJuIGFcbiAgICAgICAqIGBnZXRDb250ZW50KClgIHByb3BlcnR5IHdoaWNoIHJldHVybnMgYSBgUHJvbWlzZWAgcmF0aGVyIHRoYW4gdXNpbmcgYVxuICAgICAgICogY2FsbGJhY2sgQVBJLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXFcbiAgICAgICAqICAgICAgICBUaGUgSEFSIGVudHJ5IG9iamVjdCByZXByZXNlbnRpbmcgdGhlIG5ldHdvcmsgcmVxdWVzdC5cbiAgICAgICAqL1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIG9uUmVxdWVzdEZpbmlzaGVkKHJlcSkge1xuICAgICAgICBjb25zdCB3cmFwcGVkUmVxID0gd3JhcE9iamVjdChyZXEsIHt9IC8qIHdyYXBwZXJzICovLCB7XG4gICAgICAgICAgZ2V0Q29udGVudDoge1xuICAgICAgICAgICAgbWluQXJnczogMCxcbiAgICAgICAgICAgIG1heEFyZ3M6IDAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxpc3RlbmVyKHdyYXBwZWRSZXEpO1xuICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8vIEtlZXAgdHJhY2sgaWYgdGhlIGRlcHJlY2F0aW9uIHdhcm5pbmcgaGFzIGJlZW4gbG9nZ2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgbGV0IGxvZ2dlZFNlbmRSZXNwb25zZURlcHJlY2F0aW9uV2FybmluZyA9IGZhbHNlO1xuXG4gICAgY29uc3Qgb25NZXNzYWdlV3JhcHBlcnMgPSBuZXcgRGVmYXVsdFdlYWtNYXAobGlzdGVuZXIgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBXcmFwcyBhIG1lc3NhZ2UgbGlzdGVuZXIgZnVuY3Rpb24gc28gdGhhdCBpdCBtYXkgc2VuZCByZXNwb25zZXMgYmFzZWQgb25cbiAgICAgICAqIGl0cyByZXR1cm4gdmFsdWUsIHJhdGhlciB0aGFuIGJ5IHJldHVybmluZyBhIHNlbnRpbmVsIHZhbHVlIGFuZCBjYWxsaW5nIGFcbiAgICAgICAqIGNhbGxiYWNrLiBJZiB0aGUgbGlzdGVuZXIgZnVuY3Rpb24gcmV0dXJucyBhIFByb21pc2UsIHRoZSByZXNwb25zZSBpc1xuICAgICAgICogc2VudCB3aGVuIHRoZSBwcm9taXNlIGVpdGhlciByZXNvbHZlcyBvciByZWplY3RzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7Kn0gbWVzc2FnZVxuICAgICAgICogICAgICAgIFRoZSBtZXNzYWdlIHNlbnQgYnkgdGhlIG90aGVyIGVuZCBvZiB0aGUgY2hhbm5lbC5cbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzZW5kZXJcbiAgICAgICAqICAgICAgICBEZXRhaWxzIGFib3V0IHRoZSBzZW5kZXIgb2YgdGhlIG1lc3NhZ2UuXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCopfSBzZW5kUmVzcG9uc2VcbiAgICAgICAqICAgICAgICBBIGNhbGxiYWNrIHdoaWNoLCB3aGVuIGNhbGxlZCB3aXRoIGFuIGFyYml0cmFyeSBhcmd1bWVudCwgc2VuZHNcbiAgICAgICAqICAgICAgICB0aGF0IHZhbHVlIGFzIGEgcmVzcG9uc2UuXG4gICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgICAqICAgICAgICBUcnVlIGlmIHRoZSB3cmFwcGVkIGxpc3RlbmVyIHJldHVybmVkIGEgUHJvbWlzZSwgd2hpY2ggd2lsbCBsYXRlclxuICAgICAgICogICAgICAgIHlpZWxkIGEgcmVzcG9uc2UuIEZhbHNlIG90aGVyd2lzZS5cbiAgICAgICAqL1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIG9uTWVzc2FnZShtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgICAgICBsZXQgZGlkQ2FsbFNlbmRSZXNwb25zZSA9IGZhbHNlO1xuXG4gICAgICAgIGxldCB3cmFwcGVkU2VuZFJlc3BvbnNlO1xuICAgICAgICBsZXQgc2VuZFJlc3BvbnNlUHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgIHdyYXBwZWRTZW5kUmVzcG9uc2UgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKCFsb2dnZWRTZW5kUmVzcG9uc2VEZXByZWNhdGlvbldhcm5pbmcpIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKFNFTkRfUkVTUE9OU0VfREVQUkVDQVRJT05fV0FSTklORywgbmV3IEVycm9yKCkuc3RhY2spO1xuICAgICAgICAgICAgICBsb2dnZWRTZW5kUmVzcG9uc2VEZXByZWNhdGlvbldhcm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGlkQ2FsbFNlbmRSZXNwb25zZSA9IHRydWU7XG4gICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJlc3VsdCA9IGxpc3RlbmVyKG1lc3NhZ2UsIHNlbmRlciwgd3JhcHBlZFNlbmRSZXNwb25zZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHJlc3VsdCA9IFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpc1Jlc3VsdFRoZW5hYmxlID0gcmVzdWx0ICE9PSB0cnVlICYmIGlzVGhlbmFibGUocmVzdWx0KTtcblxuICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgZGlkbid0IHJldHVybmVkIHRydWUgb3IgYSBQcm9taXNlLCBvciBjYWxsZWRcbiAgICAgICAgLy8gd3JhcHBlZFNlbmRSZXNwb25zZSBzeW5jaHJvbm91c2x5LCB3ZSBjYW4gZXhpdCBlYXJsaWVyXG4gICAgICAgIC8vIGJlY2F1c2UgdGhlcmUgd2lsbCBiZSBubyByZXNwb25zZSBzZW50IGZyb20gdGhpcyBsaXN0ZW5lci5cbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSAmJiAhaXNSZXN1bHRUaGVuYWJsZSAmJiAhZGlkQ2FsbFNlbmRSZXNwb25zZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEEgc21hbGwgaGVscGVyIHRvIHNlbmQgdGhlIG1lc3NhZ2UgaWYgdGhlIHByb21pc2UgcmVzb2x2ZXNcbiAgICAgICAgLy8gYW5kIGFuIGVycm9yIGlmIHRoZSBwcm9taXNlIHJlamVjdHMgKGEgd3JhcHBlZCBzZW5kTWVzc2FnZSBoYXNcbiAgICAgICAgLy8gdG8gdHJhbnNsYXRlIHRoZSBtZXNzYWdlIGludG8gYSByZXNvbHZlZCBwcm9taXNlIG9yIGEgcmVqZWN0ZWRcbiAgICAgICAgLy8gcHJvbWlzZSkuXG4gICAgICAgIGNvbnN0IHNlbmRQcm9taXNlZFJlc3VsdCA9IChwcm9taXNlKSA9PiB7XG4gICAgICAgICAgcHJvbWlzZS50aGVuKG1zZyA9PiB7XG4gICAgICAgICAgICAvLyBzZW5kIHRoZSBtZXNzYWdlIHZhbHVlLlxuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKG1zZyk7XG4gICAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgICAgLy8gU2VuZCBhIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIGVycm9yIGlmIHRoZSByZWplY3RlZCB2YWx1ZVxuICAgICAgICAgICAgLy8gaXMgYW4gaW5zdGFuY2Ugb2YgZXJyb3IsIG9yIHRoZSBvYmplY3QgaXRzZWxmIG90aGVyd2lzZS5cbiAgICAgICAgICAgIGxldCBtZXNzYWdlO1xuICAgICAgICAgICAgaWYgKGVycm9yICYmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yIHx8XG4gICAgICAgICAgICAgICAgdHlwZW9mIGVycm9yLm1lc3NhZ2UgPT09IFwic3RyaW5nXCIpKSB7XG4gICAgICAgICAgICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiQW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnJlZFwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICBfX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X186IHRydWUsXG4gICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgLy8gUHJpbnQgYW4gZXJyb3Igb24gdGhlIGNvbnNvbGUgaWYgdW5hYmxlIHRvIHNlbmQgdGhlIHJlc3BvbnNlLlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBzZW5kIG9uTWVzc2FnZSByZWplY3RlZCByZXBseVwiLCBlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIElmIHRoZSBsaXN0ZW5lciByZXR1cm5lZCBhIFByb21pc2UsIHNlbmQgdGhlIHJlc29sdmVkIHZhbHVlIGFzIGFcbiAgICAgICAgLy8gcmVzdWx0LCBvdGhlcndpc2Ugd2FpdCB0aGUgcHJvbWlzZSByZWxhdGVkIHRvIHRoZSB3cmFwcGVkU2VuZFJlc3BvbnNlXG4gICAgICAgIC8vIGNhbGxiYWNrIHRvIHJlc29sdmUgYW5kIHNlbmQgaXQgYXMgYSByZXNwb25zZS5cbiAgICAgICAgaWYgKGlzUmVzdWx0VGhlbmFibGUpIHtcbiAgICAgICAgICBzZW5kUHJvbWlzZWRSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZW5kUHJvbWlzZWRSZXN1bHQoc2VuZFJlc3BvbnNlUHJvbWlzZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBMZXQgQ2hyb21lIGtub3cgdGhhdCB0aGUgbGlzdGVuZXIgaXMgcmVwbHlpbmcuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHdyYXBwZWRTZW5kTWVzc2FnZUNhbGxiYWNrID0gKHtyZWplY3QsIHJlc29sdmV9LCByZXBseSkgPT4ge1xuICAgICAgaWYgKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgLy8gRGV0ZWN0IHdoZW4gbm9uZSBvZiB0aGUgbGlzdGVuZXJzIHJlcGxpZWQgdG8gdGhlIHNlbmRNZXNzYWdlIGNhbGwgYW5kIHJlc29sdmVcbiAgICAgICAgLy8gdGhlIHByb21pc2UgdG8gdW5kZWZpbmVkIGFzIGluIEZpcmVmb3guXG4gICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS93ZWJleHRlbnNpb24tcG9seWZpbGwvaXNzdWVzLzEzMFxuICAgICAgICBpZiAoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlID09PSBDSFJPTUVfU0VORF9NRVNTQUdFX0NBTExCQUNLX05PX1JFU1BPTlNFX01FU1NBR0UpIHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChyZXBseSAmJiByZXBseS5fX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X18pIHtcbiAgICAgICAgLy8gQ29udmVydCBiYWNrIHRoZSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlcnJvciBpbnRvXG4gICAgICAgIC8vIGFuIEVycm9yIGluc3RhbmNlLlxuICAgICAgICByZWplY3QobmV3IEVycm9yKHJlcGx5Lm1lc3NhZ2UpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUocmVwbHkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCB3cmFwcGVkU2VuZE1lc3NhZ2UgPSAobmFtZSwgbWV0YWRhdGEsIGFwaU5hbWVzcGFjZU9iaiwgLi4uYXJncykgPT4ge1xuICAgICAgaWYgKGFyZ3MubGVuZ3RoIDwgbWV0YWRhdGEubWluQXJncykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IGxlYXN0ICR7bWV0YWRhdGEubWluQXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWluQXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXJncy5sZW5ndGggPiBtZXRhZGF0YS5tYXhBcmdzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYXQgbW9zdCAke21ldGFkYXRhLm1heEFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1heEFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3Qgd3JhcHBlZENiID0gd3JhcHBlZFNlbmRNZXNzYWdlQ2FsbGJhY2suYmluZChudWxsLCB7cmVzb2x2ZSwgcmVqZWN0fSk7XG4gICAgICAgIGFyZ3MucHVzaCh3cmFwcGVkQ2IpO1xuICAgICAgICBhcGlOYW1lc3BhY2VPYmouc2VuZE1lc3NhZ2UoLi4uYXJncyk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc3RhdGljV3JhcHBlcnMgPSB7XG4gICAgICBkZXZ0b29sczoge1xuICAgICAgICBuZXR3b3JrOiB7XG4gICAgICAgICAgb25SZXF1ZXN0RmluaXNoZWQ6IHdyYXBFdmVudChvblJlcXVlc3RGaW5pc2hlZFdyYXBwZXJzKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBydW50aW1lOiB7XG4gICAgICAgIG9uTWVzc2FnZTogd3JhcEV2ZW50KG9uTWVzc2FnZVdyYXBwZXJzKSxcbiAgICAgICAgb25NZXNzYWdlRXh0ZXJuYWw6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgIHNlbmRNZXNzYWdlOiB3cmFwcGVkU2VuZE1lc3NhZ2UuYmluZChudWxsLCBcInNlbmRNZXNzYWdlXCIsIHttaW5BcmdzOiAxLCBtYXhBcmdzOiAzfSksXG4gICAgICB9LFxuICAgICAgdGFiczoge1xuICAgICAgICBzZW5kTWVzc2FnZTogd3JhcHBlZFNlbmRNZXNzYWdlLmJpbmQobnVsbCwgXCJzZW5kTWVzc2FnZVwiLCB7bWluQXJnczogMiwgbWF4QXJnczogM30pLFxuICAgICAgfSxcbiAgICB9O1xuICAgIGNvbnN0IHNldHRpbmdNZXRhZGF0YSA9IHtcbiAgICAgIGNsZWFyOiB7bWluQXJnczogMSwgbWF4QXJnczogMX0sXG4gICAgICBnZXQ6IHttaW5BcmdzOiAxLCBtYXhBcmdzOiAxfSxcbiAgICAgIHNldDoge21pbkFyZ3M6IDEsIG1heEFyZ3M6IDF9LFxuICAgIH07XG4gICAgYXBpTWV0YWRhdGEucHJpdmFjeSA9IHtcbiAgICAgIG5ldHdvcms6IHtcIipcIjogc2V0dGluZ01ldGFkYXRhfSxcbiAgICAgIHNlcnZpY2VzOiB7XCIqXCI6IHNldHRpbmdNZXRhZGF0YX0sXG4gICAgICB3ZWJzaXRlczoge1wiKlwiOiBzZXR0aW5nTWV0YWRhdGF9LFxuICAgIH07XG5cbiAgICByZXR1cm4gd3JhcE9iamVjdChleHRlbnNpb25BUElzLCBzdGF0aWNXcmFwcGVycywgYXBpTWV0YWRhdGEpO1xuICB9O1xuXG4gIGlmICh0eXBlb2YgY2hyb21lICE9IFwib2JqZWN0XCIgfHwgIWNocm9tZSB8fCAhY2hyb21lLnJ1bnRpbWUgfHwgIWNocm9tZS5ydW50aW1lLmlkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBzY3JpcHQgc2hvdWxkIG9ubHkgYmUgbG9hZGVkIGluIGEgYnJvd3NlciBleHRlbnNpb24uXCIpO1xuICB9XG5cbiAgLy8gVGhlIGJ1aWxkIHByb2Nlc3MgYWRkcyBhIFVNRCB3cmFwcGVyIGFyb3VuZCB0aGlzIGZpbGUsIHdoaWNoIG1ha2VzIHRoZVxuICAvLyBgbW9kdWxlYCB2YXJpYWJsZSBhdmFpbGFibGUuXG4gIG1vZHVsZS5leHBvcnRzID0gd3JhcEFQSXMoY2hyb21lKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gYnJvd3Nlcjtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgZXllbydzIFdlYiBFeHRlbnNpb24gQWQgQmxvY2tpbmcgVG9vbGtpdCAoRVdFKSxcbiAqIENvcHlyaWdodCAoQykgMjAwNi1wcmVzZW50IGV5ZW8gR21iSFxuICpcbiAqIEVXRSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhc1xuICogcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24uXG4gKlxuICogRVdFIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBFV0UuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuY29uc3QgRVJST1JfTk9fQ09OTkVDVElPTiA9IFwiQ291bGQgbm90IGVzdGFibGlzaCBjb25uZWN0aW9uLiBcIiArXG4gICAgICBcIlJlY2VpdmluZyBlbmQgZG9lcyBub3QgZXhpc3QuXCI7XG5jb25zdCBFUlJPUl9DTE9TRURfQ09OTkVDVElPTiA9IFwiQSBsaXN0ZW5lciBpbmRpY2F0ZWQgYW4gYXN5bmNocm9ub3VzIFwiICtcbiAgICAgIFwicmVzcG9uc2UgYnkgcmV0dXJuaW5nIHRydWUsIGJ1dCB0aGUgbWVzc2FnZSBjaGFubmVsIGNsb3NlZCBiZWZvcmUgYSBcIiArXG4gICAgICBcInJlc3BvbnNlIHdhcyByZWNlaXZlZFwiO1xuLy8gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTU3ODY5N1xuY29uc3QgRVJST1JfTUFOQUdFUl9ESVNDT05ORUNURUQgPSBcIk1lc3NhZ2UgbWFuYWdlciBkaXNjb25uZWN0ZWRcIjtcblxuLyoqXG4gKiBSZWNvbnN0cnVjdHMgYW4gZXJyb3IgZnJvbSBhIHNlcmlhbGl6YWJsZSBlcnJvciBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZXJyb3JEYXRhIC0gRXJyb3Igb2JqZWN0XG4gKlxuICogQHJldHVybnMge0Vycm9yfSBlcnJvclxuICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbVNlcmlhbGl6YWJsZUVycm9yKGVycm9yRGF0YSkge1xuICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihlcnJvckRhdGEubWVzc2FnZSk7XG4gIGVycm9yLmNhdXNlID0gZXJyb3JEYXRhLmNhdXNlO1xuICBlcnJvci5uYW1lID0gZXJyb3JEYXRhLm5hbWU7XG4gIGVycm9yLnN0YWNrID0gZXJyb3JEYXRhLnN0YWNrO1xuXG4gIHJldHVybiBlcnJvcjtcbn1cblxuLyoqXG4gKiBGaWx0ZXJzIG91dCBgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlYCBlcnJvcnMgdG8gZG8gd2l0aCB0aGUgcmVjZWl2aW5nIGVuZFxuICogbm8gbG9uZ2VyIGV4aXN0aW5nLlxuICpcbiAqIEBwYXJhbSB7UHJvbWlzZX0gcHJvbWlzZSBUaGUgcHJvbWlzZSB0aGF0IHNob3VsZCBoYXZlIFwibm8gY29ubmVjdGlvblwiIGVycm9yc1xuICogICBpZ25vcmVkLiBHZW5lcmFsbHkgdGhpcyB3b3VsZCBiZSB0aGUgcHJvbWlzZSByZXR1cm5lZCBieVxuICogICBgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlYC5cbiAqIEByZXR1cm4ge1Byb21pc2V9IFRoZSBzYW1lIHByb21pc2UsIGJ1dCB3aWxsIHJlc29sdmUgd2l0aCBgdW5kZWZpbmVkYCBpbnN0ZWFkXG4gKiAgIG9mIHJlamVjdGluZyBpZiB0aGUgcmVjZWl2aW5nIGVuZCBubyBsb25nZXIgZXhpc3RzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaWdub3JlTm9Db25uZWN0aW9uRXJyb3IocHJvbWlzZSkge1xuICByZXR1cm4gcHJvbWlzZS5jYXRjaChlcnJvciA9PiB7XG4gICAgaWYgKHR5cGVvZiBlcnJvciA9PSBcIm9iamVjdFwiICYmXG4gICAgICAgIChlcnJvci5tZXNzYWdlID09IEVSUk9SX05PX0NPTk5FQ1RJT04gfHxcbiAgICAgICAgIGVycm9yLm1lc3NhZ2UgPT0gRVJST1JfQ0xPU0VEX0NPTk5FQ1RJT04gfHxcbiAgICAgICAgIGVycm9yLm1lc3NhZ2UgPT0gRVJST1JfTUFOQUdFUl9ESVNDT05ORUNURUQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhyb3cgZXJyb3I7XG4gIH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgc2VyaWFsaXphYmxlIGVycm9yIG9iamVjdCBmcm9tIGdpdmVuIGVycm9yXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgLSBFcnJvclxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHNlcmlhbGl6YWJsZSBlcnJvciBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvU2VyaWFsaXphYmxlRXJyb3IoZXJyb3IpIHtcbiAgcmV0dXJuIHtcbiAgICBjYXVzZTogZXJyb3IuY2F1c2UgaW5zdGFuY2VvZiBFcnJvciA/XG4gICAgICB0b1NlcmlhbGl6YWJsZUVycm9yKGVycm9yLmNhdXNlKSA6XG4gICAgICBlcnJvci5jYXVzZSxcbiAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgIG5hbWU6IGVycm9yLm5hbWUsXG4gICAgc3RhY2s6IGVycm9yLnN0YWNrXG4gIH07XG59XG4iLCIvKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgZXllbydzIFdlYiBFeHRlbnNpb24gQWQgQmxvY2tpbmcgVG9vbGtpdCAoRVdFKSxcbiAqIENvcHlyaWdodCAoQykgMjAwNi1wcmVzZW50IGV5ZW8gR21iSFxuICpcbiAqIEVXRSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhc1xuICogcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24uXG4gKlxuICogRVdFIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBFV0UuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IGJyb3dzZXIgZnJvbSBcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiO1xuaW1wb3J0IHtpZ25vcmVOb0Nvbm5lY3Rpb25FcnJvcn0gZnJvbSBcIi4uL2FsbC9lcnJvcnMuanNcIjtcblxubGV0IGNvbGxhcHNlZFNlbGVjdG9ycyA9IG5ldyBTZXQoKTtcbmxldCBvYnNlcnZlcnMgPSBuZXcgV2Vha01hcCgpO1xuXG5mdW5jdGlvbiBnZXRVUkxGcm9tRWxlbWVudChlbGVtZW50KSB7XG4gIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PSBcIm9iamVjdFwiKSB7XG4gICAgaWYgKGVsZW1lbnQuZGF0YSkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQuZGF0YTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBjaGlsZCBvZiBlbGVtZW50LmNoaWxkcmVuKSB7XG4gICAgICBpZiAoY2hpbGQubG9jYWxOYW1lID09IFwicGFyYW1cIiAmJiBjaGlsZC5uYW1lID09IFwibW92aWVcIiAmJiBjaGlsZC52YWx1ZSkge1xuICAgICAgICByZXR1cm4gbmV3IFVSTChjaGlsZC52YWx1ZSwgZG9jdW1lbnQuYmFzZVVSSSkuaHJlZjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50LmN1cnJlbnRTcmMgfHwgZWxlbWVudC5zcmM7XG59XG5cbmZ1bmN0aW9uIGdldFNlbGVjdG9yRm9yQmxvY2tlZEVsZW1lbnQoZWxlbWVudCkge1xuICAvLyBTZXR0aW5nIHRoZSBcImRpc3BsYXlcIiBDU1MgcHJvcGVydHkgdG8gXCJub25lXCIgZG9lc24ndCBoYXZlIGFueSBlZmZlY3Qgb25cbiAgLy8gPGZyYW1lPiBlbGVtZW50cyAoaW4gZnJhbWVzZXRzKS4gU28gd2UgaGF2ZSB0byBoaWRlIGl0IGlubGluZSB0aHJvdWdoXG4gIC8vIHRoZSBcInZpc2liaWxpdHlcIiBDU1MgcHJvcGVydHkuXG4gIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PSBcImZyYW1lXCIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIElmIHRoZSA8dmlkZW8+IG9yIDxhdWRpbz4gZWxlbWVudCBjb250YWlucyBhbnkgPHNvdXJjZT4gY2hpbGRyZW4sXG4gIC8vIHdlIGNhbm5vdCBhZGRyZXNzIGl0IGluIENTUyBieSB0aGUgc291cmNlIFVSTDsgaW4gdGhhdCBjYXNlIHdlXG4gIC8vIGRvbid0IFwiY29sbGFwc2VcIiBpdCB1c2luZyBhIENTUyBzZWxlY3RvciBidXQgcmF0aGVyIGhpZGUgaXQgZGlyZWN0bHkgYnlcbiAgLy8gc2V0dGluZyB0aGUgc3R5bGU9XCIuLi5cIiBhdHRyaWJ1dGUuXG4gIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PSBcInZpZGVvXCIgfHwgZWxlbWVudC5sb2NhbE5hbWUgPT0gXCJhdWRpb1wiKSB7XG4gICAgZm9yIChsZXQgY2hpbGQgb2YgZWxlbWVudC5jaGlsZHJlbikge1xuICAgICAgaWYgKGNoaWxkLmxvY2FsTmFtZSA9PSBcInNvdXJjZVwiKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGxldCBzZWxlY3RvciA9IFwiXCI7XG4gIGZvciAobGV0IGF0dHIgb2YgW1wic3JjXCIsIFwic3Jjc2V0XCJdKSB7XG4gICAgbGV0IHZhbHVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgaWYgKHZhbHVlICYmIGF0dHIgaW4gZWxlbWVudCkge1xuICAgICAgc2VsZWN0b3IgKz0gXCJbXCIgKyBhdHRyICsgXCI9XCIgKyBDU1MuZXNjYXBlKHZhbHVlKSArIFwiXVwiO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzZWxlY3RvciA/IGVsZW1lbnQubG9jYWxOYW1lICsgc2VsZWN0b3IgOiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGlkZUVsZW1lbnQoZWxlbWVudCwgcHJvcGVydGllcykge1xuICBsZXQge3N0eWxlfSA9IGVsZW1lbnQ7XG5cbiAgaWYgKCFwcm9wZXJ0aWVzKSB7XG4gICAgaWYgKGVsZW1lbnQubG9jYWxOYW1lID09IFwiZnJhbWVcIikge1xuICAgICAgcHJvcGVydGllcyA9IFtbXCJ2aXNpYmlsaXR5XCIsIFwiaGlkZGVuXCJdXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBwcm9wZXJ0aWVzID0gW1tcImRpc3BsYXlcIiwgXCJub25lXCJdXTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2YgcHJvcGVydGllcykge1xuICAgIHN0eWxlLnNldFByb3BlcnR5KGtleSwgdmFsdWUsIFwiaW1wb3J0YW50XCIpO1xuICB9XG5cbiAgaWYgKG9ic2VydmVycy5oYXMoZWxlbWVudCkpIHtcbiAgICBvYnNlcnZlcnMuZ2V0KGVsZW1lbnQpLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIGxldCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2YgcHJvcGVydGllcykge1xuICAgICAgaWYgKHN0eWxlLmdldFByb3BlcnR5VmFsdWUoa2V5KSAhPSB2YWx1ZSB8fFxuICAgICAgICAgIHN0eWxlLmdldFByb3BlcnR5UHJpb3JpdHkoa2V5KSAhPSBcImltcG9ydGFudFwiKSB7XG4gICAgICAgIHN0eWxlLnNldFByb3BlcnR5KGtleSwgdmFsdWUsIFwiaW1wb3J0YW50XCIpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIG9ic2VydmVyLm9ic2VydmUoXG4gICAgZWxlbWVudCwge1xuICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgIGF0dHJpYnV0ZUZpbHRlcjogW1wic3R5bGVcIl1cbiAgICB9XG4gICk7XG4gIG9ic2VydmVycy5zZXQoZWxlbWVudCwgb2JzZXJ2ZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5oaWRlRWxlbWVudChlbGVtZW50KSB7XG4gIGxldCBvYnNlcnZlciA9IG9ic2VydmVycy5nZXQoZWxlbWVudCk7XG4gIGlmIChvYnNlcnZlcikge1xuICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICBvYnNlcnZlcnMuZGVsZXRlKGVsZW1lbnQpO1xuICB9XG5cbiAgbGV0IHByb3BlcnR5ID0gZWxlbWVudC5sb2NhbE5hbWUgPT0gXCJmcmFtZVwiID8gXCJ2aXNpYmlsaXR5XCIgOiBcImRpc3BsYXlcIjtcbiAgZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShwcm9wZXJ0eSk7XG59XG5cbmZ1bmN0aW9uIGNvbGxhcHNlRWxlbWVudChlbGVtZW50KSB7XG4gIGxldCBzZWxlY3RvciA9IGdldFNlbGVjdG9yRm9yQmxvY2tlZEVsZW1lbnQoZWxlbWVudCk7XG4gIGlmICghc2VsZWN0b3IpIHtcbiAgICBoaWRlRWxlbWVudChlbGVtZW50KTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIWNvbGxhcHNlZFNlbGVjdG9ycy5oYXMoc2VsZWN0b3IpKSB7XG4gICAgaWdub3JlTm9Db25uZWN0aW9uRXJyb3IoXG4gICAgICBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiBcImV3ZTppbmplY3QtY3NzXCIsXG4gICAgICAgIHNlbGVjdG9yXG4gICAgICB9KVxuICAgICk7XG4gICAgY29sbGFwc2VkU2VsZWN0b3JzLmFkZChzZWxlY3Rvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGlkZUluQWJvdXRCbGFua0ZyYW1lcyhzZWxlY3RvciwgdXJscykge1xuICAvLyBSZXNvdXJjZXMgKGUuZy4gaW1hZ2VzKSBsb2FkZWQgaW50byBhYm91dDpibGFuayBmcmFtZXNcbiAgLy8gYXJlIChzb21ldGltZXMpIGxvYWRlZCB3aXRoIHRoZSBmcmFtZUlkIG9mIHRoZSBtYWluX2ZyYW1lLlxuICBmb3IgKGxldCBmcmFtZSBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaWZyYW1lW3NyYz0nYWJvdXQ6YmxhbmsnXVwiKSkge1xuICAgIGlmICghZnJhbWUuY29udGVudERvY3VtZW50KSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBlbGVtZW50IG9mIGZyYW1lLmNvbnRlbnREb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSkge1xuICAgICAgLy8gVXNlIGhpZGVFbGVtZW50LCBiZWNhdXNlIHdlIGRvbid0IGhhdmUgdGhlIGNvcnJlY3QgZnJhbWVJZFxuICAgICAgLy8gZm9yIHRoZSBcImV3ZTppbmplY3QtY3NzXCIgbWVzc2FnZS5cbiAgICAgIGlmICh1cmxzLmhhcyhnZXRVUkxGcm9tRWxlbWVudChlbGVtZW50KSkpIHtcbiAgICAgICAgaGlkZUVsZW1lbnQoZWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydEVsZW1lbnRDb2xsYXBzaW5nKCkge1xuICBsZXQgZGVmZXJyZWQgPSBudWxsO1xuXG4gIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1lc3NhZ2UsIHNlbmRlcikgPT4ge1xuICAgIGlmICghbWVzc2FnZSB8fCBtZXNzYWdlLnR5cGUgIT0gXCJld2U6Y29sbGFwc2VcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09IFwibG9hZGluZ1wiKSB7XG4gICAgICBpZiAoIWRlZmVycmVkKSB7XG4gICAgICAgIGRlZmVycmVkID0gbmV3IE1hcCgpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XG4gICAgICAgICAgLy8gVW5kZXIgc29tZSBjb25kaXRpb25zIGEgaG9zdGlsZSBzY3JpcHQgY291bGQgdHJ5IHRvIHRyaWdnZXJcbiAgICAgICAgICAvLyB0aGUgZXZlbnQgYWdhaW4uIFNpbmNlIHdlIHNldCBkZWZlcnJlZCB0byBgbnVsbGAsIHRoZW5cbiAgICAgICAgICAvLyB3ZSBhc3N1bWUgdGhhdCB3ZSBzaG91bGQganVzdCByZXR1cm4gaW5zdGVhZCBvZiB0aHJvd2luZ1xuICAgICAgICAgIC8vIGEgVHlwZUVycm9yLlxuICAgICAgICAgIGlmICghZGVmZXJyZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGxldCBbc2VsZWN0b3IsIHVybHNdIG9mIGRlZmVycmVkKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBlbGVtZW50IG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgIGlmICh1cmxzLmhhcyhnZXRVUkxGcm9tRWxlbWVudChlbGVtZW50KSkpIHtcbiAgICAgICAgICAgICAgICBjb2xsYXBzZUVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaGlkZUluQWJvdXRCbGFua0ZyYW1lcyhzZWxlY3RvciwgdXJscyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGVmZXJyZWQgPSBudWxsO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgbGV0IHVybHMgPSBkZWZlcnJlZC5nZXQobWVzc2FnZS5zZWxlY3RvcikgfHwgbmV3IFNldCgpO1xuICAgICAgZGVmZXJyZWQuc2V0KG1lc3NhZ2Uuc2VsZWN0b3IsIHVybHMpO1xuICAgICAgdXJscy5hZGQobWVzc2FnZS51cmwpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChtZXNzYWdlLnNlbGVjdG9yKSkge1xuICAgICAgICBpZiAoZ2V0VVJMRnJvbUVsZW1lbnQoZWxlbWVudCkgPT0gbWVzc2FnZS51cmwpIHtcbiAgICAgICAgICBjb2xsYXBzZUVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaGlkZUluQWJvdXRCbGFua0ZyYW1lcyhtZXNzYWdlLnNlbGVjdG9yLCBuZXcgU2V0KFttZXNzYWdlLnVybF0pKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcbn1cbiIsIi8qXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBleWVvJ3MgV2ViIEV4dGVuc2lvbiBBZCBCbG9ja2luZyBUb29sa2l0IChFV0UpLFxuICogQ29weXJpZ2h0IChDKSAyMDA2LXByZXNlbnQgZXllbyBHbWJIXG4gKlxuICogRVdFIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzXG4gKiBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBFV0UgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEVXRS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgYnJvd3NlciBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG5pbXBvcnQge2lnbm9yZU5vQ29ubmVjdGlvbkVycm9yfSBmcm9tIFwiLi4vYWxsL2Vycm9ycy5qc1wiO1xuXG5jb25zdCBNQVhfRVJST1JfVEhSRVNIT0xEID0gMzA7XG5jb25zdCBNQVhfUVVFVUVEX0VWRU5UUyA9IDIwO1xuY29uc3QgRVZFTlRfSU5URVJWQUxfTVMgPSAxMDA7XG5cbmxldCBlcnJvckNvdW50ID0gMDtcbmxldCBldmVudFByb2Nlc3NpbmdJbnRlcnZhbCA9IG51bGw7XG5sZXQgZXZlbnRQcm9jZXNzaW5nSW5Qcm9ncmVzcyA9IGZhbHNlO1xubGV0IGV2ZW50UXVldWUgPSBbXTtcblxuZnVuY3Rpb24gaXNFdmVudFRydXN0ZWQoZXZlbnQpIHtcbiAgcmV0dXJuIE9iamVjdC5nZXRQcm90b3R5cGVPZihldmVudCkgPT09IEN1c3RvbUV2ZW50LnByb3RvdHlwZSAmJlxuICAgICFPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChldmVudCwgXCJkZXRhaWxcIik7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGFsbG93bGlzdERvbWFpbihldmVudCkge1xuICBpZiAoIWlzRXZlbnRUcnVzdGVkKGV2ZW50KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBpZ25vcmVOb0Nvbm5lY3Rpb25FcnJvcihcbiAgICBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgdHlwZTogXCJld2U6YWxsb3dsaXN0LXBhZ2VcIixcbiAgICAgIHRpbWVzdGFtcDogZXZlbnQuZGV0YWlsLnRpbWVzdGFtcCxcbiAgICAgIHNpZ25hdHVyZTogZXZlbnQuZGV0YWlsLnNpZ25hdHVyZSxcbiAgICAgIG9wdGlvbnM6IGV2ZW50LmRldGFpbC5vcHRpb25zXG4gICAgfSlcbiAgKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcHJvY2Vzc05leHRFdmVudCgpIHtcbiAgaWYgKGV2ZW50UHJvY2Vzc2luZ0luUHJvZ3Jlc3MpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB0cnkge1xuICAgIGV2ZW50UHJvY2Vzc2luZ0luUHJvZ3Jlc3MgPSB0cnVlO1xuICAgIGxldCBldmVudCA9IGV2ZW50UXVldWUuc2hpZnQoKTtcbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBhbGxvd2xpc3RpbmdSZXN1bHQgPSBhd2FpdCBhbGxvd2xpc3REb21haW4oZXZlbnQpO1xuICAgICAgICBpZiAoYWxsb3dsaXN0aW5nUmVzdWx0ID09PSB0cnVlKSB7XG4gICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJkb21haW5fYWxsb3dsaXN0aW5nX3N1Y2Nlc3NcIikpO1xuICAgICAgICAgIHN0b3BPbmVDbGlja0FsbG93bGlzdGluZygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRvbWFpbiBhbGxvd2xpc3RpbmcgcmVqZWN0ZWRcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9yQ291bnQrKztcbiAgICAgICAgaWYgKGVycm9yQ291bnQgPj0gTUFYX0VSUk9SX1RIUkVTSE9MRCkge1xuICAgICAgICAgIHN0b3BPbmVDbGlja0FsbG93bGlzdGluZygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFldmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgc3RvcFByb2Nlc3NpbmdJbnRlcnZhbCgpO1xuICAgIH1cbiAgfVxuICBmaW5hbGx5IHtcbiAgICBldmVudFByb2Nlc3NpbmdJblByb2dyZXNzID0gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gb25Eb21haW5BbGxvd2xpc3RpbmdSZXF1ZXN0KGV2ZW50KSB7XG4gIGlmIChldmVudFF1ZXVlLmxlbmd0aCA+PSBNQVhfUVVFVUVEX0VWRU5UUykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGV2ZW50UXVldWUucHVzaChldmVudCk7XG4gIHN0YXJ0UHJvY2Vzc2luZ0ludGVydmFsKCk7XG59XG5cbmZ1bmN0aW9uIHN0YXJ0UHJvY2Vzc2luZ0ludGVydmFsKCkge1xuICBpZiAoIWV2ZW50UHJvY2Vzc2luZ0ludGVydmFsKSB7XG4gICAgcHJvY2Vzc05leHRFdmVudCgpO1xuICAgIGV2ZW50UHJvY2Vzc2luZ0ludGVydmFsID0gc2V0SW50ZXJ2YWwocHJvY2Vzc05leHRFdmVudCwgRVZFTlRfSU5URVJWQUxfTVMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHN0b3BQcm9jZXNzaW5nSW50ZXJ2YWwoKSB7XG4gIGNsZWFySW50ZXJ2YWwoZXZlbnRQcm9jZXNzaW5nSW50ZXJ2YWwpO1xuICBldmVudFByb2Nlc3NpbmdJbnRlcnZhbCA9IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdG9wT25lQ2xpY2tBbGxvd2xpc3RpbmcoKSB7XG4gIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkb21haW5fYWxsb3dsaXN0aW5nX3JlcXVlc3RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkRvbWFpbkFsbG93bGlzdGluZ1JlcXVlc3QsIHRydWUpO1xuICBldmVudFF1ZXVlID0gW107XG4gIHN0b3BQcm9jZXNzaW5nSW50ZXJ2YWwoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0T25lQ2xpY2tBbGxvd2xpc3RpbmcoKSB7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkb21haW5fYWxsb3dsaXN0aW5nX3JlcXVlc3RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkRvbWFpbkFsbG93bGlzdGluZ1JlcXVlc3QsIHRydWUpO1xufVxuIiwiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGV5ZW8ncyBXZWIgRXh0ZW5zaW9uIEFkIEJsb2NraW5nIFRvb2xraXQgKEVXRSksXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDYtcHJlc2VudCBleWVvIEdtYkhcbiAqXG4gKiBFV0UgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXNcbiAqIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLlxuICpcbiAqIEVXRSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggRVdFLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCBicm93c2VyIGZyb20gXCJ3ZWJleHRlbnNpb24tcG9seWZpbGxcIjtcbmltcG9ydCB7aWdub3JlTm9Db25uZWN0aW9uRXJyb3J9IGZyb20gXCIuLi9hbGwvZXJyb3JzLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBFbGVtZW50SGlkaW5nVHJhY2VyIHtcbiAgY29uc3RydWN0b3Ioc2VsZWN0b3JzKSB7XG4gICAgdGhpcy5zZWxlY3RvcnMgPSBuZXcgTWFwKHNlbGVjdG9ycyk7XG5cbiAgICB0aGlzLm9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgdGhpcy5vYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudHJhY2UoKSwgMTAwMCk7XG4gICAgfSk7XG5cbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PSBcImxvYWRpbmdcIikge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4gdGhpcy50cmFjZSgpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnRyYWNlKCk7XG4gICAgfVxuICB9XG5cbiAgbG9nKGZpbHRlcnMsIHNlbGVjdG9ycyA9IFtdKSB7XG4gICAgaWdub3JlTm9Db25uZWN0aW9uRXJyb3IoYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKFxuICAgICAge3R5cGU6IFwiZXdlOnRyYWNlLWVsZW0taGlkZVwiLCBmaWx0ZXJzLCBzZWxlY3RvcnN9XG4gICAgKSk7XG4gIH1cblxuICB0cmFjZSgpIHtcbiAgICBsZXQgZmlsdGVycyA9IFtdO1xuICAgIGxldCBzZWxlY3RvcnMgPSBbXTtcblxuICAgIGZvciAobGV0IFtzZWxlY3RvciwgZmlsdGVyXSBvZiB0aGlzLnNlbGVjdG9ycykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RvcnMuZGVsZXRlKHNlbGVjdG9yKTtcbiAgICAgICAgICBpZiAoZmlsdGVyKSB7XG4gICAgICAgICAgICBmaWx0ZXJzLnB1c2goZmlsdGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZWxlY3RvcnMucHVzaChzZWxlY3Rvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGUudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZpbHRlcnMubGVuZ3RoID4gMCB8fCBzZWxlY3RvcnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5sb2coZmlsdGVycywgc2VsZWN0b3JzKTtcbiAgICB9XG5cbiAgICB0aGlzLm9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIHtjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJ0cmVlOiB0cnVlfSk7XG4gIH1cblxuICBkaXNjb25uZWN0KCkge1xuICAgIHRoaXMub2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICB9XG59XG4iLCIvKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgZXllbydzIFdlYiBFeHRlbnNpb24gQWQgQmxvY2tpbmcgVG9vbGtpdCAoRVdFKSxcbiAqIENvcHlyaWdodCAoQykgMjAwNi1wcmVzZW50IGV5ZW8gR21iSFxuICpcbiAqIEVXRSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhc1xuICogcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24uXG4gKlxuICogRVdFIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBFV0UuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IGJyb3dzZXIgZnJvbSBcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiO1xuaW1wb3J0IHtpZ25vcmVOb0Nvbm5lY3Rpb25FcnJvcn0gZnJvbSBcIi4uL2FsbC9lcnJvcnMuanNcIjtcblxuY29uc3QgQUxMT1dFRF9ET01BSU5TID0gbmV3IFNldChbXG4gIFwiYWJwY2hpbmEub3JnXCIsXG4gIFwiYWJwaW5kby5ibG9nc3BvdC5jb21cIixcbiAgXCJhYnB2bi5jb21cIixcbiAgXCJhZGJsb2NrLmVlXCIsXG4gIFwiYWRibG9jay5nYXJkYXIubmV0XCIsXG4gIFwiYWRibG9ja3BsdXMubWVcIixcbiAgXCJhZGJsb2NrcGx1cy5vcmdcIixcbiAgXCJhYnB0ZXN0cGFnZXMub3JnXCIsXG4gIFwiY29tbWVudGNhbWFyY2hlLm5ldFwiLFxuICBcImRyb2l0LWZpbmFuY2VzLmNvbW1lbnRjYW1hcmNoZS5jb21cIixcbiAgXCJlYXN5bGlzdC50b1wiLFxuICBcImV5ZW8uY29tXCIsXG4gIFwiZmFuYm95LmNvLm56XCIsXG4gIFwiZmlsdGVybGlzdHMuY29tXCIsXG4gIFwiZm9ydW1zLmxhbmlrLnVzXCIsXG4gIFwiZ2l0ZWUuY29tXCIsXG4gIFwiZ2l0ZWUuaW9cIixcbiAgXCJnaXRodWIuY29tXCIsXG4gIFwiZ2l0aHViLmlvXCIsXG4gIFwiZ2l0bGFiLmNvbVwiLFxuICBcImdpdGxhYi5pb1wiLFxuICBcImd1cnVkLmVlXCIsXG4gIFwiaHVnb2xlc2NhcmdvdC5jb21cIixcbiAgXCJpLWRvbnQtY2FyZS1hYm91dC1jb29raWVzLmV1XCIsXG4gIFwiam91cm5hbGRlc2ZlbW1lcy5mclwiLFxuICBcImpvdXJuYWxkdW5ldC5jb21cIixcbiAgXCJsaW50ZXJuYXV0ZS5jb21cIixcbiAgXCJzcGFtNDA0LmNvbVwiLFxuICBcInN0YW5ldi5vcmdcIixcbiAgXCJ2b2lkLmdyXCIsXG4gIFwieGZpbGVzLm5vYWRzLml0XCIsXG4gIFwiem9zby5yb1wiXG5dKTtcblxuZnVuY3Rpb24gaXNEb21haW5BbGxvd2VkKGRvbWFpbikge1xuICBpZiAoZG9tYWluLmVuZHNXaXRoKFwiLlwiKSkge1xuICAgIGRvbWFpbiA9IGRvbWFpbi5zdWJzdHJpbmcoMCwgZG9tYWluLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBpZiAoQUxMT1dFRF9ET01BSU5TLmhhcyhkb21haW4pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgbGV0IGluZGV4ID0gZG9tYWluLmluZGV4T2YoXCIuXCIpO1xuICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBkb21haW4gPSBkb21haW4uc3Vic3RyKGluZGV4ICsgMSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1YnNjcmliZUxpbmtzRW5hYmxlZCh1cmwpIHtcbiAgbGV0IHtwcm90b2NvbCwgaG9zdG5hbWV9ID0gbmV3IFVSTCh1cmwpO1xuICByZXR1cm4gaG9zdG5hbWUgPT0gXCJsb2NhbGhvc3RcIiB8fFxuICAgIHByb3RvY29sID09IFwiaHR0cHM6XCIgJiYgaXNEb21haW5BbGxvd2VkKGhvc3RuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZVN1YnNjcmliZUxpbmtzKCkge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZlbnQgPT4ge1xuICAgIGlmIChldmVudC5idXR0b24gPT0gMiB8fCAhZXZlbnQuaXNUcnVzdGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGxpbmsgPSBldmVudC50YXJnZXQ7XG4gICAgd2hpbGUgKCEobGluayBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50KSkge1xuICAgICAgbGluayA9IGxpbmsucGFyZW50Tm9kZTtcblxuICAgICAgaWYgKCFsaW5rKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcXVlcnlTdHJpbmcgPSBudWxsO1xuICAgIGlmIChsaW5rLnByb3RvY29sID09IFwiaHR0cDpcIiB8fCBsaW5rLnByb3RvY29sID09IFwiaHR0cHM6XCIpIHtcbiAgICAgIGlmIChsaW5rLmhvc3QgPT0gXCJzdWJzY3JpYmUuYWRibG9ja3BsdXMub3JnXCIgJiYgbGluay5wYXRobmFtZSA9PSBcIi9cIikge1xuICAgICAgICBxdWVyeVN0cmluZyA9IGxpbmsuc2VhcmNoLnN1YnN0cigxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBGaXJlZm94IGRvZXNuJ3Qgc2VlbSB0byBwb3B1bGF0ZSB0aGUgXCJzZWFyY2hcIiBwcm9wZXJ0eSBmb3JcbiAgICAgIC8vIGxpbmtzIHdpdGggbm9uLXN0YW5kYXJkIFVSTCBzY2hlbWVzIHNvIHdlIG5lZWQgdG8gZXh0cmFjdCB0aGUgcXVlcnlcbiAgICAgIC8vIHN0cmluZyBtYW51YWxseS5cbiAgICAgIGxldCBtYXRjaCA9IC9eYWJwOlxcLypzdWJzY3JpYmVcXC8qXFw/KC4qKS9pLmV4ZWMobGluay5ocmVmKTtcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBxdWVyeVN0cmluZyA9IG1hdGNoWzFdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcXVlcnlTdHJpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdGl0bGUgPSBudWxsO1xuICAgIGxldCB1cmwgPSBudWxsO1xuICAgIGZvciAobGV0IHBhcmFtIG9mIHF1ZXJ5U3RyaW5nLnNwbGl0KFwiJlwiKSkge1xuICAgICAgbGV0IHBhcnRzID0gcGFyYW0uc3BsaXQoXCI9XCIsIDIpO1xuICAgICAgaWYgKHBhcnRzLmxlbmd0aCAhPSAyIHx8ICEvXFxTLy50ZXN0KHBhcnRzWzFdKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHN3aXRjaCAocGFydHNbMF0pIHtcbiAgICAgICAgY2FzZSBcInRpdGxlXCI6XG4gICAgICAgICAgdGl0bGUgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibG9jYXRpb25cIjpcbiAgICAgICAgICB1cmwgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXVybCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGl0bGUpIHtcbiAgICAgIHRpdGxlID0gdXJsO1xuICAgIH1cblxuICAgIHRpdGxlID0gdGl0bGUudHJpbSgpO1xuICAgIHVybCA9IHVybC50cmltKCk7XG4gICAgaWYgKCEvXihodHRwcz98ZnRwKTovLnRlc3QodXJsKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlnbm9yZU5vQ29ubmVjdGlvbkVycm9yKFxuICAgICAgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHt0eXBlOiBcImV3ZTpzdWJzY3JpYmUtbGluay1jbGlja2VkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlLCB1cmx9KVxuICAgICk7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9LCB0cnVlKTtcbn1cbiIsIi8qXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBleWVvJ3MgV2ViIEV4dGVuc2lvbiBBZCBCbG9ja2luZyBUb29sa2l0IChFV0UpLFxuICogQ29weXJpZ2h0IChDKSAyMDA2LXByZXNlbnQgZXllbyBHbWJIXG4gKlxuICogRVdFIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzXG4gKiBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBFV0UgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEVXRS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgYnJvd3NlciBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG5pbXBvcnQge2lnbm9yZU5vQ29ubmVjdGlvbkVycm9yfSBmcm9tIFwiLi4vYWxsL2Vycm9ycy5qc1wiO1xuXG5sZXQgaXNBY3RpdmUgPSBmYWxzZTtcblxuZnVuY3Rpb24gbm90aWZ5QWN0aXZlKCkge1xuICBpZiAoaXNBY3RpdmUpIHtcbiAgICBpZ25vcmVOb0Nvbm5lY3Rpb25FcnJvcihcbiAgICAgIGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgIHR5cGU6IFwiZXdlOmNkcC1zZXNzaW9uLWFjdGl2ZVwiXG4gICAgICB9KVxuICAgICk7XG4gICAgaXNBY3RpdmUgPSBmYWxzZTtcbiAgfVxuICBzY2hlZHVsZUNoZWNrQWN0aXZlKCk7XG59XG5cbmZ1bmN0aW9uIHNjaGVkdWxlQ2hlY2tBY3RpdmUoKSB7XG4gIHNldFRpbWVvdXQobm90aWZ5QWN0aXZlLCAxMDAwKTtcbn1cblxuZnVuY3Rpb24gbWFya0FjdGl2ZSgpIHtcbiAgaXNBY3RpdmUgPSB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnROb3RpZnlBY3RpdmUoKSB7XG4gIHNjaGVkdWxlQ2hlY2tBY3RpdmUoKTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIG1hcmtBY3RpdmUsIHRydWUpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbWFya0FjdGl2ZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBtYXJrQWN0aXZlLCB0cnVlKTtcbn1cbiIsIi8qXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBleWVvJ3MgV2ViIEV4dGVuc2lvbiBBZCBCbG9ja2luZyBUb29sa2l0IChFV0UpLFxuICogQ29weXJpZ2h0IChDKSAyMDA2LXByZXNlbnQgZXllbyBHbWJIXG4gKlxuICogRVdFIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzXG4gKiBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBFV0UgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEVXRS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgYnJvd3NlciBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG5pbXBvcnQge2lnbm9yZU5vQ29ubmVjdGlvbkVycm9yfSBmcm9tIFwiLi4vYWxsL2Vycm9ycy5qc1wiO1xuXG5mdW5jdGlvbiBvbkJUQUFEZXRlY3Rpb25FdmVudChldmVudCkge1xuICBsZXQgaXNBQVBWID0gZXZlbnQuZGV0YWlsLmFiICYmIGV2ZW50LmRldGFpbC5hY2NlcHRhYmxlO1xuICBpZiAoaXNBQVBWKSB7XG4gICAgaWdub3JlTm9Db25uZWN0aW9uRXJyb3IoXG4gICAgICBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiBcImV3ZTpibG9ja3Rocm91Z2gtYWNjZXB0YWJsZS1hZHMtcGFnZS12aWV3XCJcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRXYXRjaGluZ0Jsb2NrdGhyb3VnaFRhZygpIHtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJCVEFBRGV0ZWN0aW9uXCIsIG9uQlRBQURldGVjdGlvbkV2ZW50KTtcbn1cbiIsIi8qXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBleWVvJ3MgV2ViIEV4dGVuc2lvbiBBZCBCbG9ja2luZyBUb29sa2l0IChFV0UpLFxuICogQ29weXJpZ2h0IChDKSAyMDA2LXByZXNlbnQgZXllbyBHbWJIXG4gKlxuICogRVdFIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzXG4gKiBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBFV0UgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEVXRS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgYnJvd3NlciBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG5cbmltcG9ydCB7RWxlbUhpZGVFbXVsYXRpb259XG4gIGZyb20gXCJhZGJsb2NrcGx1c2NvcmUvbGliL2NvbnRlbnQvZWxlbUhpZGVFbXVsYXRpb24uanNcIjtcblxuaW1wb3J0IHtpZ25vcmVOb0Nvbm5lY3Rpb25FcnJvcn0gZnJvbSBcIi4uL2FsbC9lcnJvcnMuanNcIjtcbmltcG9ydCB7c3RhcnRFbGVtZW50Q29sbGFwc2luZywgaGlkZUVsZW1lbnQsIHVuaGlkZUVsZW1lbnR9XG4gIGZyb20gXCIuL2VsZW1lbnQtY29sbGFwc2luZy5qc1wiO1xuaW1wb3J0IHtzdGFydE9uZUNsaWNrQWxsb3dsaXN0aW5nfSBmcm9tIFwiLi9hbGxvd2xpc3RpbmcuanNcIjtcbmltcG9ydCB7RWxlbWVudEhpZGluZ1RyYWNlcn0gZnJvbSBcIi4vZWxlbWVudC1oaWRpbmctdHJhY2VyLmpzXCI7XG5pbXBvcnQge3N1YnNjcmliZUxpbmtzRW5hYmxlZCwgaGFuZGxlU3Vic2NyaWJlTGlua3N9IGZyb20gXCIuL3N1YnNjcmliZS1saW5rcy5qc1wiO1xuaW1wb3J0IHtzdGFydE5vdGlmeUFjdGl2ZX0gZnJvbSBcIi4vY2RwLXNlc3Npb24uanNcIjtcbmltcG9ydCB7c3RhcnRXYXRjaGluZ0Jsb2NrdGhyb3VnaFRhZ30gZnJvbSBcIi4vYmxvY2t0aHJvdWdoLXRhZy5qc1wiO1xuXG5sZXQgdHJhY2VyO1xubGV0IGVsZW1IaWRlRW11bGF0aW9uO1xuXG5hc3luYyBmdW5jdGlvbiBpbml0Q29udGVudEZlYXR1cmVzKCkge1xuICBpZiAoc3Vic2NyaWJlTGlua3NFbmFibGVkKHdpbmRvdy5sb2NhdGlvbi5ocmVmKSkge1xuICAgIGhhbmRsZVN1YnNjcmliZUxpbmtzKCk7XG4gIH1cblxuICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBpZ25vcmVOb0Nvbm5lY3Rpb25FcnJvcihcbiAgICBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe3R5cGU6IFwiZXdlOmNvbnRlbnQtaGVsbG9cIn0pXG4gICk7XG5cbiAgaWYgKHJlc3BvbnNlKSB7XG4gICAgYXdhaXQgYXBwbHlDb250ZW50RmVhdHVyZXMocmVzcG9uc2UpO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZUNvbnRlbnRGZWF0dXJlcygpIHtcbiAgaWYgKHRyYWNlcikge1xuICAgIHRyYWNlci5kaXNjb25uZWN0KCk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gYXBwbHlDb250ZW50RmVhdHVyZXMocmVzcG9uc2UpIHtcbiAgaWYgKHJlc3BvbnNlLnRyYWNlZFNlbGVjdG9ycykge1xuICAgIHRyYWNlciA9IG5ldyBFbGVtZW50SGlkaW5nVHJhY2VyKHJlc3BvbnNlLnRyYWNlZFNlbGVjdG9ycyk7XG4gIH1cblxuICBjb25zdCBoaWRlRWxlbWVudHMgPSAoZWxlbWVudHMsIGZpbHRlcnMpID0+IHtcbiAgICBmb3IgKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICBoaWRlRWxlbWVudChlbGVtZW50LCByZXNwb25zZS5jc3NQcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBpZiAodHJhY2VyKSB7XG4gICAgICB0cmFjZXIubG9nKGZpbHRlcnMpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCB1bmhpZGVFbGVtZW50cyA9IGVsZW1lbnRzID0+IHtcbiAgICBmb3IgKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICB1bmhpZGVFbGVtZW50KGVsZW1lbnQpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCByZW1vdmVFbGVtZW50cyA9IChlbGVtZW50cywgZmlsdGVycykgPT4ge1xuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBlbGVtZW50cykge1xuICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBpZiAodHJhY2VyKSB7XG4gICAgICB0cmFjZXIubG9nKGZpbHRlcnMpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhcHBseUlubGluZUNTUyA9IChlbGVtZW50cywgY3NzUGF0dGVybnMpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gZWxlbWVudHNbaV07XG4gICAgICBjb25zdCBwYXR0ZXJuID0gY3NzUGF0dGVybnNbaV07XG5cbiAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHBhdHRlcm4uY3NzKSkge1xuICAgICAgICBlbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KGtleSwgdmFsdWUsIFwiaW1wb3J0YW50XCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0cmFjZXIpIHtcbiAgICAgIGNvbnN0IGZpbHRlclRleHRzID0gY3NzUGF0dGVybnMubWFwKHBhdHRlcm4gPT4gcGF0dGVybi50ZXh0KTtcbiAgICAgIHRyYWNlci5sb2coZmlsdGVyVGV4dHMpO1xuICAgIH1cbiAgfTtcblxuICBpZiAocmVzcG9uc2UuZW11bGF0ZWRQYXR0ZXJucy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKCFlbGVtSGlkZUVtdWxhdGlvbikge1xuICAgICAgZWxlbUhpZGVFbXVsYXRpb24gPSBuZXcgRWxlbUhpZGVFbXVsYXRpb24oaGlkZUVsZW1lbnRzLCB1bmhpZGVFbGVtZW50cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUVsZW1lbnRzLCBhcHBseUlubGluZUNTUyk7XG4gICAgfVxuICAgIGVsZW1IaWRlRW11bGF0aW9uLmFwcGx5KHJlc3BvbnNlLmVtdWxhdGVkUGF0dGVybnMpO1xuICB9XG4gIGVsc2UgaWYgKGVsZW1IaWRlRW11bGF0aW9uKSB7XG4gICAgZWxlbUhpZGVFbXVsYXRpb24uYXBwbHkocmVzcG9uc2UuZW11bGF0ZWRQYXR0ZXJucyk7XG4gIH1cblxuICBpZiAocmVzcG9uc2Uubm90aWZ5QWN0aXZlKSB7XG4gICAgc3RhcnROb3RpZnlBY3RpdmUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBvbk1lc3NhZ2UobWVzc2FnZSkge1xuICBpZiAodHlwZW9mIG1lc3NhZ2UgPT0gXCJvYmplY3RcIiAmJiBtZXNzYWdlICE9IG51bGwgJiZcbiAgICBtZXNzYWdlLnR5cGUgJiYgbWVzc2FnZS50eXBlID09IFwiZXdlOmFwcGx5LWNvbnRlbnQtZmVhdHVyZXNcIikge1xuICAgIHJlbW92ZUNvbnRlbnRGZWF0dXJlcygpO1xuICAgIGFwcGx5Q29udGVudEZlYXR1cmVzKG1lc3NhZ2UpO1xuICB9XG59XG5icm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKG9uTWVzc2FnZSk7XG5cbnN0YXJ0RWxlbWVudENvbGxhcHNpbmcoKTtcbnN0YXJ0T25lQ2xpY2tBbGxvd2xpc3RpbmcoKTtcbmluaXRDb250ZW50RmVhdHVyZXMoKTtcbnN0YXJ0V2F0Y2hpbmdCbG9ja3Rocm91Z2hUYWcoKTtcbiJdLCJuYW1lcyI6WyJicm93c2VyIiwiT2JqZWN0IiwiZ2V0UHJvdG90eXBlT2YiLCJwcm90b3R5cGUiLCJDSFJPTUVfU0VORF9NRVNTQUdFX0NBTExCQUNLX05PX1JFU1BPTlNFX01FU1NBR0UiLCJTRU5EX1JFU1BPTlNFX0RFUFJFQ0FUSU9OX1dBUk5JTkciLCJ3cmFwQVBJcyIsImV4dGVuc2lvbkFQSXMiLCJhcGlNZXRhZGF0YSIsImtleXMiLCJsZW5ndGgiLCJFcnJvciIsIkRlZmF1bHRXZWFrTWFwIiwiV2Vha01hcCIsImNvbnN0cnVjdG9yIiwiY3JlYXRlSXRlbSIsIml0ZW1zIiwidW5kZWZpbmVkIiwiZ2V0Iiwia2V5IiwiaGFzIiwic2V0IiwiaXNUaGVuYWJsZSIsInZhbHVlIiwidGhlbiIsIm1ha2VDYWxsYmFjayIsInByb21pc2UiLCJtZXRhZGF0YSIsImNhbGxiYWNrQXJncyIsInJ1bnRpbWUiLCJsYXN0RXJyb3IiLCJyZWplY3QiLCJtZXNzYWdlIiwic2luZ2xlQ2FsbGJhY2tBcmciLCJyZXNvbHZlIiwicGx1cmFsaXplQXJndW1lbnRzIiwibnVtQXJncyIsIndyYXBBc3luY0Z1bmN0aW9uIiwibmFtZSIsImFzeW5jRnVuY3Rpb25XcmFwcGVyIiwidGFyZ2V0IiwiYXJncyIsIm1pbkFyZ3MiLCJtYXhBcmdzIiwiUHJvbWlzZSIsImZhbGxiYWNrVG9Ob0NhbGxiYWNrIiwiY2JFcnJvciIsImNvbnNvbGUiLCJ3YXJuIiwibm9DYWxsYmFjayIsIndyYXBNZXRob2QiLCJtZXRob2QiLCJ3cmFwcGVyIiwiUHJveHkiLCJhcHBseSIsInRhcmdldE1ldGhvZCIsInRoaXNPYmoiLCJjYWxsIiwiaGFzT3duUHJvcGVydHkiLCJGdW5jdGlvbiIsImJpbmQiLCJ3cmFwT2JqZWN0Iiwid3JhcHBlcnMiLCJjYWNoZSIsImNyZWF0ZSIsImhhbmRsZXJzIiwicHJveHlUYXJnZXQiLCJwcm9wIiwicmVjZWl2ZXIiLCJkZWZpbmVQcm9wZXJ0eSIsImNvbmZpZ3VyYWJsZSIsImVudW1lcmFibGUiLCJkZXNjIiwiUmVmbGVjdCIsImRlbGV0ZVByb3BlcnR5Iiwid3JhcEV2ZW50Iiwid3JhcHBlck1hcCIsImFkZExpc3RlbmVyIiwibGlzdGVuZXIiLCJoYXNMaXN0ZW5lciIsInJlbW92ZUxpc3RlbmVyIiwib25SZXF1ZXN0RmluaXNoZWRXcmFwcGVycyIsIm9uUmVxdWVzdEZpbmlzaGVkIiwicmVxIiwid3JhcHBlZFJlcSIsImdldENvbnRlbnQiLCJsb2dnZWRTZW5kUmVzcG9uc2VEZXByZWNhdGlvbldhcm5pbmciLCJvbk1lc3NhZ2VXcmFwcGVycyIsIm9uTWVzc2FnZSIsInNlbmRlciIsInNlbmRSZXNwb25zZSIsImRpZENhbGxTZW5kUmVzcG9uc2UiLCJ3cmFwcGVkU2VuZFJlc3BvbnNlIiwic2VuZFJlc3BvbnNlUHJvbWlzZSIsInJlc3BvbnNlIiwic3RhY2siLCJyZXN1bHQiLCJlcnIiLCJpc1Jlc3VsdFRoZW5hYmxlIiwic2VuZFByb21pc2VkUmVzdWx0IiwibXNnIiwiZXJyb3IiLCJfX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X18iLCJjYXRjaCIsIndyYXBwZWRTZW5kTWVzc2FnZUNhbGxiYWNrIiwicmVwbHkiLCJ3cmFwcGVkU2VuZE1lc3NhZ2UiLCJhcGlOYW1lc3BhY2VPYmoiLCJ3cmFwcGVkQ2IiLCJwdXNoIiwic2VuZE1lc3NhZ2UiLCJzdGF0aWNXcmFwcGVycyIsImRldnRvb2xzIiwibmV0d29yayIsIm9uTWVzc2FnZUV4dGVybmFsIiwidGFicyIsInNldHRpbmdNZXRhZGF0YSIsImNsZWFyIiwicHJpdmFjeSIsInNlcnZpY2VzIiwid2Vic2l0ZXMiLCJjaHJvbWUiLCJpZCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlUm9vdCI6IiJ9