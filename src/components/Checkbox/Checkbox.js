import React, { forwardRef, useState, useRef } from 'react';
import checkmark from './checkmark.png';

const Checkbox = forwardRef( (props, ref) => {
  const [checked, setChecked] = useState(false);
  const checkedRef = useRef(null)
  const { id, name, width, height, left, top, outline } = props

  return (
    <div
      onClick={(e) => {
        setChecked(!checked);
        checkedRef.current.click();
      }}
      style={{
        position: 'absolute',
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`,
        outline: outline || 'none',
        backgroundImage: checked ? `url(${checkmark})` : 'none',
        backgroundSize: 'contain',
      }}
    >
      <input
        type='checkbox'
        id={id}
        name={name}
        checked={checked}
        ref={(targetRef) => {
          ref(targetRef);
          checkedRef.current = targetRef;
        }}
        onChange={e => {
          setChecked(e.target.checked);
        }}
        style={{ display: 'none' }}
      />
    </div>
  )
//   const handleCheck = event => {
//     setIsChecked(!isChecked)
//     event.target.value = !isChecked
//     console.log(isChecked)
//   }

//   return (
//     <React.Fragment>
//       <label>
//         <input name={props.name} value={isChecked} type='checkbox' ref={ref} hidden/>
//         <div {...props} className={styles.root} onClick={handleCheck}/>
//       </label>
//     </React.Fragment>
//   )
})

export default Checkbox;