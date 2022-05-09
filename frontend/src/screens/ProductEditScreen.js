import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProductDetails, updateProduct } from '../actions/productActions'
import FormContainer from '../components/FormContainer'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import axios from 'axios'

const ProductEditScreen = ({ match, history }) => {
    const productId = match.params.id
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [image, setImage] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [uploading, setUploading] = useState(false)

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET })
            history.push('/admin/productlist')
        } else {
            if (!product.name || product._id !== productId) {
                dispatch(listProductDetails(productId))
            } else {
                setName(product.name)
                setBrand(product.brand)
                setDescription(product.description)
                setImage(product.image)
                setCategory(product.category)
                setPrice(product.price)
                setCountInStock(product.countInStock)
            }
        }



    }, [dispatch, product, productId, history, successUpdate])


    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post('/api/uploads', formData, config)
            setImage(data)
            setUploading(false)
        } catch (error) {
            console.log(error);
            setUploading(false)
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(updateProduct({
            _id: productId,
            name,
            price,
            brand,
            description,
            image,
            category,
            countInStock
        }))

    }
    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                    : (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId='name'>
                                <Form.Label>
                                    Name
                                </Form.Label>
                                <Form.Control type='name' placeholder='Enter Your Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}>

                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='price'>
                                <Form.Label>
                                    Price
                                </Form.Label>
                                <Form.Control type='price' placeholder='0'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}>

                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='image'>
                                <Form.Label>
                                    Image
                                </Form.Label>
                                <Form.Control type='text' placeholder='Enter image url'
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}>

                                </Form.Control>
                                <Form.File id='image-file' label='Choose File' custom onChange={handleFileUpload}>
                                </Form.File>
                                {uploading && <Loader />}
                            </Form.Group>

                            <Form.Group controlId='brand'>
                                <Form.Label>
                                    Brand
                                </Form.Label>
                                <Form.Control type='brand' placeholder='0'
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}>

                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='countInStock'>
                                <Form.Label>
                                    CountInStock
                                </Form.Label>
                                <Form.Control type='countInStock' placeholder='0'
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}>

                                </Form.Control>
                            </Form.Group>


                            <Form.Group controlId='category'>
                                <Form.Label>
                                    Category
                                </Form.Label>
                                <Form.Control type='category' placeholder='0'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}>

                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='description'>
                                <Form.Label>
                                    Description
                                </Form.Label>
                                <Form.Control type='description' placeholder='Product Description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}>

                                </Form.Control>
                            </Form.Group>




                            <Button type='submit' variant='primary'>
                                Update
                            </Button>
                        </Form>
                    )}

            </FormContainer>
        </>

    )
}

export default ProductEditScreen
