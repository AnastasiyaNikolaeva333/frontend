import styles from "./buttons.module.css";

type MyButtonProps = {
  text?: string;
  children?: React.ReactNode;
  onClick: () => void;
};

function MyButton(props: MyButtonProps) {
  return (
    <button className={`${styles.myButton}`} onClick={props.onClick}>
      {props.text || props.children}
    </button>
  );
}


export {
  MyButton,
};