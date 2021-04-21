import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { Rnd } from 'react-rnd';
import { useForm } from 'react-hook-form';

const useStyles = makeStyles({
  draggable: {
    zIndex: 1001
  },
  modal: {
    zIndex: 6000,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    flexGrow: 1,
    backgroundColor: 'rgba(211, 211, 211, 0.95)',
    position: 'sticky',
    bottom: '10px',
    padding: '10px'
  },
  button: {
    margin: '5px'
  },
  jsonObj: {
    fontSize: 20,
    height: '225px',
    overflow: 'auto'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  option: {
    display: 'flex',
    height: '50px',
    border: '1px solid black',
  }
})

function InfoModal({setSelectedField, selectedField, fields, setFields, options, setOptions}) {
  const styles = useStyles();
  const [selectedOption, setSelectedOption] = useState()
  const { register, handleSubmit, setValue } = useForm(); 

  const applyChanges = changes => {
    if (changes.name === selectedField.name) {
      const updatedField = {...selectedField, ...changes}
    }
  }
  const selectOption = option => {
    setSelectedOption(option)
  }

  const deleteOption = () => {
    setOptions(options.filter(option => option.label !== selectedOption.label))
  }
  const deleteField = selectedField => {
    const key = selectedField.name
    delete fields[key]
    setFields(fields)
    setSelectedField(null)
  }

  useEffect(() => {
    console.log(selectedField?.width)
    Object.keys(selectedField || {}).map(key => {
      if (['x', 'y', 'width', 'height', 'name'].indexOf(key) > -1) {
        setValue(`${key}`, selectedField[key])
      }
    })
  }, [fields, options, selectedField, selectedField?.height])

  if (!Object.keys(fields).length) return null
  return (
    <Rnd
      style={{ zIndex: 1001 }}

    >
      <div className={styles.modal}>
        <div>
          {selectedField && (
            <div className={styles.container}>
              <form onSubmit={handleSubmit(applyChanges)}>
                <div className={styles.container}>

                <pre className={styles.jsonObj}>{JSON.stringify(selectedField, null, 4)}</pre>
                {/* {Object.keys(selectedField).filter(key => key !== 'options' && key !== 'type').map(key => (
                  <div>
                      <p>{key}:</p>
                      <input placeholder={selectedField[key]} defaultValue={selectedField[key]} name={key} ref={register}/>
                  </div>
                ))} */}
                {/* {selectedField.type === 'select' && (
                  <select name='type'>
                    <options value='text'>text</options>
                    <options value='select'>select</options>
                    <options value='checkbox'>checkbox</options>
                  </select>
                )}
                {selectedField.type ='select' && selectedField.options.map(option => {
                  <div className={styles.container}>
                    <p>Options</p>
                    <div>
                      <p>label:</p>
                      <input defaultValue={option.label}/>
                      <p>value:</p>
                      <input defaultValue={option.value}/>
                    </div>
                  </div>
                }) } */}
              </div>
                <button type='submit' className={styles.button}>apply changes</button>
              </form>
              <button className={styles.button} onClick={() => deleteField(selectedField)}>delete</button>
            </div>
          )}
          {options.length !== 0 && (
            <div className={styles.container} >
              {options.map(option => (
                <div className={styles.option} onClick={() => selectOption(option)}>
                  <pre className={styles.jsonObj}>{JSON.stringify(option, null, 4)}</pre>
                  {option?.label === selectedOption?.label && (
                    <button onClick={() => deleteOption()}>delete option</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Rnd>
  )
}

export default InfoModal;