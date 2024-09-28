// import { useState } from "react";

import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import { useState } from "react";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);

  const formErrors = useActionData();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isSubmitting = navigation.state === "submitting";

  const cart = useSelector(getCart);
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.userReducer);
  const isLoadingAddress = addressStatus === "loading";

  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  function handleFetchAddress(e) {
    e.preventDefault();
    dispatch(fetchAddress());
  }

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-bold">Ready to order? Let&apos;s go!</h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center">
          <label className="font-semibold sm:basis-40">First Name</label>
          <input
            type="text"
            name="customer"
            required
            className="input capitalize"
            defaultValue={username}
          />
        </div>

        <div className="mb-5 flex flex-col sm:flex-row sm:items-center">
          <label className="font-semibold sm:basis-40">Phone number</label>
          <div className="w-full grow">
            <input type="tel" name="phone" required className="input" />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-200 p-2 text-sm text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex flex-col sm:flex-row sm:items-center">
          <label className="font-semibold sm:basis-40">Address</label>
          <div className="relative w-full grow">
            <input
              type="text"
              name="address"
              required
              className="input"
              disabled={isLoadingAddress}
              defaultValue={address}
            />
            {!position.latitude && !position.longitude && (
              <span className="absolute right-[4px] top-0.5 z-50">
                <Button
                  disabled={isLoadingAddress}
                  type="small"
                  onClick={handleFetchAddress}
                >
                  Get Position
                </Button>
              </span>
            )}
            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-200 p-2 text-sm text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
        </div>

        <div className="mb-12 flex items-center gap-4">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
            className="h-4 w-4 accent-yellow-400"
          />
          <label htmlFor="priority" className="font-semibold">
            Want to give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.latitude && position.longitude
                ? `${position.latitude}, ${position.longitude}`
                : ""
            }
          />
          <Button
            type="primary"
            disabled={isSubmitting || isLoadingAddress}
            className="inline- rounded-full bg-yellow-400 px-4 py-3 font-semibold uppercase text-stone-800 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Placing order..."
              : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  // console.log(data);

  const order = {
    ...data,
    priority: data.priority === "true",
    cart: JSON.parse(data.cart),
  };

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number. We might need to contact you";
  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

  //DO NOT OVERUSE. IT IS BAD FOR PERFORMANCE OPTIMIZATION
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
