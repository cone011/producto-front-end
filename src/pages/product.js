import { useCallback, useEffect, useReducer, useState } from "react";
import CartProvider from "../store/CartProvider";
import CartList from "../componets/cart/cartList/cartList";
import Header from "../componets/UI/header/header";
import { getProductoCategory, getSearchProducto } from "../api/productApi";
import { getAllCategory } from "../api/categoryApi";
import ProductList from "../componets/products/productsList/productsList";
import { defaultTodoReducer } from "../util/const";
import CustomModal from "../componets/UI/customModal/customModal";
import classes from "./product.module.css";
import Filter from "../componets/UI/filters/filters";

const todoReducer = (curTodo, action) => {
  switch (action.type) {
    case "SET_CART":
      return { ...curTodo, cartIsShow: true };
    case "SET_LOADING":
      return {
        ...curTodo,
        isLoading: true,
        message: action.message,
        typeModal: "LOADING",
      };
    case "SET_CONFIRM":
      return {
        ...curTodo,
        cartIsShow: action.cartIsShow,
        isLoading: action.isLoading,
        message: action.message,
        confirm: true,
        typeModal: "CONFIRM",
      };
    case "END":
      return {
        ...curTodo,
        cartIsShow: false,
        isLoading: false,
        confirm: false,
      };
    default:
      throw new Error("The action dont exist");
  }
};

const Product = () => {
  const [listProduct, setListProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [todo, dispatchTodo] = useReducer(todoReducer, defaultTodoReducer);
  const assigmentData = useCallback(async () => {
    try {
      dispatchTodo({ type: "SET_LOADING", message: "LOADING" });
      let result = await getProductoCategory("MLA5725");
      let resultCategories = await getAllCategory();
      let dataObtain = result.results;
      setListProduct(dataObtain);
      setCategories(resultCategories);
      dispatchTodo({ type: "END" });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const onSearchByCategory = async (valueReturn) => {
    try {
      dispatchTodo({ type: "SET_LOADING", message: "LOADING" });
      let result = await getProductoCategory(valueReturn);
      let dataObtain = result.results;
      setListProduct(dataObtain);
      dispatchTodo({ type: "END" });
    } catch (err) {
      console.log(err);
    }
  };

  const onSearchData = async (dataValue) => {
    try {
      dispatchTodo({ type: "SET_LOADING", message: "LOADING" });
      let result = await getSearchProducto(dataValue);
      console.log(result.result.results);
      let dataObtain = result.result.results;
      dispatchTodo({ type: "END" });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    assigmentData();
  }, [assigmentData]);

  const showCartHandler = () => {
    dispatchTodo({ type: "SET_CART" });
  };

  const showConfirmHandler = () => {
    dispatchTodo({
      type: "SET_CONFIRM",
      cartIsShow: false,
      message: "The order was processed correctly",
    });
  };

  const hideModal = () => {
    dispatchTodo({ type: "END" });
  };

  return (
    <CartProvider>
      <Header onShowCart={showCartHandler} />
      {todo.cartIsShow && (
        <CartList onCloseModal={hideModal} onConfirmCart={showConfirmHandler} />
      )}
      {todo.isLoading && (
        <CustomModal typeModal={todo.typeModal} message={todo.message} />
      )}
      {todo.confirm && (
        <CustomModal
          onCloseModal={hideModal}
          message={todo.message}
          typeModal={todo.typeModal}
        />
      )}
      <div className={classes.Home}>
        <Filter
          listCategory={categories}
          onReturnCategoryValue={onSearchByCategory}
        />
        <ProductList listProduct={listProduct} onSearchValue={onSearchData} />
      </div>
    </CartProvider>
  );
};

export default Product;
