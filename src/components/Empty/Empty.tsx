import classNames from "classnames/bind";
import styles from "./Empty.module.scss";

const cx = classNames.bind(styles);
function Empty() {
  return (
    <div className={cx("content")}>
      <h2>Wow, thiệt trống trải quá đi 🙄</h2>
    </div>
  );
}

export default Empty;
