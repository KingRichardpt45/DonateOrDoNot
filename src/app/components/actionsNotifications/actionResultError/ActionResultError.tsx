import React, { useState } from "react";
import  styles  from "./ActionResultError.module.css"
import { ActionResultNotificationError } from "../ActionResultNotificationError";

export const ActionResultErrorComponent: React.FC<{action:ActionResultNotificationError}> = ({ action }) => 
{
    const [close,setClose] = useState<string>("");
    const [firstRender,setFirstRender] = useState<boolean>(true);
 
    const onCloseHandler = () =>
    {
        setTimeout( () => setClose(styles.notDisplay) ,500);
        setClose(styles.SlideOut);
    }
    
    if(firstRender)
    {
        setTimeout(onCloseHandler,action.duration_ms);
        setFirstRender(false);
    }

    return (
        <div className={`${styles.mainContainer} ${close} ${close}`}>
            <div className={styles.container}>
                <div className={styles.errorIcon}>!</div>
                <div className={styles.errorContainer}>
                    <div className={styles.errorContent}>
                        <div className={styles.errorField}>{action.field}</div>
                        <ul>
                            {action.errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <button className={styles.closeButton} onClick={onCloseHandler}>
                    X
                </button>
            </div>
            <div className={styles.timeBar} style={{ '--barDuration': `${action.duration_ms / 1000}s` } as React.CSSProperties} >
            </div>
        </div>
  );
};