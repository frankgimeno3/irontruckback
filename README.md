# Irontruck backend

Developed as the final project of our web development bootcamp at Ironhack Barcelona. It's a MERN Stack application, check the frontend repository [here](https://github.com/frankgimeno3/irontruckback).

## About
Hi! We are Frank, Eduardo and Ivan. We are fullStack web developers. This project consists of a very useful tool so that carriers and senders who want to make shipments can contact each other in a simple and effective way. In this way, the carriers will be able to fill the trucks so that the routes are more profitable for them, and on the other hand, the senders will always have the service of different carriers available. 

![Project Image](PONER IMAGEN DEL PROYECTO "Project Image")

## Deployment
You can check the app fully deployed [here](ENLACE DEPLOY). If you wish to view the API deployment instead, check [here](DEPLOY API).

## Work structure
We use [Trello](https://trello.com/home) to organize the workflow.

## Installation guide
- Fork this repo
- Clone this repo 

```shell
$ cd irontruckback
$ npm install
$ npm start
```

## Models
#### User.model.js
```js
const { Schema, model } = require("mongoose");

const UserSchema = new Schema(

    {
        email: { type: String, required: [true, "Email is required."],unique: true, lowercase: true, trim: true},
        username: {type: String,required: [true, "Name is required."]}
        password: { type: String,required: [true, "Password is required."]},
        image: {type: String},
        phoneNumber: {type: Number,required: [true, "Phone Number is required."],unique: true},    
        direccion: {type: String,required: [true, "Direccion is required."]  },
        envios: { type: [Schema.Types.ObjectId], ref: "Envio" },
        isAdmin: { type: Boolean, default: false 
    },
    {   timestamps: true}
);

const User = model("Comment", UserSchema);

module.exports = User;
```
#### Transportist.model.js
```js
        const { Schema, model } = require("mongoose");

        const transportistaSchema = new Schema(
       { 
        email: { type: String, required: [true, "Email is required."],unique: true, lowercase: true, trim: true},
        username: {type: String,required: [true, "Name is required."]}
        password: { type: String,required: [true, "Password is required."]},
        image: {type: String},
        phoneNumber: {type: Number,required: [true, "Phone Number is required."],unique: true},
        company: String,
        NIF: String,
        matricula: { type: String,required: [true, "Matricula is required."]}
        profesionalType: { type: String,enum: ["Empresa", "Autonomo"],required: [true, "Name is required."]},
        direccion: {type: String,required: [true, "Direccion is required."]  },
        envios: { type: [Schema.Types.ObjectId], ref: "Envio" },
        isAdmin: { type: Boolean, default: false },
        },
         { timestamps: true} );

        const Transpostist = model("transportist", transportistaSchema);

        module.exports = Transportista;
       
       
```
#### Shipment.model.js
```js
const { Schema, model } = require("mongoose");

const shipmentSchema = new Schema(

    {
        author: { type: Schema.Types.ObjectId, ref: "User"},
        creationDate: { type: Date,required: true },
        pickUpProvince: {type: String,  required: true},
        pickUpDireccion: {type: String, required: true},
        deliveryDireccion: { type: String,  required: true},
        deliveryProvince: { type: String, required: true},
        pallets: { type: Number, required: true},
        request: { type: Schema.Types.ObjectId, ref: "Request"},
        estado: {type: String, enum: ["Abierta", "Negociando", "Completada"], default: "Abierta" }
      },
     { timestamps: true }
);
const Shipment = model("News", shipmentSchema);
module.exports = Shipment;   
      
````
#### Request.model.js
```js
const { Schema, model } = require("mongoose");

const requestSchema = new Schema(
    {
     date: { type: Date,default: Date.now, required: true},
     author: {  type: Schema.Types.ObjectId, ref: "Transportist"},         
     shipment: { type: Schema.Types.ObjectId, ref: "Shipment"},            
    },
    { timestamps: true, }
);
const Request = model("Comment", requestSchema);
module.exports = Request;
});
```

## User roles
| Role  | Capabilities                                                                                                                               | Property       |
| :---: | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| User  | Can login/logout. User can create shipments but can only see yours                                                                                                                         | isAdmin: false |
| Transportist  | Can login/logout. Can read all the shipments. And can make a request to user shipments.                                                                                                                      | isAdmin: false |
| Admin | Can login/logout. Can read, edit or delete all the Shipments. Can create a new Shipment. Can read all user's orders and edit or delete them. | isAdmin: true  |

## API Reference
| Method | Endpoint                    | Require                                             | Response (200)                                                        | Action                                                                    |
| :----: | --------------------------- | --------------------------------------------------- |---------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| POST   | /signup                     | const { username, email, password } = req.body      | json({user: user})                                              | Registers the user remitent in the database and returns the logged in user.                         |
| POST   | /login                      | const { email, password } = req.body                |json({authToken:authToken})           | Logs in a user or transportist is already registered.                           
| PUT    | /user/:userId               | const { UserId } = req.params                       | json({updatedUser})                                              | Edits a Users data that already exists on the database.                                    |
| POST   | /signup-transportist        | const { username, email, password } = req.body      | json({user: user})                                              | Registers the Transportist in the database and returns the logged in transportist.              |                           
| PUT    |/transportist/:transportistId|const { transportistId } = req.params                     |json({updatedTransportist})           | Edits a Transportist data that already exists on the database.|
| GET    | /shipment                   |   Returns an array with all shipments publiqued     | json([allshipments])                                              |  
| POST   | /shipment                   | const { author, creationDate, pickUpDireccion,pickUpProvince,deliveryDireccion, deliveryProvince,pallets, state} = req.body                          | json({response})                                                |  Creates a Shipment in the database.                                   |
| GET    | /shipment/:shipmentId        | const { shipmentId } = req.params                    | json({project})                                                | Returns the information of the specified shipment.   |
| POST   | /request                    | const { author, date, shipment = req.body           | json({response})                                                | Creates request.                                 |
| PUT    | /shipment/:shipmentId       | const { shipmentId } = req.params                   | json({updatedProject})                                          | Edits a shipment that already exists on the database.|
| DELETE | /shipment/:shipmentId       | const { shipmentId } = req.params                    | json({| Deletes shipment            |
| DELETE | /request/:shipmentId         | const { shipmentId } = req.params                   | json({message: "request  was denegate | Deletes a request of shipment from the database.  |
| GET    | /profile                    | Returns the current user object.                     | json({thisUser})          |                                      |                                       

---

Any doubts? Contact !
