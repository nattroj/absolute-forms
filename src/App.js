import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';
import useBackground from './hooks/useBackground';
import useResizablePage from './hooks/useResizablePage';

import Header from './components/Header';
import InfoModal from './components/InfoModal';

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
  const [options, setOptions] = useState([])
  const background = useBackground(file);
  const hiddenDownloadRef = useRef();
  const { page, imgRef } = useResizablePage(background);
  const [selectedField, setSelectedField] = useState();
  const [isResizable, setIsResizable] = useState(false)

  const selectField = (field) => {
    console.log(field)
    console.log(fields)
    setSelectedField(field)
  }
  // const generateJSON = useCallback(() => {
  //   console.log(JSON.stringify(Object.values(fields).reduce((json, field) => {
  //     json[field.name] = {
  //       name: field.name,
  //       type: field.type,
  //       options: field.options,
  //       xMod: field.x / page.width,
  //       yMod: field.y / page.height,
  //       widthMod: field.width / page.width,
  //       heightMod: field.height / page.height,
  //     }

  //     if ('x' in field.label) {
  //       json[field.name].label = { 
  //         xMod: field.label.x / page.width,
  //         yMod: field.label.y / page.height,
  //         widthMod: field.label.width / page.width,
  //         heightMod: field.label.height / page.height,
  //       }
  //     }

  //     return json;
  //   }, {}), null, 2));

  // }, [page, fields])

  const generateJSON = event => {
    event.preventDefault();
    const output = JSON.stringify(Object.values(fields).reduce((json, field) => {
      json[field.name] = {
        name: field.name,
        type: field.type,
        options: field.options,
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
    }, {}), null, 2);
    const jsonFile = new Blob([output], { type: JSON })

    const url = URL.createObjectURL(jsonFile);
    hiddenDownloadRef.current.setAttribute('href', url)
    hiddenDownloadRef.current.setAttribute('download', 'formJSONData.json')
    hiddenDownloadRef.current.click();
  }

  const uploadJSON = data => {
    const file = data.jsonFile[0];
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const json = JSON.parse(e.target.result)
        setFields(Object.values(json).reduce((output, field) => {
          output[field.name] = field;

          if (!('label' in field)) {
            output[field.name].label = {};
          }

          return output;
        }, {}))
        console.log(json)
      }
      catch (e) {
        console.log(e)
      }
    }

    reader.readAsText(file)
  }

  useEffect(() => {
    const altKeyDown = event => {
      if (event.keyCode === 18) setIsResizable(true)
    }

    const altKeyUp = event => {
      if (event.keyCode === 18) setIsResizable(false)
    }

    window.addEventListener('keydown', altKeyDown) 
    window.addEventListener('keyup', altKeyUp)
    
    return () => { 
      window.removeEventListener('keydown', altKeyDown)
      window.removeEventListener('keyup', altKeyUp)
    }
  }, [])

  return (
    <>
    <InfoModal fields={fields} setFields={setFields} selectedField={selectedField} setSelectedField={setSelectedField} options={options} setOptions={setOptions}/>
    <Header {...{ fields, setFields, file, setFile, uploadJSON, generateJSON, options, setOptions, setSelectedField, hiddenDownloadRef }} />
    <Page page={page}>
      <Image src={background} ref={imgRef} />
        {Object.values(fields).map((field) => (
          <React.Fragment key={field.name}>
          <Rnd
            default={!!field.xMod ? { width: field.widthMod * page.width, height: field.heightMod * page.height, x: field.xMod * page.width, y: field.yMod * page.height } : field.type === 'checkbox' ? { width: 25, height: 25, x: 20, y: 20 } : { width: 100, height: 20, x: 20, y: 20 }}
            // default={ { width: field.width, height: field.height, x: field.x, y: field.y }}
            onResizeStop={(e, d, r, d2, p) => setFields({ ...fields, [field.name]: { ...field, height: r.clientHeight, width: r.clientWidth } })}
            onDragStop={(e, d) => setFields({ ...fields, [field.name]: { ...field, x: d.x, y: d.y } })}
            style={{ border: '1px solid black', textOverflow: '' }}
            onClick={() => selectField(field)}
            enableResizing={isResizable}
          >
            {field.type === 'checkbox' ? '' : field.name}
          </Rnd>
          {field.type === 'checkbox' && (
            <Rnd 
              default={!!field.xMod ? { width: field.label.widthMod * page.width, height: field.label.heightMod * page.height, x: field.label.xMod * page.width, y: field.label.yMod * page.height } : { height: 20, width: 100, x: 120, y: 20 }} 
              onResizeStop={(e, d, r, d2, p) => setFields({ ...fields, [field.name]: { ...field, label: { ...field.label,  height: r.clientHeight, width: r.clientWidth } } })}
              onDragStop={(e, d) => setFields({ ...fields, [field.name]: { ...field, label: { ...field.label, x: d.x, y: d.y } } })}
              style={{ border: '1px solid black', textOverflow: 'clip' }}
              onClick={() => selectField(field)}
              enableResizing={isResizable}
            >
              {field.name}
            </Rnd>
          )}
          </React.Fragment>
        ))}
      </Page>
    </>
  )
}

export default App;
