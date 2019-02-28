import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BustabitScriptConfig extends Component {
  constructor (props) {
    super(props)
    this.handleConfigFieldChange = this.handleConfigFieldChange.bind(this)
  }

  handleConfigFieldChange (key, value) {
    let path = key.split('.')

    let obj = this.props.config
    for (let i = 0; i<path.length; i++) {
      obj = obj[path[i]]
    }
    obj.value = value
    this.props.onChange(this.props.config)
  }

  render () {
    const { config, onChange, className = '', ...rest } = this.props
    return (
      <div {...rest} className={`BustabitScript Config ${className}`}>
        {!config ? null : Object.keys(config).map((key) => {
          let element = config[key]
          let component = FieldTypes[element.type]
          return component({
            ...element,
            name: key,
            onChange: this.handleConfigFieldChange
          })
        })}
      </div>
    )
  }
}

BustabitScriptConfig.propTypes = {
  config: PropTypes.object,
  onChange: PropTypes.func.isRequired,
}

const FieldTypes = Object.freeze({
  'balance': BalanceInput,
  'checkbox': CheckboxInput,
  'multiplier': MultiplierInput,
  'noop': NoopInput,
  'radio': RadioInput,
  'text': TextInput,
});

function BalanceInput ({ name, label, value, optional, onChange }) {
  let id = `config.${name}`
  return (
    <div className="field is-horizontal" key={id}>
      <div className="field-label is-normal">
        <label htmlFor={id} className="label">{label || name}</label>
      </div>
      <div className="field-body">
        <div className="field">
          <div className="control has-icons-right">
            <input  type="number"
                    className="input is-normal"
                    id={id}
                    name={name}
                    value={parseFloat(value)/100}
                    required={!optional}
                    step="1"
                    onChange={function (eventInfo) {
                      onChange(name, parseFloat(eventInfo.target.value) * 100)
                    }}/>
            <span className="icon is-small is-right">
              bits
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckboxInput ({ name, label, value, onChange }) {
  let id = `config.${name}`
  return (
    <div className="field is-horizontal" key={id}>
      <div className="field-label is-normal">
        <label htmlFor={id} className="label">{label || name}</label>
      </div>
      <div className="field-body">
        <div className="field">
          <div className="control">
            <input  type="checkbox"
                    className="checkbox"
                    id={id}
                    name={name}
                    checked={!!value}
                    onChange={function (eventInfo) {
                      onChange(name, !!eventInfo.target.checked)
                    }}/>
          </div>
        </div>
      </div>
    </div>
  )
}

function MultiplierInput ({ name, label, value, optional, onChange }) {
  let id = `config.${name}`
  return (
    <div className="field is-horizontal" key={id}>
      <div className="field-label is-normal">
        <label htmlFor={id} className="label">{label || name}</label>
      </div>
      <div className="field-body">
        <div className="field">
          <div className="control has-icons-right">
            <input  type="number"
                    className="input"
                    id={id}
                    name={name}
                    value={parseFloat(value)}
                    required={!optional}
                    step="0.01"
                    onChange={function (eventInfo) {
                      onChange(name, parseFloat(eventInfo.target.value))
                    }}/>
            <span className="icon is-small is-right">
              <i className="fas fa-times"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function NoopInput ({ name, label, value }) {
  let id = `config.${name}`
  return (
    <div className="field" key={id}>
      <label  className="label"
              htmlFor={id}>
        {label}
      </label>
    </div>
  )
}

function RadioInput ({ name, label, value, options, onChange }) {
  function optionFieldChange(name, value) {
    onChange(name, value)
  }
  let id = `config.${name}`
  return (
    <div className="field" key={id}>
      <fieldset style={{width: "100%", padding: "10px 10px"}}>
        <legend className="label has-text-centered is-uppercase">
          {label || name}
        </legend>
        {Object.keys(options || {}).map((key) => {
          const option = options[key]
          return (
            <div key={`option-${key}`} className="field">
              <input  type="radio"
                      name={name}
                      id={`config.${name}.options.${key}`}
                      value={key/* TODO: shouldn't this be option.value ?*/}
                      checked={value === key}
                      onChange={function (eventInfo) {
                        onChange(name, eventInfo.target.value)/* TODO: shouldn't this be option.value ?*/
                      }}/>
              &nbsp;
              <div className="is-inline-block">
                {FieldTypes[option.type]({
                  ...option,
                  onChange: optionFieldChange,
                  name: `${name}.options.${key}`
                })}
              </div>
            </div>
          )
        })}
      </fieldset>
    </div>
  )
}

function TextInput ({ name, label, value, optional, onChange }) {
  let id = `config.${name}`
  return (
    <div className="field is-horizontal" key={id}>
      <div className="field-label is-normal">
        <label htmlFor={id} className="label">{label || name}</label>
      </div>
      <div className="field-body">
        <div className="field">
          <div className="control">
            <input  type="text"
                    className="input"
                    id={id}
                    name={name}
                    value={value}
                    required={!optional}
                    onChange={function (eventInfo) {
                      onChange(name, eventInfo.target.value)
                    }}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BustabitScriptConfig
