/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
  'use strict';

  /**
   * Class constructor for select dropdown MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   * @param {HTMLElement} element The element that will be upgraded.
   */
  var MaterialSelectfield = function(element) {

    this.element_ = element;

    this.init();
  };
  window.MaterialSelectfield = MaterialSelectfield;

  /**
   * Store constants in one place so they can be updated easily.
   * @enum {string | number}
   * @private
   */
  MaterialSelectfield.prototype.Constant_ = {
    // None for now.
  };

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   * @enum {string}
   * @private
   */
  MaterialSelectfield.prototype.CssClasses_ = {
    SELECT: 'mdl-selectfield__select',
    LABEL: 'mdl-textfield__label',
    IS_DIRTY: 'is-dirty',
    IS_FOCUSED: 'is-focused',
    IS_DISABLED: 'is-disabled',
    IS_INVALID: 'is-invalid',
    IS_UPGRADED: 'is-upgraded'
  };

  /**
   * Handle class updates.
   *
   * @private
   */
  MaterialSelectfield.prototype.updateClasses_ = function() {
    this.checkDisabled();
    this.checkValidity();
    this.checkDirty();
  };

  /**
   * Check the disabled state and update field accordingly.
   *
   * @public
   */
  MaterialSelectfield.prototype.checkDisabled = function() {
    if (this.select_.disabled) {
      this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
  };

  /**
   * Check the validity state and update field accordingly.
   *
   * @public
   */
  MaterialSelectfield.prototype.checkValidity = function() {
    if (this.select_.validity.valid) {
      this.element_.classList.remove(this.CssClasses_.IS_INVALID);
    } else {
      this.element_.classList.add(this.CssClasses_.IS_INVALID);
    }
  };

  /**
   * Check the dirty state and update field accordingly.
   *
   * @public
   */
  MaterialSelectfield.prototype.checkDirty = function() {
    if (this.select_.value && this.select_.value.length > 0) {
      this.element_.classList.add(this.CssClasses_.IS_DIRTY);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
    }
  };

  /**
   * Disable text field.
   *
   * @public
   */
  MaterialSelectfield.prototype.disable = function() {
    this.select_.disabled = true;
    this.updateClasses_();
  };

  /**
   * Enable text field.
   *
   * @public
   */
  MaterialSelectfield.prototype.enable = function() {
    this.select_.disabled = false;
    this.updateClasses_();
  };

  /**
   * Fire change event on selection
   *
   * @public
   */
  MaterialSelectfield.prototype.fireChange = function() {
    var evt;
    if (document.createEventObject) {
      evt = document.createEventObject();
      return this.select_.fireEvent('onchange', evt);
    } else {
      evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      return !this.select_.dispatchEvent(evt);
    }
  };

  /**
   * Initialize element.
   */
  MaterialSelectfield.prototype.init = function() {

    if (this.element_) {
      this.select_ = this.element_.querySelector('.' + this.CssClasses_.SELECT);

      // create button to trigger the menu
      this.button_ = document.createElement('a');
      this.button_.classList.add('mdl-select__button');
      this.button_.classList.add('mdl-button');
      this.button_.classList.add('mdl-js-button');
      //this.button_.innerHTML = this.select_.value;
      this.button_.addEventListener('click', this.clickMenu_.bind(this));

      // create menu
      this.menu_ = document.createElement('ul');
      this.menu_.classList.add('mdl-select__menu');
      this.menu_.classList.add('mdl-menu');
      this.menu_.classList.add('mdl-menu--bottom-left');
      this.menu_.classList.add('mdl-js-menu');
      this.menu_.classList.add('mdl-js-ripple-effect');

      var options = this.select_.querySelectorAll('option');
      for (var i = 0; i < options.length; i++) {
        var menuItem = document.createElement('li');
        menuItem.classList.add('mdl-menu__item');
        // menuItem.setAttribute('value', options[i].getAttribute('value'));
        menuItem.innerHTML = options[i].innerHTML;
        if (options[i].value === this.select_.value) {
          this.button_.innerHTML = options[i].innerHTML;
        }
        menuItem.addEventListener('click', this.clickMenuItem_.bind(this));
        this.menu_.appendChild(menuItem);
      }

      this.element_.appendChild(this.button_);
      this.element_.appendChild(this.menu_);

      componentHandler.upgradeElement(this.menu_, 'MaterialMenu');

      this.updateClasses_();
      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Handle click on menu
   */
  MaterialSelectfield.prototype.clickMenu_ = function() {
    if (!this.select_.disabled) {
      this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
      this.menu_.MaterialMenu.toggle();
    }
  };

  /**
   * Handle menu item selection event
   * @param event
   */
  MaterialSelectfield.prototype.clickMenuItem_ = function(event) {

    // change select to point to selected item (change index to index of menuItem inside menu)
    this.select_.selectedIndex = Array.prototype.indexOf.call(event.target.parentElement.childNodes, event.target);

    // get the option that has been chosen from our original select
    var option = this.select_.options[this.select_.selectedIndex];

    // set the buton text to the text of the selected option
    this.button_.innerHTML = option.innerHTML;
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);

    this.updateClasses_();

    this.fireChange();
  };

  /**
   * Downgrade the component
   *
   * @private
   */
  MaterialSelectfield.prototype.mdlDowngrade_ = function() {
    componentHandler.downgradeElements(this.menu_);
    this.button_.removeEventListener('click', this.clickMenu_.bind(this));
    this.element_.removeChild(this.menu_.parentNode);
    this.button_.parentNode.removeChild(this.button_);
  };

  // The component registers itself. It can assume componentHandler is
  // available in the global scope.
  componentHandler.register({
    constructor: MaterialSelectfield,
    classAsString: 'MaterialSelectfield',
    cssClass: 'mdl-js-selectfield',
    widget: true
  });
})();
