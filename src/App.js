import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';
import useBackground from './hooks/useBackground';
import useResizablePage from './hooks/useResizablePage';
import Checkbox from './components/Checkbox';
import { useForm } from 'react-hook-form';

import Header from './components/Header';
import InfoModal from './components/InfoModal';
import checkmark from './components/Checkbox/checkmark.png';

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
  const { handleSubmit, register } = useForm();

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
          output[field.name] = {
            name: field.name,
            type: field.type,
            x: field.xMod * page.width,
            y: field.yMod * page.height,
            width: field.widthMod * page.width,
            height: field.heightMod * page.height,
          };

          if ('label' in field) {
            output[field.name].label = {
              x: field.label.xMod * page.width,
              y: field.label.yMod * page.height,
              width: field.label.widthMod * page.width,
              height: field.label.heightMod * page.height,
            };
          }
          else {
            output[field.name].label = {}
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

  const submitForm = data => {
    console.log(data)
  }
  return (
    <>
    <InfoModal fields={fields} setFields={setFields} selectedField={selectedField} setSelectedField={setSelectedField} options={options} setOptions={setOptions}/>
    <Header {...{ fields, setFields, file, setFile, uploadJSON, generateJSON, options, setOptions, setSelectedField, hiddenDownloadRef }} />
    <Page page={page}>
      <Image src={background} ref={imgRef} />
        {Object.values(fields).map((field) => (
          <React.Fragment key={field.name}>
            {field.type === 'select' && (
              <select 
                name={field.name}
                style={{ outline: 'none', position: 'absolute', width: field.width, height: field.height, left: field.x, top: field.y }}
              >
                {field.options.map(option => <option value={option.value} key={option.value}>{option.label}</option>)}

              </select>
            )}

            {field.type === 'text' && (
              <input 
                id={field.name}
                type={field.type} 
                name={field.name} 
                style={{ outline: 'none', position: 'absolute', width: field.width, height: field.height, left: field.x, top: field.y }}
              />
            )}
            
            {field.type === 'checkbox' && (
              <React.Fragment>
                <Checkbox 
                  id={field.name}
                  name={field.name} 
                  width={field.width}
                  height={field.height}
                  left={field.x}
                  top={field.y}
                  ref={register}
                  // style={{ outline: 'none', position: 'absolute', width: field.width, height: field.height, left: field.x, top: field.y }}
                />
                <label
                  htmlFor={field.name}
                  style={{ position: 'absolute', width: field.label.width, height: field.label.height, left: field.label.x, top: field.label.y }}
                >
                </label>
              </React.Fragment>
            )}
          {/* <Rnd
            default={!!field.x ? { width: field.width, height: field.height, x: field.x, y: field.y } : field.type === 'checkbox' ? { width: 25, height: 25, x: 20, y: 20 } : { width: 100, height: 20, x: 20, y: 20 }}
            // default={ { width: field.width, height: field.height, x: field.x, y: field.y }}
            onResizeStop={(e, d, r, d2, p) => setFields({ ...fields, [field.name]: { ...field, height: r.clientHeight, width: r.clientWidth } })}
            onDragStop={(e, d) => setFields({ ...fields, [field.name]: { ...field, x: d.x, y: d.y } })}
            style={{ backgroundColor: 'rgba(189, 217, 240, 0.9)', textOverflow: '', backgroundImage: field.type === 'checkbox' ? `url(${checkmark})` : 'none', backgroundSize: 'contain' }}
            onClick={() => selectField(field)}
            enableResizing={isResizable}
            disableDragging={isResizable}
          >
            {field.type === 'checkbox' ? '' : field.name}
          </Rnd>
          {field.type === 'checkbox' && (
            <Rnd 
              default={!!field.x ? { width: field.label.width, height: field.label.height, x: field.label.x, y: field.label.y } : { height: 20, width: 100, x: 120, y: 20 }} 
              onResizeStop={(e, d, r, d2, p) => setFields({ ...fields, [field.name]: { ...field, label: { ...field.label,  height: r.clientHeight, width: r.clientWidth } } })}
              onDragStop={(e, d) => setFields({ ...fields, [field.name]: { ...field, label: { ...field.label, x: d.x, y: d.y } } })}
              style={{ outline: '1px solid black', outlineOffset: '-1px', textOverflow: '', overflow: 'hidden' }}
              onClick={() => selectField(field)}
              enableResizing={isResizable}
              disableDragging={isResizable}
            >
              {field.name}
            </Rnd>
          )} */}
          </React.Fragment>
        ))}
      </Page>
    </>
  )
}

export default App;
