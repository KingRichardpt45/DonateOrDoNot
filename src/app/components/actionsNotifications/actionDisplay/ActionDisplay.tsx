import React from 'react';
import { useState } from "react";
import { IActionResultNotification } from '../IActionResultNotification';
import { ActionResultNotificationError } from '../ActionResultNotificationError';
import { ActionResultErrorComponent } from '../actionResultError/ActionResultError';
import styles from './ActionDisplay.module.css';
import { ActionResultNotificationSuccess } from '../ActionResultNotificationSuccess';
import { ActionResultSuccessComponent } from '../actionResultSuccess/ActionResultSuccess';


export const ActionDisplay: React.FC<{ actions:IActionResultNotification[]}> = ({ actions }) => {
  
  const [firstRender,setFirstRender] = useState<boolean>(true);
  const [actionResults,setErrorsArray] = useState<IActionResultNotification[]>(actions);
 
  if(firstRender)
  {
    setErrorsArray(actions);
    setFirstRender(false);
  }

  return (
    <div className={styles.errorContainer} >
      {
        actionResults.map(
          (action, index) => { 
            switch( action.actionResultType)
            {
              case "ActionResultNotificationError":
                return <ActionResultErrorComponent key={index} action={action as ActionResultNotificationError } />

              case "ActionResultNotificationSuccess" :
                return <ActionResultSuccessComponent key={index} action={action as ActionResultNotificationSuccess } />
            }            
          }
        )
      }
    </div>
  );
};