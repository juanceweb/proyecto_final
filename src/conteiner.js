const fs = require("fs")

class Contenedor{
    constructor(archivo){
        this.productos = []
        this.maxID = 0
        this.archivo = archivo
    }

    async save(producto){
        await this.getAll()
        this.maxId++
        producto.id = this.maxId
        this.productos.push(producto)
        try {
        await fs.promises.writeFile(this.archivo, JSON.stringify(this.productos))
        return producto.id
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
            return null
        }
        else{
            return found
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

export default Contenedor