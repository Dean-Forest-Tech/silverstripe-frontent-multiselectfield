/*
 * Created by David Adams
 * https://codeshack.io/multi-select-dropdown-html-javascript/
 *
 * Released under the MIT license
 */
class MultiSelect {
  constructor(element, options = {}) {
    const defaults = {
      placeholder: 'Select item(s)',
      max: null,
      search: true,
      selectAll: true,
      listAll: true,
      closeListOnItemSelect: false,
      name: '',
      width: '',
      height: '',
      dropdownWidth: '',
      dropdownHeight: '',
      data: [],
      onChange() {},
      onSelect() {},
      onUnselect() {},
    }

    this.options = Object.assign(defaults, options)
    this.selectElement = element

    if (typeof element === 'string') {
      this.selectElement = document.querySelector(element)
    }

    Object
      .entries(this.selectElement.dataset)
      .forEach(([prop]) => {
        if (this.options[prop] !== undefined) {
          this.options[prop] = this.selectElement.dataset[prop]
        }
      })

    this.name = 'multi-select-' + Math.floor(Math.random() * 1000000)

    if (this.selectElement.getAttribute('name')) {
      this.name = this
        .selectElement
        .getAttribute('name')
    }

    if (!this.options.data.length) {
      const curOptions = this
        .selectElement
        .querySelectorAll('option')

      for (let i = 0; i < curOptions.length; i += 1) {
        this.options.data.push({
          value: curOptions[i].value,
          text: curOptions[i].innerHTML,
          selected: curOptions[i].selected,
          html: curOptions[i].getAttribute('data-html'),
        })
      }
    }

    this.element = this.template()
    this.selectElement.replaceWith(this.element)
    this.updateSelected()
    this.eventHandlers()
  }

  template() {
    let optionsHTML = ''

    for (let i = 0; i < this.data.length; i += 1) {
      let selected = ''

      if (this.selectedValues.includes(this.data[i].value)) {
        selected = ' multi-select-selected'
      }

      optionsHTML += `
        <div
          class="multi-select-option${selected}"
          data-value="${this.data[i].value}"
        >
          <span class="multi-select-option-radio"></span>
          <span class="multi-select-option-text">
            ${this.data[i].html ? this.data[i].html : this.data[i].text}
          </span>
        </div>
      `
    }

    let selectAllHTML = ''

    if (this.options.selectAll === true || this.options.selectAll === 'true') {
      selectAllHTML = `<div class="multi-select-all">
                <span class="multi-select-option-radio"></span>
                <span class="multi-select-option-text">Select all</span>
            </div>`
    }

    const width = this.width ? 'width:' + this.width + ';' : ''
    const height = this.height ? 'height:' + this.height + ';' : ''

    let elID = ''
    let dropWidth = ''
    let dropHeight = ''
    let searchInput = ''

    if (this.selectElement.id) {
      elID = ' id="' + this.selectElement.id + '"'
    }

    if (this.options.dropdownWidth) {
      dropWidth = 'width:' + this.options.dropdownWidth + ';'
    }

    if (this.options.dropdownHeight) {
      dropHeight = 'height:' + this.options.dropdownHeight + ';'
    }

    if (this.options.search === true || this.options.search === 'true') {
      searchInput = `<input
        type="text"
        class="multi-select-search"
        placeholder="Search...">`
    }

    const selectedValues = this
      .selectedValues
      .map((value) => {
        const { name } = this
        return '<input type="hidden" name="' + name + '" value="' + value + '">'
      }).join('')

    let maxOptions = ''

    if (this.options.max) {
      maxOptions = this.selectedValues.length + '/' + this.options.max
    }

    const template = `
      <div class="multi-select ${this.name}" style="${width}${height}"${elID}>
        ${selectedValues}
        <div class="multi-select-header" style="${width}${height}">
          <span class="multi-select-header-max">
            ${maxOptions}
          </span>
          <span class="multi-select-header-placeholder">
            ${this.placeholder}
          </span>
        </div>
        <div class="multi-select-options" style="${dropWidth}${dropHeight}">
          ${searchInput}
          ${selectAllHTML}
          ${optionsHTML}
        </div>
      </div>
    `
    const element = document.createElement('div')
    element.innerHTML = template

    return element
  }

