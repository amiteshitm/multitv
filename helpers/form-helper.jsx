import React from 'react'
import { PropTypes } from 'prop-types'
import { Field } from 'redux-form'
// import AutoComplete from 'material-ui/AutoComplete'
import SelectField from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
// import RichTextEditor from 'react-rte'
import CategoryTree from 'shared/category-tree'

import LibraryAdd from '@material-ui/icons/LibraryAdd'
import Delete from '@material-ui/icons/DeleteForever'
import IconButton from '@material-ui/core/IconButton'

import skeleton from '../styles/skeleton.css'
import custom from '../styles/custom.css'

export const renderTextField = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <TextField
    hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
  />
)

renderTextField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object,
  custom: PropTypes.object,
}

export const renderHiddenField = ({ input, label, meta: { touched, error }, ...inputProps }) => (
  <div>
    <input type="hidden"
      {...inputProps}
      value={input.value}
      onChange={input.onChange}
    />
    {touched && error && <span className={custom.errors}>{error}</span>}
  </div>
)

export const renderTextArea = ({ input, label, meta: { touched, error }, ...inputProps }) => (
  <div>
    <label>{label}</label>
    <textarea
      onChange={input.onChange}
      onBlur={input.onBlur}
      {...inputProps}
      value={input.value}
    />
    {touched && error && <span className={custom.errors}>{error}</span>}
  </div>
)

export const renderSelectField = ({ input, options, label, className, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <select {...input} className={className}>
      {options}
    </select>
    {touched && error && <div className={custom['errors']} >{error}</div>}
  </div>
)

export const renderCategorySelect = ({ input, label, className, meta: { touched, error }, ...props }) => (
  <div>
    <label>{label}</label>
    <CategoryTree input={input} {...props} className={className} />
    {touched && error && <div className={custom['errors']} >{error}</div>}
  </div>
)

export const renderArray = ({ fields, label, fieldName, meta: { touched, error } }) => (
  <div>
    <span>
      {label}
      <IconButton onClick={() => fields.push({})} tooltip={`Add${fieldName}`}>
        <LibraryAdd color='primary'/>
      </IconButton>
    </span>
    <span>
      {touched && error && <span>{error}</span>}
    </span>
    <span style={{ maxHeight: '400px', overflowY: 'scroll' }}>
      {fields.map((field, index) =>
        <div key={index}>
          <span>
            {fieldName} {index + 1}
            <IconButton onClick={() => fields.remove(index)} tooltip="remove">
              <Delete color='primary'/>
            </IconButton>
          </span>
          <div className={`${skeleton.row}`}>
            <span className={`${skeleton.eight} ${skeleton.columns}`}>
              <Field
                name={`${field}.title`}
                type="text"
                className={`${skeleton['u-full-width']}`}
                component={renderTextField}
                label="Title"/>
            </span>
          </div>
          <div className={`${skeleton.row}`}>
            <span className={`${skeleton.twelve} ${skeleton.columns}`}>
              <Field
                name={`${field}.embed_code`}
                type="text"
                className={`${skeleton['u-full-width']}`}
                component={renderTextArea}
                label="URL/Embed Code"/>
            </span>
          </div>
        </div>
      )}
    </span>
  </div>
)

/*
export const renderBonusArray = ({ fields, label, fieldName, meta: { touched, error } }) => (
  <div>
    <span>
      {label}
      <IconButton onClick={() => fields.push({})} tooltip={`Add${fieldName}`}>
        <LibraryAdd color={green500}/>
      </IconButton>
    </span>
    <span>
      {touched && error && <span>{error}</span>}
    </span>
    <span style={{ maxHeight: '400px', overflowY: 'scroll' }}>
      {fields.map((field, index) =>
        <div key={index}>
          <span>
            {fieldName} {index + 1}
            <IconButton onClick={() => fields.remove(index)} tooltip="remove">
              <Delete color={red500}/>
            </IconButton>
          </span>
          <div className={`${skeleton.row}`}>
            <span className={`${skeleton.six} ${skeleton.columns}`}>
              <Field
                name={`${field}.amount`}
                type="Number"
                className={`${skeleton['u-full-width']}`}
                component={renderTextField}
                label="Bonus Amount"/>
            </span>
            <span className={`${skeleton.six} ${skeleton.columns}`}>
              <Field
                name={`${field}.range_type`}
                type="text"
                className={`${skeleton['u-full-width']}`}
                component={renderTextField}
                label="Bonus Range Type"/>
            </span>
          </div>
          <div className={`${skeleton.row}`}>
            <span className={`${skeleton.twelve} ${skeleton.columns}`}>
              <Field
                name={`${field}.ranges`}
                type="text"
                className={`${skeleton['u-full-width']}`}
                component={renderTextField}
                label="Bonus Ranges"/>
            </span>
          </div>
        </div>
      )}
    </span>
  </div>
)
*/
/*
export const renderAutoComplete = ({ input, whenChanged, meta: { touched, error }, ...custom }) => (
  <AutoComplete
    {...input}
    {...custom}
    errorText = {touched && error}
    onNewRequest = {(c, i) => {
      whenChanged(c.symbol)
      input.onChange(c.symbol)
    }}
  />
)
*/

export const renderMUSelectField = ({ input, children, whenChanged, className, meta: { touched, error }, ...inputProps }) => (
  <SelectField
    errorText={touched && error}
    {...input}
    inputStyle={{ textAlign: 'left' }}
    onChange={(event, index, value) => { input.onChange(value); if (whenChanged) whenChanged(value) }}
    children = {children}
    {...inputProps}
  />
)

/*
export const renderDatePicker = ({ input, label, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <DatePicker {...input}
      placeholder="Select Date"
      value = {input.value !== '' ? new Date(input.value) : null}
      onChange = {(event, value) => { input.onChange(value) }}
      autoOk={true}
    />
    {touched && error && <span className={custom.errors}>{error}</span>}
  </div>
)

export class renderDateTimePicker extends Component {
  render () {
    return (
      <div>
        <label>{this.props.label}</label>
        <DateTimePicker
          placeholder="Click to Select Date"
          returnMomentDate={false}
          clearIcon={null}
          DatePicker={DatePickerDialog}
          TimePicker={TimePickerDialog}
          value={this.props.input.value !== '' ? new Date(this.props.input.value) : null}
          onChange = {(value) => { console.log(value); this.props.input.onChange(value) }}
        />
        {this.props.meta.invalid && this.props.meta.error &&
            <span className={custom.errors}>{this.props.meta.error}</span>}
      </div>
    )
  }
}
*/
