import { useState } from "react";

import styles from "./styles.module.scss";
import CloseIcon from "../../images/close.svg";

const BioHeader = ({ children, status, mini, dismissible, style }) => {
  const [isVisible, setIsVisible] = useState(true);
  // console.log("BioHeader")
  // console.log(children)
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
      {children}
    </div>
  );
};

export default BioHeader;
