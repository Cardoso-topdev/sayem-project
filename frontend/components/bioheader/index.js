import { useState, useCallback } from "react";

import styles from "./styles.module.scss";
import CloseIcon from "../../images/close.svg";

const BioHeader = ({ pageid, status, mini, dismissible, style, username, userid, bio }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [bioText, setBioText] = useState(bio);
  const [newBioText, setNewBioText] = useState(bio);
  const [bioDisable, setBioDisability] = useState( userid != pageid);

  return (
    <div
      style={{ ...style }}
      className={[
        styles.notice,
      ].join(" ")}
    >
      {dismissible && (
        <span
          role="button"
          tabIndex="0"
          className={styles.dismiss}
          onClick={() => setIsVisible(false)}
        >
          <img src={CloseIcon} alt="close icon" />
        </span>
      )}
      <h4 className="mb-3">{username}</h4>
      <div className = {[styles.bioContainer]} >
        {bioDisable ? 
          <input type="text" value={bioText} disabled/> : 
          <input type="text" value={bioText} onChange={e => {
            setBioText(e.target.value);
            } }/>} 
        {!bioDisable && <button onClick={ ()=> {setNewBioText(bioText)}}>
          Save
        </button>}
        
        {!bioDisable && <button onClick={ () => {setBioText(newBioText)}}>
          Cancel
        </button>}
      </div>
    </div>
  );
};

export default BioHeader;
