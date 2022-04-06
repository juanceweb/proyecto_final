const express = require("express")
const fs = require("fs")

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// -------------------------------------------------------

const router_productos = express.Router()
app.use("/api/productos", router_productos)
// router_productos.use(express.static("./src/public"))

const router_formulario = express.Router()
app.use("/", router_formulario)
router_formulario.use(express.static("./src/public"))

const router_carrito = express.Router()
app.use("/api/carrito", router_carrito)

// --------------------------PRODUCTOS -----------------------------

// FORMULARIO
router_formulario.get("/", (req, res) => {
    res.status(200).sendFile("./src/index.html")
})

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
router_productos.post("/:bool", async (req, res) => {
    const { body } = req;
    const { bool } = req.params;
    console.log(body)
    let producto = {timestamp: Date.now(), nombre: body.nombre, descripcion: body.descripcion, codigo: body.codigo, foto: body.foto, precio: body.precio, stock: body.stock}
    console.log(producto)    
    if (bool === "true") 
        res.status(200).json(await archivo.save(producto))
    else
        res.status(200).json({error : -1, descripcion: "ruta '/api/productos' método 'POST' no autorizada"})
})

// DELETE 1 PRODUCTO
router_productos.delete("/:id/:bool", async (req, res) => {
    const { id } = req.params;
    const { bool } = req.params;
    if (bool === "true")
        res.status(200).json(await archivo.deleteById(id))
    else
        res.status(200).json({error : -1, descripcion: "ruta '/api/productos' método 'DELETE' no autorizada"})
})

// PUT 1 PRODUCTO
router_productos.put("/:id/:bool", async (req, res) => {
    const { id } = req.params;
    const { bool } = req.params;
    const { body } = req;
    const dict = Object.keys(body)
    const valor = Object.values(body)
    if (bool === "true")     
        res.status(200).json(await archivo.changeById(id, dict[0], valor[0]))
    else
        res.status(200).json({error : -1, descripcion: "ruta '/api/productos' método 'PUT' no autorizada"})
})

// --------------------------CARRITO -----------------------------

// // FORMULARIO
// router_formulario.get("/", (req, res) => {
//     res.status(200).sendFile("./src/index.html")
// })

// GET TODOS LOS PRODUCTOS DEL CARRITO
router_carrito.get("/", async (req, res) =>{
    res.status(200).json(await cart.getAllCarritos())
})

// POST 1 CARRITO
router_carrito.post("/", async (req, res) => {
    res.status(200).json(await cart.saveCarrito())
})

// DELETE 1 CARRITO
router_carrito.delete("/:id", async (req, res) => {
    const { id } = req.params;
    // const { bool } = req.params;
    // if (bool == "true")
    res.status(200).json(await cart.deleteCarritoById(id))
})

// GET 1 CARRITO ESPECIFICO
router_carrito.get("/:id/productos", async (req, res) =>{
    const { id } = req.params;
    res.status(200).json(await cart.getCarritoById(id))
})

// POST EN 1 CARRITO ESPECIFICO
router_carrito.post("/:id/productos", async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const valor = Object.values(body)
    data = await archivo.getById(valor)
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

class Contenedor{
    
    constructor(archivo){
        this.productos = []
        this.maxId = 0
        this.archivo = archivo
    }

    async save(producto){
        await this.getAll()
        this.maxId++
        producto.id = this.maxId
        this.productos.push(producto)
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify(this.productos))
            return producto
        }
        catch (error){
            throw new Error(error)
        }
    }

    async getById(id){
        try {
            const resultado = await this.getAll()
            const found = resultado.find(element => element.id == id)
            if (found == undefined) {
                return {error: "producto no encontrado"}
            }
            else{
                return found
            }
        }
        catch (error){
            throw new Error(error)
        }

    }

    async changeById(id, index, value){
        try {

            const resultado = await this.getAll()
            
            this.productos = []
            
            const found = resultado.find(element => element.id == id)            

            if (found == undefined) {
                return {error: "producto no encontrado"}
            }
            else{
                found[index] = value
                this.productos = resultado
                try {
                    await fs.promises.writeFile(this.archivo, JSON.stringify(this.productos))
                    return this.productos
                }
                catch (error){
                    throw new Error(error)
                }
            }
        }
        catch (error){
            throw new Error(error)
        }

    }

    async getAll(){
        try {
            const productos = JSON.parse( await fs.promises.readFile(this.archivo, "utf-8"))
            this.productos = productos
            this.productos.map((producto) => {
                if (producto.id && this.maxID < producto.id)
                this.maxId = producto.id
            })
            return this.productos
        } 
        catch(error) {
            throw new Error(error)
        }
    }

    async deleteById(id){
        try {
            const resultado = await this.getAll()
            const found = resultado.find(element => element.id == id)
            if (found == undefined) {
                return null
            }
            else{
                const new_array = resultado.filter(element => element.id != found.id)
                try {
                    await fs.promises.writeFile(this.archivo, JSON.stringify(new_array))
                    return "producto borrado!"
                }
                catch (error){
                    throw new Error(error)
                }
            }
        }
        catch (error){
            throw new Error(error)
        }
    }

    async deleteAll(){
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify([]))
        }
        catch (error){
            throw new Error(error)
        }
    }

}

