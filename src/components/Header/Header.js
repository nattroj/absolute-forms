import React from 'react';
import styled from 'styled-components';
import FieldGenerator from './FieldGenerator';
import { useForm } from 'react-hook-form';

const StyledHeader = styled.header`
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: black;
  color: white;
  padding: 0 40px;
  width: 100%;
  height: 80px;
  z-index: 1000;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
`;

const Header = ({ fields, setFields, file, setFile, uploadJSON, generateJSON, options, setOptions, setSelectedField, hiddenDownloadRef }) => {
  const { handleSubmit, register } = useForm();

  return (
    <StyledHeader>
      <Title>Form Generator</Title>
      {!!file 
        ? <FieldGenerator fields={fields} setFields={setFields} options={options} setOptions={setOptions} setSelectedField={setSelectedField} />
        : <input type='file' onChange={e => setFile(e.target.files[0])} />
      }
      {!!file && (
        <React.Fragment>
          <button onClick={generateJSON}>Generate JSON</button>
          <form onSubmit={handleSubmit(uploadJSON)}>
            <input name='jsonFile' ref={register} type='file' accept='.json'/>
            <button type='submit'>Submit</button>
          </form>
        </React.Fragment>
      )}
      <a ref={hiddenDownloadRef} hidden></a>
    </StyledHeader>
  )
}

export default Header;