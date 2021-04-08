import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { Rnd } from 'react-rnd';

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
    bottom: '10px'
  },
  button: {
    margin: '5px'
  },
  jsonObj: {
    fontSize: 12,
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

  const selectOption = option => {
    console.log(option)
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
    console.log(options)
  }, [fields, options])

  return (
    <Rnd
      style={{ zIndex: 1001 }}

    >
      <div className={styles.modal}>
        <div>
          {selectedField && (
            <div className={styles.container}>
              <pre className={styles.jsonObj}>{JSON.stringify(selectedField, null, 4)}</pre>
              
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