  eventHandlers() {
    const headerElement = this
      .element
      .querySelector('.multi-select-header')

    this
      .element
      .querySelectorAll('.multi-select-option')
      .forEach((option) => {
        option.onclick = () => {
          let selected = true

          if (!option.classList.contains('multi-select-selected')) {
            if (this.options.max
              && this.selectedValues.length >= this.options.max
            ) {
              return
            }

            option
              .classList
              .add('multi-select-selected')

            if (this.options.listAll === true
              || this.options.listAll === 'true'
            ) {
              if (this.element.querySelector('.multi-select-header-option')) {
                const opt = Array
                  .from(
                    this
                      .element
                      .querySelectorAll('.multi-select-header-option'),
                  ).pop()

                const newHTML = option
                  .querySelector('.multi-select-option-text')
                  .innerHTML

                opt.insertAdjacentHTML(
                  'afterend',
                  `<span
                    class="multi-select-header-option"
                    data-value="${option.dataset.value}"
                    >${newHTML}
                  </span>`,
                )
              } else {
                const newHTML = option
                  .querySelector('.multi-select-option-text')
                  .innerHTML

                headerElement.insertAdjacentHTML(
                  'afterbegin',
                  `<span
                    class="multi-select-header-option"
                    data-value="${option.dataset.value}">
                    ${newHTML}
                  </span>`,
                )
              }
            }
            this
              .element
              .querySelector('.multi-select')
              .insertAdjacentHTML(
                'afterbegin',
                `<input
                type="hidden"
                name="${this.name}[]"
                value="${option.dataset.value}">`,
              )

            this
              .data
              .filter((data) => data.value === option.dataset.value)[0]
              .selected = true
          } else {
            option
              .classList
              .remove('multi-select-selected')

            this
              .element
              .querySelectorAll('.multi-select-header-option')
              .forEach((headerOption) => {
                if (headerOption.dataset.value === option.dataset.value) {
                  headerOption.remove()
                }
              })

            this
              .element
              .querySelector(`input[value="${option.dataset.value}"]`)
              .remove()

            this
              .data
              .filter((data) => data.value === option.dataset.value)[0]
              .selected = false

            selected = false
          }

          if (this.options.listAll === false
          || this.options.listAll === 'false'
          ) {
            if (this.element.querySelector('.multi-select-header-option')) {
              this
                .element
                .querySelector('.multi-select-header-option')
                .remove()
            }

            headerElement.insertAdjacentHTML(
              'afterbegin',
              `<span class="multi-select-header-option">
              ${this.selectedValues.length} selected
            </span>`,
            )
          }

          if (!this.element.querySelector('.multi-select-header-option')) {
            headerElement.insertAdjacentHTML(
              'afterbegin',
              `<span class="multi-select-header-placeholder">
              ${this.placeholder}
            </span>`,
            )
          } else if (
            this
              .element
              .querySelector('.multi-select-header-placeholder')
          ) {
            this
              .element
              .querySelector('.multi-select-header-placeholder')
              .remove()
          }

          if (this.options.max) {
            const selectedLen = this.selectedValues.length
            const selectedMax = this.options.max

            this
              .element
              .querySelector('.multi-select-header-max')
              .innerHTML = selectedLen + '/' + selectedMax
          }

          if (this.options.search === true || this.options.search === 'true') {
            this
              .element
              .querySelector('.multi-select-search').value = ''
          }

          this
            .element
            .querySelectorAll('.multi-select-option')
            .forEach((element) => { element.style.display = 'flex' })

          if (this.options.closeListOnItemSelect === true
            || this.options.closeListOnItemSelect === 'true'
          ) {
            headerElement
              .classList
              .remove('multi-select-header-active')
          }

          this
            .options
            .onChange(
              option.dataset.value,
              option.querySelector('.multi-select-option-text').innerHTML,
              option,
            )

          if (selected) {
            this
              .options
              .onSelect(
                option.dataset.value,
                option.querySelector('.multi-select-option-text').innerHTML,
                option,
              )
          } else {
            this
              .options
              .onUnselect(
                option.dataset.value,
                option.querySelector('.multi-select-option-text').innerHTML,
                option,
              )
          }
        }
      })

    headerElement.onclick = () => {
      headerElement
        .classList
        .toggle('multi-select-header-active')
    }

    if (this.options.search === true || this.options.search === 'true') {
      const search = this
        .element
        .querySelector('.multi-select-search')

      search.oninput = () => {
        this
          .element
          .querySelectorAll('.multi-select-option')
          .forEach((option) => {
            const currValue = option
              .querySelector('.multi-select-option-text')
              .innerHTML
              .toLowerCase()
              .indexOf(search.value.toLowerCase())

            option
              .style
              .display = currValue > -1 ? 'flex' : 'none'
          })
      }
    }
    if (this.options.selectAll === true || this.options.selectAll === 'true') {
      const selectAllButton = this
        .element
        .querySelector('.multi-select-all')

      selectAllButton.onclick = () => {
        const allSelected = selectAllButton
          .classList
          .contains('multi-select-selected')

        this
          .element
          .querySelectorAll('.multi-select-option')
          .forEach((option) => {
            const dataItem = this
              .data
              .find((data) => data.value === option.dataset.value)

            if (dataItem
              && (
                (allSelected && dataItem.selected)
                || (!allSelected && !dataItem.selected)
              )
            ) {
              option.click()
            }
          })
        selectAllButton.classList.toggle('multi-select-selected')
      }
    }

    if (this.selectElement.id
      && document.querySelector('label[for="' + this.selectElement.id + '"]')
    ) {
      document
        .querySelector('label[for="' + this.selectElement.id + '"]')
        .onclick = () => {
          headerElement
            .classList
            .toggle('multi-select-header-active')
        }
    }
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.' + this.name)
        && !event.target.closest('label[for="' + this.selectElement.id + '"]')
      ) {
        headerElement
          .classList
          .remove('multi-select-header-active')
      }
    })
  }

  updateSelected() {
    if (this.options.listAll === true || this.options.listAll === 'true') {
      this
        .element
        .querySelectorAll('.multi-select-option')
        .forEach((option) => {
          if (option.classList.contains('multi-select-selected')) {
            const html = option
              .querySelector('.multi-select-option-text')
              .innerHTML

            this
              .element
              .querySelector('.multi-select-header')
              .insertAdjacentHTML(
                'afterbegin',
                `<span
                      class="multi-select-header-option"
                      data-value="${option.dataset.value}"
                    >${html}</span>`,
              )
          }
        })
    } else if (this.selectedValues.length > 0) {
      this
        .element
        .querySelector('.multi-select-header')
        .insertAdjacentHTML(
          'afterbegin',
          `<span class="multi-select-header-option">
                ${this.selectedValues.length} selected
                </span>`,
        )
    }

    if (this.element.querySelector('.multi-select-header-option')) {
      this
        .element
        .querySelector('.multi-select-header-placeholder')
        .remove()
    }
  }

  get selectedValues() {
    return this.data.filter((data) => data.selected).map((data) => data.value)
  }

  get selectedItems() {
    return this.data.filter((data) => data.selected)
  }

  set data(value) {
    this.options.data = value
  }

  get data() {
    return this.options.data
  }

  set selectElement(value) {
    this.options.selectElement = value
  }

  get selectElement() {
    return this.options.selectElement
  }

  set element(value) {
    this.options.element = value
  }

  get element() {
    return this.options.element
  }

  set placeholder(value) {
    this.options.placeholder = value
  }

  get placeholder() {
    return this.options.placeholder
  }

  set name(value) {
    this.options.name = value
  }

  get name() {
    return this.options.name
  }

  set width(value) {
    this.options.width = value
  }

  get width() {
    return this.options.width
  }

  set height(value) {
    this.options.height = value
  }

  get height() {
    return this.options.height
  }
}

module.exports = MultiSelect
