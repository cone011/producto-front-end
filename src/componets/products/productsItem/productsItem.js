import { Fragment, useReducer } from "react";
import { todoReducer } from "../../../context/reducer";
import { defaultTodoReducer } from "../../../util/const";
import { getProductoById } from "../../../api/productApi";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../UI/customModal/customModal";
import classes from "./productsItem.module.css";

const ProductsItem = (props) => {
  const { name, imgUrl, price, id } = props;
  const { amount } = price;
  const [todo, dispatchTodo] = useReducer(todoReducer, defaultTodoReducer);
  const navigate = useNavigate();

  const onSendToProductoDetail = async () => {
    dispatchTodo({ type: "SET_LOADING", message: "FETCHING THE PRODUCT" });
    let result = await getProductoById(id);
    dispatchTodo({ type: "END" });
    navigate(`/product-detail`, {
      state: { productObject: result, item: result.item },
    });
  };

  return (
    <Fragment>
      <div className={classes.Products}>
        <Card>
          <Card.Img variant="top" src={imgUrl} alt={name} />
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Subtitle style={{ paddingBottom: 10 }}>
              <span className={classes.amount}>$ {amount}</span>
            </Card.Subtitle>
            <Button
              className={classes.btnDetail}
              onClick={onSendToProductoDetail}
            >
              View Product
            </Button>
          </Card.Body>
        </Card>
      </div>
      {todo.isLoading && (
        <CustomModal message={todo.message} typeModal={todo.typeModal} />
      )}
    </Fragment>
  );
};

export default ProductsItem;
