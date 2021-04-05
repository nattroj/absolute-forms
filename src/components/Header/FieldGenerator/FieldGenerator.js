import { useState } from 'react';

const fieldDefault = {
  name: '',
  type: 'text',
  x: null,
  y: null,
  width: null,
  height: null,
  label: {}
}

const FieldGenerator = ({ fields, setFields }) => {
  const [field, setField] = useState(fieldDefault);

  const handleChange = event => setField({ ...field, [event.target.name]: event.target.value });
  const addField = () => {
    if (!field.name) return alert('field must have name');
    if (field.name in fields) return alert('field with that name already exists');

    setFields({ ...fields, [field.name]: field });
    setField(fieldDefault);
  }

  return (
    <div>
      <input name='name' placeholder='Field Name' value={field.name} onChange={handleChange} />
      <select name='type' value={field.type} onChange={handleChange}>
        <option value='text'>text</option>
        <option value='checkbox'>checkbox</option>
      </select>
      <button onClick={addField}>add</button>
    </div>
  )
}

export default FieldGenerator;