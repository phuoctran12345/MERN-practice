import React, { useState } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import './NewProduct.css';

interface NewProductProps {
  onAddProduct: (productName: string, productPrice: string) => void;
}

const NewProduct: React.FC<NewProductProps> = ({ onAddProduct }) => {
  const [enteredTitle, setEnteredTitle] = useState<string>('');
  const [enteredPrice, setEnteredPrice] = useState<string>('');

  const titleChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEnteredTitle(event.target.value);
  };

  const priceChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEnteredPrice(event.target.value);
  };

  const submitProductHandler = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onAddProduct(enteredTitle, enteredPrice);
    setEnteredTitle('');
    setEnteredPrice('');
  };

  return (
    <section id="new-product">
      <h2>Add a New Product</h2>
      <form onSubmit={submitProductHandler}>
        <Input
          type="text"
          label="Title"
          id="title"
          value={enteredTitle}
          onChange={titleChangeHandler}
        />
        <Input
          type="number"
          label="Price"
          step={0.01}
          id="price"
          value={enteredPrice}
          onChange={priceChangeHandler}
        />
        <Button type="submit">ADD PRODUCT</Button>
      </form>
    </section>
  );
};

export default NewProduct;

