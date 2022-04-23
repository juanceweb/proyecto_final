import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    nombre: {
        type: String,
        required : true,
        max: 50
    },
    descripcion: {
        type: String,
        required : true,
        max: 100
    },
    codigo: {
        type: Number,
        required : true
    },
    foto: {
        type: String,
        max: 100
    },
    precio: {
        type: Number,
        required : true
    },
    stock: {
        type: Number,
        required : true
    }
})

const Schema2 = new mongoose.Schema({
    carrito: {
        type: Number,
        required: true
    },
    productos: [Schema]
})

class ContenedorMongo {

    constructor(base) {
        if (base === "carrito") {
            this.model = mongoose.model(base, Schema2)
        }
        else {
            this.model = mongoose.model(base, Schema)
        }
    }

    async createData(data) {
        try {
            const response = await this.model.create(data)
            return response
        } catch (error) {
            console.log(error);
        }
    }

    async readAllData() {
        try {
            const response = await this.model.find()
            return response
        } catch (error) {
            console.log(error);
        }
    }

    async readOneData(data) {
        try {
            const response = await this.model.findOne(data,{_id: 0, __v: 0})
            return response
        } catch (error) {
            console.log(error);
        }
    }

    async deleteOneData(data) {
        try {
            const response = await this.model.deleteOne(data)
            return response
        } catch (error) {
            console.log(error);
        }
    }


    async  updateOneData(data, new_data) {
        try {
            const response = await this.model.updateOne(data,new_data)
            return response
        } catch (error) {
            console.log(error);
        }
    }

    async createCarrito() {
        try {
            let value = await this.model.findOne({}, {_id: 0, carrito: 1}).sort({carrito : -1}).limit(1)
            let id;
            if (value == null) {
                id = 1
            }
            else{
                id = value.carrito + 1
            }
            const response = await this.model.create({carrito: id, productos: []})
            return response
        } catch (error) {
            console.log(error);
        }
    }

    async pushCarrito(id, data) {
        try {
            const response = await this.model.updateOne({carrito: id}, { $push: { productos: [data] } })
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    async pullCarrito(id, data) {
        try {
            const response = await this.model.updateOne({carrito: id}, { $pull: { productos: data } })
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }


}

export default ContenedorMongo