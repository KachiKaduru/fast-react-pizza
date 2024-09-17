import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { decreaseItemQuantity, increaseItemQuantity } from "./cartSlice";

export default function UpdateItemQuantity({ pizzaId, currentQuantity }) {
  const dispatch = useDispatch();

  //   function handleIncrease() {
  //     dispatch(increaseItemQuantity(pizzaId));
  //   }
  //   function handleDecrease() {
  //     dispatch(decreaseItemQuantity(pizzaId));
  //   }

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <Button
        type={"round"}
        onClick={() => dispatch(decreaseItemQuantity(pizzaId))}
      >
        -
      </Button>

      <p className="font-semibold">{currentQuantity}</p>

      <Button
        type={"round"}
        onClick={() => dispatch(increaseItemQuantity(pizzaId))}
      >
        +
      </Button>
    </div>
  );
}
