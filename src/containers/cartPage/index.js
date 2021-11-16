import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CartItem from "../../components/cartItem";
import Button from "../../components/common/button";
import useDevice from "../../utils/customHooks/useDevices";
import { LocalStorage, pubsub } from "../../utils";
import topic from "../../constant/topic";
import "./index.scss";

import {
  cartTitleLabel,
  cartItemEmptyLabel,
  favoriteItemLabel,
  bestBuyLabel,
  promoCodeApplyLabel,
  proceedToCheckoutLabel,
  totalAmountLabel,
  continueShoppingLabel,
  itemLabel,
} from "../../constant";

const Cart = (props) => {
  const { isDesktop } = useDevice();
  const initialCart = JSON.parse(localStorage.getItem("cartItems")) || [];
  const history = useHistory();

  const [cartItems, setCartItems] = useState(initialCart);
  const [noOfItemInCart, setNoOfItemInCart] = useState(cartItems.length);
  const listenCartCount = (msg, data) => {
    setNoOfItemInCart(data);
  };

  useEffect(() => {
    pubsub.subscribe(topic.ADD_TO_CART, listenCartCount);
  });

  // close cart
  const handleCloseCart = () => {
    if (isDesktop) {
      props.handleClose && props.handleClose();
    } else {
      history.push("/products");
    }
  };

  const handleStartShopping = () => {
    if (isDesktop) {
      props.handleClose && props.handleClose();
    } else {
      history.push("/products");
    }
  };

  // increment cart item qty
  const handleIncrementItemQty = (item) => {
    const cartItems = LocalStorage.getItem("cartItems");
    cartItems.length &&
      cartItems.map((singleCartItem) => {
        if (singleCartItem.id === item.id) {
          singleCartItem.count = singleCartItem.count + 1;
        }
      });
    LocalStorage.setItem("cartItems", cartItems);
    setCartItems(cartItems);
    pubsub.publish(topic.ADD_TO_CART, cartItems.length);
  };

  // decrement cart item qty
  const handleDecrementItemQty = (item) => {
    const cartItems = LocalStorage.getItem("cartItems");
    cartItems.length &&
      cartItems.map((singleCartItem) => {
        if (singleCartItem.id === item.id) {
          singleCartItem.count = singleCartItem.count - 1;
        }
      });
    LocalStorage.setItem("cartItems", cartItems);
    setCartItems(cartItems);
    pubsub.publish(topic.ADD_TO_CART, cartItems.length);
  };

  // remove item from cart
  const handleRemoveItem = (item) => {
    let cartItems = LocalStorage.getItem("cartItems");
    cartItems = cartItems.length
      ? cartItems.filter((singleCartItem) => {
          return singleCartItem.id !== item.id;
        })
      : [];
    LocalStorage.setItem("cartItems", cartItems);
    setCartItems(cartItems);
    pubsub.publish(topic.ADD_TO_CART, cartItems.length);
  };

  return (
    <div
      className={`${
        !isDesktop ? "container-fluid wrapper " : ""
      } cart-container`}
    >
      <div className="cart-card">
        <div className="cart-header">
          <h1 className="cart-title">
            {`${cartTitleLabel} `}
            {cartItems?.length > 0 && (
              <span className="item-count">{`( ${
                cartItems ? noOfItemInCart : 0
              } ${itemLabel} )`}</span>
            )}
          </h1>
          <span className="close_button_container">
            <svg
              viewBox="0 0 329.26933 329"
              height="12"
              width="12"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="close"
              onClick={handleCloseCart}
            >
              <path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0" />
            </svg>
          </span>
        </div>
        <div
          className="cart-body"
          onScroll={(e) => {
            e.stopPropagation();
          }}
        >
          {cartItems?.length > 0 ? (
            cartItems.map((item) => (
              <CartItem
                handleIncrementItem={handleIncrementItemQty}
                handleDecrementItem={handleDecrementItemQty}
                handleRemoveItem={handleRemoveItem}
                item={item}
                key={item.id}
              />
            ))
          ) : (
            <div className="empty_cart_title_container">
              <h4 className="empty_cart_title">{cartItemEmptyLabel}</h4>
              <p>{favoriteItemLabel}</p>
            </div>
          )}
          {cartItems?.length > 0 && (
            <div className="cart-banner">
              <img
                loading="lazy"
                src="static/images/lowest-price.png"
                alt="lowest-price"
              />
              <span>{bestBuyLabel}</span>
            </div>
          )}
        </div>
        <div className={`cart-footer ${cartItems.length ? "" : "empty-cart"}`}>
          {cartItems?.length > 0 ? (
            <>
              <div className="promo_code_desc">{promoCodeApplyLabel}</div>
              <Button variant="primary" className=" btn-block btn-checkout">
                {proceedToCheckoutLabel}
                <span className="price">
                  {`${totalAmountLabel} `}
                  {cartItems?.length > 0 &&
                    cartItems.reduce(
                      (total, current) => total + current.count * current.price,
                      0
                    )}
                </span>
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              className="btn-block"
              onClick={handleStartShopping}
            >
              {continueShoppingLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;