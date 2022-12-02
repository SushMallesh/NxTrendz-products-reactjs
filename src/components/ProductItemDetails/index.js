import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productDetails: {},
    quantity: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const productApiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(productApiUrl, options)
    const fetchedData = await response.json()

    const updatedData = {
      id: fetchedData.id,
      availability: fetchedData.availability,
      brand: fetchedData.brand,
      description: fetchedData.description,
      imageUrl: fetchedData.image_url,
      price: fetchedData.price,
      rating: fetchedData.rating,
      title: fetchedData.title,
      similarProducts: fetchedData.similar_products,
      totalReviews: fetchedData.total_reviews,
    }

    if (response.ok === true) {
      this.setState({
        apiStatus: apiStatusConstants.success,
        productDetails: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickMinus = () => {
    this.setState(prevState => {
      const {quantity} = prevState
      if (quantity > 1) {
        this.setState({quantity: quantity - 1})
      }
    })
  }

  onClickPlus = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderAddToCartButton = () => {
    const {quantity} = this.state
    return (
      <div className="quantity-counter">
        <button
          onClick={this.onClickMinus}
          type="button"
          className="icon-button"
        >
          <BsDashSquare className="icon" />
        </button>
        <p className="quantity">{quantity}</p>
        <button
          onClick={this.onClickPlus}
          type="button"
          className="icon-button"
        >
          <BsPlusSquare className="icon" />
        </button>

        <button type="button" className="add-to-cart-button">
          ADD TO CART
        </button>
      </div>
    )
  }

  renderProductDetails = () => {
    const {productDetails} = this.state
    const {
      title,
      availability,
      description,
      brand,
      price,
      rating,
      totalReviews,
    } = productDetails

    return (
      <div className="product-details-container">
        <h1 className="title">{title}</h1>
        <p className="price">Rs {price}/-</p>
        <div className="rating-reviews-card">
          <div className="rating-card">
            <p>{rating}</p>
            <img
              className="star"
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
            />
          </div>
          <p className="reviews">{totalReviews} Reviews</p>
        </div>
        <p className="description">{description}</p>
        <div className="item-details-side-heading">
          <span>Available: </span>
          <p className="item-details"> {availability}</p>
        </div>
        <div className="item-details-side-heading">
          <span>Brand: </span>
          <p className="item-details"> {brand}</p>
        </div>
        <hr className="separator" />
        {this.renderAddToCartButton()}
      </div>
    )
  }

  renderSimilarProducts = () => {
    const {productDetails} = this.state
    const {similarProducts} = productDetails

    const similarProductsList = similarProducts.map(eachProduct => ({
      imageUrl: eachProduct.image_url,
      title: eachProduct.title,
      brand: eachProduct.brand,
      price: eachProduct.price,
      rating: eachProduct.rating,
      id: eachProduct.id,
    }))
    return (
      <div className="similar-products-container">
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-items-container">
          {similarProductsList.map(eachProduct => (
            <SimilarProductItem
              key={eachProduct.id}
              eachProduct={eachProduct}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderSuccessView = () => {
    const {productDetails} = this.state
    const {imageUrl} = productDetails
    return (
      <div className="product-container">
        <img className="product-image" src={imageUrl} alt="product" />
        {this.renderProductDetails()}
        {this.renderSimilarProducts()}
      </div>
    )
  }

  goToProducts = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="error-view-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1 className="product-not-found">Product Not Found</h1>
      <button
        onClick={this.goToProducts}
        type="button"
        className="continue-button"
      >
        Continue Shopping
      </button>
    </div>
  )

  renderLoader = () => (
    <div>
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderAllViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return <h1>default</h1>
    }
  }

  render() {
    return (
      <>
        <Header />

        {this.renderAllViews()}
      </>
    )
  }
}

export default ProductItemDetails
