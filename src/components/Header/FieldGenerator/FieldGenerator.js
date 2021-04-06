import React, { useState, useEffect } from 'react';

const fieldDefault = {
  name: '',
  type: 'text',
  x: null,
  y: null,
  width: null,
  height: null,
  label: {}
}
const optionDefault = {
  label: '',
  value: ''
}

const FieldGenerator = ({ fields, setFields }) => {
  const [field, setField] = useState(fieldDefault);
  const [option, setOption] = useState(optionDefault)
  const [options, setOptions] = useState([])

  const handleChange = event => setField({ ...field, [event.target.name]: event.target.value });
  const handleOptionChange = event => {
    setOption({ ...option, [event.target.name]: event.target.value})
  }

  const addField = () => {
    if (!field.name) return alert('field must have name');
    if (field.name in fields) return alert('field with that name already exists');

    setFields({ ...fields, [field.name]: field });
    setField(fieldDefault)
    setOptions([])
  }

  const addOption = () => {
    if (!option.label || !option.value) return alert('option must have both a label and value');
    if (options.filter(op => op.label === option.label).length === 1) return alert('option with that label already exists');
    if (options.filter(op => op.value === option.value).length === 1) return alert('option with that value already exists');

    setOptions([...options, option]);
    setOption(optionDefault)
  }

  useEffect(() => {
    setField({ ...field, options: options })
    console.log(options)
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