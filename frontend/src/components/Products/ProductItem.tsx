import React from 'react';
import './ProductItem.css';

interface ProductItemProps {
  name: string;
  price: number;
}

const ProductItem: React.FC<ProductItemProps> = ({ name, price }) => {
  return (
    <li className="product-item">
      <h2>{name}</h2>
      <p>Price: ${price}</p>
    </li>
  );
};

export default ProductItem;

