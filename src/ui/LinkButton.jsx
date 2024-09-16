import { Link, useNavigate } from "react-router-dom";

export default function LinkButton({ children, to }) {
  const classes = "text-blue-600 hover:text-blue-800 hover:underline";

  const navigate = useNavigate();

  if (to === "-1")
    return (
      <button className={classes} onClick={() => navigate(-1)}>
        {children}
      </button>
    );

  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  );
}
