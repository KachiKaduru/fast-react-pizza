// import { useState } from "react";

import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  // const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const formErrors = useActionData();

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-bold">Ready to order? Let&apos;s go!</h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center">
          <label className="font-semibold sm:basis-40">First Name</label>
          <input type="text" name="customer" required className="input" />
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
          <div className="w-full grow">
            <input type="text" name="address" required className="input" />
          </div>
        </div>

        <div className="mb-12 flex items-center gap-4">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
            className="h-4 w-4 accent-yellow-400"
          />
          <label htmlFor="priority" className="font-semibold">
            Want to give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <Button
            type="primary"
            disabled={isSubmitting}
            className="inline- rounded-full bg-yellow-400 px-4 py-3 font-semibold uppercase text-stone-800 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Placing order..." : "Order now"}
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
    priority: data.priority === "on",
    cart: JSON.parse(data.cart),
  };

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number. We might need to contact you";
  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
