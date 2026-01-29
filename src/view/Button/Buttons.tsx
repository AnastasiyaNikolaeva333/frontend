import styles from "./buttons.module.css";

type MyButtonProps = {
  text?: string;
  children?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  style?: React.CSSProperties;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
};

function MyButton(props: MyButtonProps) {
  const buttonClass = `${styles.myButton} ${
    props.disabled ? styles.disabled : ''
  } ${props.variant ? styles[props.variant] : ''} ${
    props.size ? styles[props.size] : ''
  } ${props.className || ''}`;

  return (
    <button 
      className={buttonClass}
      onClick={props.onClick}
      disabled={props.disabled}
      title={props.title}
      style={props.style}
      type={props.type || 'button'}
    >
      {props.text || props.children}
    </button>
  );
}

export { MyButton };