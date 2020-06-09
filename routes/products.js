const {Router} = require('express')
const Auth = require('../middleware/auth')
const Product = require('../models/Product')
const router = new Router()
const Errors = require('../errors')

router.get('/', async (req,res) => {
    let products = await Product.all()
    res.json(products)
})

router.get('/:id', async (req,res) => {
    const product = await Product.get(req.params.id)
    if(product){
        res.json(product)
    }else{
        res.status(404).json({
            error: 'Product not found'
        })
    }
})

router.post('/', Auth.admin, async (req,res) => {
    let result = await Product.create(req.body)
    if(result.error){
        res.json({
            error: "Could not create product"
        })
    }else{
        res.json({
            message: "Product created!",
            product: result.product
        })
    }
})

router.patch('/:id', Auth.admin, async (req,res) => {
    let result = await Product.update(req.params.id, req.body)
    switch(result.error){
        case Errors.NO_ERROR:
            res.status(200).json({message: 'Product updated', data: result.data}); break;
        case Errors.NOT_FOUND:
            res.status(404).json({message: `Product with id ${req.params.id} not found`}); break;
        case Errors.INVALID_PARAMETERS:
            res.status(400).json({error: 'Could not update product', message: result.message})
    }
})


router.delete('/:id', Auth.admin, async (req,res) => {
    let result = await Product.destroy(req.params.id)
    if(result.error){
        res.status(400).json({error: 'Could not delete product'})
    }else{
        res.status(200).json({message: 'Product obliteraded'})
    }
})


module.exports = router