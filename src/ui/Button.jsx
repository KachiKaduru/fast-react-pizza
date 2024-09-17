import { Link } from "react-router-dom";

export default function Button({ children, disabled, to, type, onClick }) {
  const classes =
    "inline-block text-sm rounded-full bg-yellow-400  font-semibold uppercase text-stone-900 tracking-wide text-stone-500 hover:bg-yellow-300 focus:bg-yellow-300 disabled:cursor-not-allowed ";

  const styles = {
    primary: classes + " px-4 py-3 md:px-6 md:py-4 ",
    small: classes + " px-4 py-2 md:px-5 md:py-2.5 text-xs",
    round: classes + " px-2.5 py-1 md:px-3.5 md:py-2 text-base",
    secondary:
      "inline-block text-sm rounded-full border-2 border-stone-300 px-4 py-3 md:px-6 md:py-4 font-semibold uppercase text-stone-800 tracking-wide text-stone-500 hover:bg-stone-300 hover:text-stone-800 focus:bg-stone-300 disabled:cursor-not-allowed ",
  };

  if (to)
    return (
      <Link to={to} className={styles[type]}>
        {children}
      </Link>
    );

  if (onClick)
    return (
      <button onClick={onClick} disabled={disabled} className={styles[type]}>
        {children}
      </button>
    );

  return (
    <button disabled={disabled} className={styles[type]}>
      {children}
    </button>
  );
}