archivo = new Contenedor("./src/archivo.txt")

// ------------------------------------------------------

let carrito_id = 0

class Carrito{

    constructor(archivo){
        this.carritos = []
        this.maxId = 0
        this.archivo = archivo
    }

    async getAllCarritos(){
        try {
            const carritos = JSON.parse( await fs.promises.readFile(this.archivo, "utf-8"))
            this.carritos = carritos
            this.carritos.map((producto) => {                
                if (this.maxId < producto.id)
                this.maxId = producto.id
            })
            return this.carritos
        } 
        catch(error) {
            throw new Error(error)
        }
    }

    async saveCarrito(){
        await this.getAllCarritos()
        this.maxId++
        this.id = this.maxId
        this.time = Date.now()
        this.carritos.push({id: this.id, stamp: this.time , productos: []})        
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify(this.carritos))
            return this.id
        }
        catch (error){
            throw new Error(error)
        }
    }

    async saveProducto(id, data){
        let productos = await this.getCarritoById(id)
        this.time = Date.now()
        productos.push({id: data.id, stamp: this.time , productos: data.producto, precio: data.precio})   
        
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify(this.carritos))
            return this.id
        }
        catch (error){
            throw new Error(error)
        }
    }

    async getCarritoById(id){
        try {
            const resultado = await this.getAllCarritos()
            const found = resultado.find(element => element.id == id)
            if (found == undefined) {
                return {error: "producto no encontrado"}
            }
            else{
                return found.productos
            }
        }
        catch (error){
            throw new Error(error)
        }

    }

    // async changeById(id, index, value){
    //     try {

    //         const resultado = await this.getAll()
            
    //         this.productos = []
            
    //         const found = resultado.find(element => element.id == id)

    //         if (found == undefined) {
    //             return {error: "producto no encontrado"}
    //         }
    //         else{
    //             found[index] = value
    //             this.productos = resultado
    //             try {
    //                 await fs.promises.writeFile(this.archivo, JSON.stringify(this.productos))
    //                 return this.productos
    //             }
    //             catch (error){
    //                 throw new Error(error)
    //             }
    //         }
    //     }
    //     catch (error){
    //         throw new Error(error)
    //     }

    // }

    async deleteProductoById(id, data) {
        try {
            const resultado = await this.getAllCarritos()
            const found = resultado.find(element => element.id == id)

            if (found == undefined) {
                return null
            }
            else{
                const encontrado = found.productos.filter(element => element.id != data)
                found.productos = []
                found.productos.push(encontrado)
                console.log(found.productos);
                console.log('_______________________________');
                
                console.log(resultado);
                try {
                    await fs.promises.writeFile(this.archivo, JSON.stringify(resultado))
                    return "producto borrado!"
                }
                catch (error){
                    throw new Error(error)
                }
            }
        }
        catch (error){
            throw new Error(error)
        }
    }

    async deleteCarritoById(id){
        try {
            const resultado = await this.getAllCarritos()
            const found = resultado.find(element => element.id == id)
            if (found == undefined) {
                return null
            }
            else{
                const new_array = resultado.filter(element => element.id != found.id)
                try {
                    await fs.promises.writeFile(this.archivo, JSON.stringify(new_array))
                    return "producto borrado!"
                }
                catch (error){
                    throw new Error(error)
                }
            }
        }
        catch (error){
            throw new Error(error)
        }
    }

    // async deleteAll(){
    //     try {
    //         await fs.promises.writeFile(this.archivo, JSON.stringify([]))
    //     }
    //     catch (error){
    //         throw new Error(error)
    //     }
    // }

}

cart = new Carrito("./src/carrito.txt")



