import express from "express";
import "./config/db.js";
import ProductosDaoMongo from "./daos/productos/producto_dao_mongo.js";
import CarritoDaoMongo from "./daos/carritos/carrito_dao_mongo.js";

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// app.use("/elejir", express.static(__dirname + "/public"))

// -------------------------------------------------------

const router_productos = express.Router()
app.use("/api/productos", router_productos)
// router_productos.use(express.static("./src/public"))

const router_carrito = express.Router()
app.use("/api/carrito", router_carrito)

// --------------------------MIDDLEWARE -----------------------------

const middle = (req, res, next) =>{
    const { admin } = req.params;
    if (admin === "admin") 
        next()
    else
        res.status(200).json({error : -1, descripcion: "ruta '/api/productos' método no autorizado"})
}

// --------------------------PRODUCTOS -----------------------------

// GET TODOS LOS PRODUCTOS
router_productos.get("/", async (req, res) =>{
    res.status(200).json(await prod.readAllData())
})

// GET 1 PRODUCTO ESPECIFICO
router_productos.get("/:nombre", async (req, res) =>{
    const { nombre } = req.params;
    console.log(nombre);
    res.status(200).json(await prod.readOneData({nombre:nombre}))
})

// POST 1 PRODUCTO
router_productos.post("/:admin", middle, async (req, res) => {
    const { body } = req;
    let producto = {nombre: body.nombre, descripcion: body.descripcion, codigo: body.codigo, foto: body.foto, precio: body.precio, stock: body.stock}
    res.status(200).json(await prod.createData(producto))

})

// DELETE 1 PRODUCTO
router_productos.delete("/:nombre/:admin", middle, async (req, res) => {
    const { nombre } = req.params;
    res.status(200).json(await prod.deleteOneData({nombre:nombre}))

})

// PUT 1 PRODUCTO
router_productos.put("/:nombre/:admin", middle, async (req, res) => {
    const { nombre } = req.params;
    const { body } = req;
    res.status(200).json(await prod.updateOneData({nombre: nombre}, body))
})

// --------------------------CARRITO -----------------------------

// GET TODOS LOS PRODUCTOS DEL CARRITO
router_carrito.get("/", async (req, res) =>{
    res.status(200).json(await cart.readAllData())
})

// POST 1 CARRITO 
router_carrito.post("/", async (req, res) => {
    res.status(200).json(await cart.createCarrito())
})

// DELETE 1 CARRITO -
router_carrito.delete("/:id", async (req, res) => {
    const { id } = req.params;
    res.status(200).json(await cart.deleteOneData({carrito: id}))
})

// GET 1 CARRITO ESPECIFICO 
router_carrito.get("/:id/productos", async (req, res) =>{
    const { id } = req.params;
    res.status(200).json(await cart.readOneData({carrito: id}))
})

// POST EN 1 CARRITO ESPECIFICO
router_carrito.post("/:id/productos", async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const valor = Object.values(body)
    let data = await prod.readOneData({nombre: valor[0]})
    console.log(data);
    res.status(200).json(await cart.pushCarrito(id, data))
})

// DELETE 1 PRODUCTO DE 1 CARRITO ESPECIFICO
router_carrito.delete("/:id/productos", async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const valor = Object.values(body)
    let data = await prod.readOneData({nombre: valor[0]})     
    res.status(200).json(await cart.pullCarrito(id, data))
})


// -------------------------------------------------------

const port = 8081
const server = app.listen(port, ()=>{
    console.log(`Servidor en el puerto http://localhost:${port}`)
})
server.on("error", (err) =>{
    console.log(err)
})

// -------------------------------------------------------

const prod = new ProductosDaoMongo("productos")
const cart = new CarritoDaoMongo("carrito")