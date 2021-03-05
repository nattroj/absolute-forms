import { useState, useEffect } from 'react';
import styled from 'styled-components';
import background from './assets/sample1.png';

import { Rnd } from 'react-rnd';

const Page = styled.div`
  position: relative;
  width: ${(props) => props.pageSize.width}px;
  height: ${(props) => props.pageSize.height}px;
`

const Background = styled.img`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
`

const Field = styled.input`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
`

function App() {
  const [newField, setNewField] = useState({ name: '', type: '' });
  const [pageSize, setPageSize] = useState({
    width: window.innerWidth < 1700 ? window.innerWidth : 1700,
    height: window.innerWidth < 1700 ? window.innerWidth * 1.647 : 1700 * 1.647
  })
  const [fields, setFields] = useState([]);

  const addField = () => {
    setFields([...fields, newField]);
    setNewField({ name: '', type: '' });
  }

  const generateForm = () => {
    const form = fields.reduce((gen, field) => {
      gen[field.name] = { x: null, y: null, xModifier: null, yModifier: null };
      return gen;
    }, {})

    console.log(form);
  }

  useEffect(() => {
    const handleResize = () => setPageSize({
      width: window.innerWidth < 1700 ? window.innerWidth : 1700,
      height: window.innerWidth < 1700 ? window.innerWidth * 1.647 : 1700 * 1.647
    });
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [])

  return (
    <div className="App">
      <input name='name' value={newField.name} onChange={e => setNewField({ ...newField, [e.target.name]: e.target.value })} />
      <select name='type' value={newField.type} onChange={e => setNewField({ ...newField, [e.target.name]: e.target.value })}>
        <option value='text'>text</option>
        <option value='checkbox'>checkbox</option>
      </select>
      <button onClick={addField}>add field</button> 
      <button onClick={generateForm}>generate</button> 
      <Page pageSize={pageSize}>
        <Background src={background} />
        {fields.map(field => (
          <Rnd onDragStop={(e, data) => console.log(data)} onResizeStop={(e, d, r, delta) => console.log(delta)}>
            <input style={{ width: '100%', height: '100%' }} />
          </Rnd>
        ))}
      </Page>
    </div>
  );
}

export default App;
