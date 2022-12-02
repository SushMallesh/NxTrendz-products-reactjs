import './index.css'

const SimilarProductItem = props => {
  const {eachProduct} = props
  const {title, brand, price, rating, imageUrl} = eachProduct

  return (
    <li className="similar-item-container">
      <img
        className="product-item-image"
        src={imageUrl}
        alt={`similar product ${title}`}
      />

      <h1 className="product-title">{title}</h1>
      <p className="product-brand">by {brand}</p>
      <div className="price-rating-card">
        <p>Rs {price}/-</p>
        <div className="product-rating-card">
          <p>{rating}</p>
          <img
            className="star"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
