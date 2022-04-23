import express from "express";
import ProductosDaoArchivo from "./daos/productos/producto_dao_archivo.js";
import CarritoDaoArchivo from "./daos/carritos/carrito_dao_archivo.js";

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// app.use("/elejir", express.static(__dirname + "/public"))

// -------------------------------------------------------

const router_productos = express.Router()
app.use("/api/productos", router_productos)
// router_productos.use(express.static("./src/public"))

const router_formulario = express.Router()
app.use("/", router_formulario)
router_formulario.use(express.static("./src/public"))

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
    res.status(200).json(await archivo.getAll())
})

// GET 1 PRODUCTO ESPECIFICO
router_productos.get("/:id", async (req, res) =>{
    const { id } = req.params;
    res.status(200).json(await archivo.getById(id))
})

// POST 1 PRODUCTO
router_productos.post("/:admin", middle, async (req, res) => {
    const { body } = req;
    let producto = {timestamp: Date.now(), nombre: body.nombre, descripcion: body.descripcion, codigo: body.codigo, foto: body.foto, precio: body.precio, stock: body.stock}
    res.status(200).json(await archivo.save(producto))

})

// DELETE 1 PRODUCTO
router_productos.delete("/:id/:admin", middle, async (req, res) => {
    const { id } = req.params;
    res.status(200).json(await archivo.deleteById(id))

})

// PUT 1 PRODUCTO
router_productos.put("/:id/:admin", middle, async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const dict = Object.keys(body)
    const valor = Object.values(body)   
    res.status(200).json(await archivo.changeById(id, dict[0], valor[0]))
})

// --------------------------CARRITO -----------------------------

// GET TODOS LOS PRODUCTOS DEL CARRITO
router_carrito.get("/", async (req, res) =>{
    res.status(200).json(await cart.getAll())
})

// POST 1 CARRITO  --
router_carrito.post("/", async (req, res) => {
    let time = Date.now()
    res.status(200).json(await cart.save({stamp: time, productos: []}))
})

// DELETE 1 CARRITO --
router_carrito.delete("/:id", async (req, res) => {
    const { id } = req.params;
    res.status(200).json(await cart.deleteById(id))
})

// GET 1 CARRITO ESPECIFICO --
router_carrito.get("/:id/productos", async (req, res) =>{
    const { id } = req.params;
    res.status(200).json(await cart.getById(id))
})

// POST EN 1 CARRITO ESPECIFICO
router_carrito.post("/:id/productos", async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const valor = Object.values(body)
    const data = await archivo.getById(valor)
    res.status(200).json(await cart.saveProducto(id, data))
})

// DELETE 1 PRODUCTO DE 1 CARRITO ESPECIFICO
router_carrito.delete("/:id/productos", async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const valor = Object.values(body)      
    res.status(200).json(await cart.deleteProductoById(id, valor))
})


// -------------------------------------------------------

const port = 8080
const server = app.listen(port, ()=>{
    console.log(`Servidor en el puerto http://localhost:${port}`)
})
server.on("error", (err) =>{
    console.log(err)
})

// -------------------------------------------------------


const archivo = new ProductosDaoArchivo("./src/archivos/productos.txt")
const cart = new CarritoDaoArchivo("./src/archivos/carrito.txt")



