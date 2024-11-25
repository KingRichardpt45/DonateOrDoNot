import React, { useState } from "react";
import  styles  from "./ActionResultSuccess.module.css"
import { ActionResultNotificationSuccess } from "../ActionResultNotificationSuccess";

export const ActionResultSuccessComponent: React.FC<{action:ActionResultNotificationSuccess}> = ({ action }) => 
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
                <svg className={styles.successIcon} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 20 20"><path fill="currentColor" d="M10 20a10 10 0 0 1 0-20a10 10 0 1 1 0 20m-2-5l9-8.5L15.5 5L8 12L4.5 8.5L3 10z"/></svg>
                <div className={styles.messageContainer}>
                    <div className={styles.errorContent}>
                        <div className={styles.errorField}>Success</div>
                        <div>
                            {action.message}
                        </div>
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