import React, { useState, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';
import useBackground from './hooks/useBackground';
import useResizablePage from './hooks/useResizablePage';

import Header from './components/Header';

const Page = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 80px;
  ${({ page }) => !!page && { height: page.height, width: page.width }} 
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

// const fields = [];

function App() {
  const [file, setFile] = useState(null);
  const [fields, setFields] = useState({});
  const background = useBackground(file);
  const { page, imgRef } = useResizablePage(background);

  const generateJSON = useCallback(() => {
    console.log(JSON.stringify(Object.values(fields).reduce((json, field) => {
      json[field.name] = {
        name: field.name,
        type: field.type,
        xMod: field.x / page.width,
        yMod: field.y / page.height,
        widthMod: field.width / page.width,
        heightMod: field.height / page.height,
      }

      if ('x' in field.label) {
        json[field.name].label = { 
          xMod: field.label.x / page.width,
          yMod: field.label.y / page.height,
          widthMod: field.label.width / page.width,
          heightMod: field.label.height / page.height,
        }
      }

      return json;
    }, {}), null, 2));

  }, [page, fields])

  return (
    <>
    <Header {...{ fields, setFields, file, setFile, generateJSON }} />
    <Page page={page}>
      <Image src={background} ref={imgRef} />
        {Object.values(fields).map((field) => (
          <React.Fragment key={field.name}>
          <Rnd
            default={{ width: 100, height: 20, x: 20, y: 20 }}
            onResizeStop={(e, d, r, d2, p) => setFields({ ...fields, [field.name]: { ...field, height: r.clientHeight, width: r.clientWidth } })}
            onDragStop={(e, d) => setFields({ ...fields, [field.name]: { ...field, x: d.x, y: d.y } })}
            style={{ border: '1px solid black', textOverflow: '' }}
          >
            {field.name}
          </Rnd>
          {field.type === 'checkbox' && (
            <Rnd 
              default={{ height: 20, width: 100, x: 120, y: 20 }} 
              onResizeStop={(e, d, r, d2, p) => setFields({ ...fields, [field.name]: { ...field, label: { ...field.label,  height: r.clientHeight, width: r.clientWidth } } })}
              onDragStop={(e, d) => setFields({ ...fields, [field.name]: { ...field, label: { ...field.label, x: d.x, y: d.y } } })}
              style={{ border: '1px solid black', textOverflow: 'clip' }}
            >
            </Rnd>
          )}
          </React.Fragment>
        ))}
      </Page>
    </>
  )
}

export default App;
