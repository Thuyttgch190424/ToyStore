const express = require('express')
const { insertToDB, getAll, deleteObject, getDocumentById, updateDocument, dosearch, category } = require('./databaseHandler')

const app = express();

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
    var result = await getAll("Products")
    res.render('home', { products: result })
})
//insert product
app.post('/insert', async (req, res) => {
    const name = req.body.txtName
    const price = req.body.txtPrice
    const url = req.body.txtImage
    const category = req.body.txtCategory
    if (name.trim().length == 0) {
        res.render('insert', { nameError: "Please enter Name!" })
    }
    else if (price.trim().length == 0) {
        res.render('insert', { nameError: null, priceError: "Please enter Price!" })
    }
    //check not number
    else if (isNaN(price)) {
        res.render('insert', { nameError: null, priceError: "Only enter Number" });
        return false;
    };
    //check not input negative numbers
    if (price < 1) {
        res.render('insert', { nameError: null, priceError: "Price must be greater than 0" });
        return false;
    }
    else if (category.trim().length == 0) {
        res.render('insert', { categoryError: "Please enter a category" })
    }
    else if (url.length == 0) {
        var result = await getAll("Products")
        res.render('insert', { products: result, urlError: 'Please enter Image URL!' })
    }
    else {

        //xay dung doi tuong insert
        const obj = { name: name, price: price, category: category, image: url }
        //goi ham de insert vao DB
        await insertToDB(obj, "Products")
        res.redirect('/')
    }
})
// search 
app.post('/search', async (req, res) => {
    const searchText = req.body.txtName;
    const result = await dosearch(searchText, "Products")
    res.render('home', { products: result })
})
//delete one product (id)
app.get('/delete/:id', async (req, res) => {
    const idValue = req.params.id
    //viet ham xoa object dua tren id
    await deleteObject(idValue, "Products")
    res.redirect('/')
})
//category
app.post('/category', async (req, res) => {
    const categorya = req.body.txtName;
    const result = await category(categorya, "Products")
    res.render('home', { products: result })
})

app.get('/edit/:id', async (req, res) => {
    const idValue = req.params.id
    //lay thong tin cu cua sp cho nguoi dung xem, sua
    const productToEdit = await getDocumentById(idValue, "Products")
    //hien thi ra de sua
    res.render("edit", { product: productToEdit })
})

app.get('/addproduct', (req, res) => {
    res.render('insert')
})
//update product
app.post('/update', async (req, res) => {
    const id = req.body.txtId
    const name = req.body.txtName
    const price = req.body.txtPrice
    const image = req.body.txtImage
    const category = req.body.txtCategory
    let updateValues = { $set: { name: name, price: price, category: category, image: image } };

    if (name.trim().length == 0) {
        res.render('edit', { nameError: "Please enter Name!" })
    }
    else if (price.trim().length == 0) {
        res.render('edit', { nameError: null, priceError: "Please enter Number!" })
    }
    else if (isNaN(price)) {
        res.render('edit', { nameError: null, priceError: "Only enter Number" })
        return false;
    }
    else if (price < 1) {
        res.render('edit', { nameError: null, priceError: "Price must be greater than 0" })
        return false;
    }
    else if (category.trim().length == 0) {
        res.render('edit', { nameError: null, priceError: null, categoryError: "Please enter a category" })
    }
    else {
        await updateDocument(id, updateValues, "Products")
        res.redirect('/')
    }
})
//server connecting
const PORT = 5432;
app.listen(PORT);
console.log('server running :', PORT);