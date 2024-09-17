import { useSelector } from "react-redux";

export default function Username() {
  const username = useSelector((state) => state.userReducer.username);

  if (!username) return null;

  return (
    <p className="hidden text-sm font-semibold uppercase sm:block">
      {username}
    </p>
  );
}
