const MultiSelect = require('./MultiSelect')

document
  .querySelectorAll('[data-multi-select]')
  .forEach((element) => new MultiSelect(element))
