import classes from "./loadingSpinner.module.css";

const LoadingSpinner = () => {
  return (
    <div className={classes.centered}>
      <div className={classes.LoadingSpinner}>
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default LoadingSpinner;
