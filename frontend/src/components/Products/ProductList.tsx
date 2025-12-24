import React from 'react';
import ProductItem from './ProductItem';
import './ProductList.css';
import { Product } from '../../types/product.types';

interface ProductListProps {
  items: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ items }) => {
  let content: React.ReactNode;
  
  if (!items || items.length === 0) {
    content = <p>Could not find any products. Maybe create one?</p>;
  } else {
    content = (
      <ul className="product-list">
        {items.map((p) => (
          <ProductItem key={p.id} name={p.title} price={p.price} />
        ))}
      </ul>
    );
  }

  return <section id="products">{content}</section>;
};

export default ProductList;

