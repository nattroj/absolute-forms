import styled from 'styled-components';
import FieldGenerator from './FieldGenerator';

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

const Header = ({ fields, setFields, file, setFile, generateJSON }) => {

  return (
    <StyledHeader>
      <Title>Form Generator</Title>
      {!!file 
        ? <FieldGenerator fields={fields} setFields={setFields} />
        : <input type='file' onChange={e => setFile(e.target.files[0])} />
      }
      {!!file && <button onClick={generateJSON}>Generate JSON</button>}
    </StyledHeader>
  )
}

export default Header;