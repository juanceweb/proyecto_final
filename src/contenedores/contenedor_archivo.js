import * as fs from 'fs';

class ContenedorProducto{
    
    constructor(ruta){
        this.productos = []
        this.maxId = 0
        this.archivo = ruta
    }

    async getAll(){
        try {
            const productos = JSON.parse( await fs.promises.readFile(this.archivo, "utf-8"))
            this.productos = productos
            this.productos.map((producto) => {
                if (producto.id && this.maxId < producto.id)
                this.maxId = producto.id
            })
            return this.productos
        } 
        catch(error) {
            throw new Error(error)
        }
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

    async saveProducto(id, data){
        let productos = await this.getById(id)
        productos.productos.push(data)
        console.log(productos);
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify(this.productos))
            return this.id
        }
        catch (error){
            throw new Error(error)
        }
    }

        async deleteProductoById(id, data) {
        try {
            const resultado = await this.getAll()
            const found = resultado.find(element => element.id == id)
            console.log("found:", found);

            if (found == undefined) {
                return null
            }
            else{
                const encontrado = found.productos.filter(element => element.id != data)
                found.productos = []
                found.productos.push(encontrado)
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
}

export default ContenedorProducto
