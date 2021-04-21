import React, { useState, useEffect } from 'react';

// render using window inner values
const defaultState = {
  name: '',
  type: 'text',
  x: 20,
  y: 20,
  width: null,
  height: null,
}
const optionDefault = {
  label: '',
  value: ''
}

const FieldGenerator = ({ fields, setFields, options, setOptions, setSelectedField }) => {
  const [field, setField] = useState(defaultState);
  const [option, setOption] = useState(optionDefault)

  const handleChange = event => {
    const newField = {...field}
    setField({ ...newField, [event.target.name]: event.target.value });
  }
  const handleOptionChange = event => {
    setOption({ ...option, [event.target.name]: event.target.value})
  }

  const addField = () => {
    if (!field.name) return alert('field must have name');
    if (field.name in fields) return alert('field with that name already exists');

    const defaultField = {...field}
    if (field.type === 'checkbox') {
      defaultField.height = 25
      defaultField.width = 25
      defaultField.x = window.scrollX + 20
      defaultField.y = window.scrollY + 20
      defaultField.label = {
        x: window.scrollX + 120,
        y: window.scrollY + 20,
        height: 20,
        width: 100
      }
    }
    else {
      defaultField.x = window.scrollX + 20
      defaultField.y = window.scrollY + 20
      defaultField.height = 20
      defaultField.width = 100
    }

    if (field.type !== 'select') {
      setOptions([])
      delete defaultField.options
    }

    setFields({ 
      ...fields,
      [field.name]: defaultField
    });
    setField(defaultState)
    setOptions([])
  }

  const addOption = () => {
    setSelectedField(null)
    if (!option.label || !option.value) return alert('option must have both a label and value');
    if (options.filter(op => op.label === option.label).length === 1) return alert('option with that label already exists');
    if (options.filter(op => op.value === option.value).length === 1) return alert('option with that value already exists');

    setOptions([...options, option]);
    setOption(optionDefault)
  }

  useEffect(() => {
    setField({ ...field, options: options })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option])
  
  return (
    <div>
        <input name='name' placeholder='Field Name' value={field.name} onChange={handleChange} />
        <select name='type' value={field.type} onChange={handleChange}>
          <option value='text'>text</option>
          <option value='checkbox'>checkbox</option>
          <option value='select'>select</option>
        </select>
        <button onClick={addField}>add</button>
        {field.type === 'select' && (
          <React.Fragment>
            <input name='label' placeholder='Select Option Label' value={option.label} onChange={handleOptionChange}/>
            <input name='value' placeholder='Select Option Value' value={option.value} onChange={handleOptionChange}/>
            <button onClick={addOption}>add option</button>
          </React.Fragment>
        )}
    </div>
  )
}

export default FieldGenerator;