"use client"
import { useState } from 'react';
import styles from "./selectWithInput.module.css"

const DropdownInput : React.FC<{options:string[],onChange: (v:string) => any }>= ({options,onChange}) => {

    const [value, setInputValue] = useState("");
    const [enableOptions, setEnableOptions] = useState("");
  
    function updateInputValue(event: React.ChangeEvent<HTMLInputElement>)
    {
        let value = event.target.value;
        setInputValue(value);
        onChange(value);
    }

    function onClickInput(event: React.MouseEvent<HTMLInputElement>)
    {
        event.currentTarget.select();
        onDroopClick(false);
    }  

    function onClickOption(optionValue:string)
    {
        setInputValue(optionValue);
        onChange(optionValue);
    }   

    function onDroopClick(open:boolean = true)
    {
        if(enableOptions !== styles.Active && open)
            setEnableOptions(styles.Active);
        else
            setEnableOptions("");
    }

    function handleBlur(event: React.FocusEvent<HTMLDivElement>) 
    {    
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setEnableOptions(""); 
        }
    }

    return (
        <div tabIndex={0} 
            onBlur={handleBlur}
        >
            <div className={styles.DropdownInputContainer}>
                <input type="text" placeholder="Select" className={styles.DropdownInput}  value={value} onChange={updateInputValue} onClick={onClickInput}/>
                <button className={styles.DroopClick} onClick={()=>{onDroopClick()}}>
                    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m19 9l-7 6l-7-6"/></svg>
                </button>
            </div>
            <div className={`${styles.optionContainer} ${enableOptions}`} >
                {
                    options.map((option,index ) => 
                        (
                            <div className={styles.option} key={`selectInput_${index}`} onClick={()=>{ onClickOption(option); }}>{option}</div>
                        )
                    )
                }
            </div>
        </div>
    );
};

export default DropdownInput;