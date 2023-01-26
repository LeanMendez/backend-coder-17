import { logger } from "../logger/config";

const socketClient = io();

//Manipulacion del DOM
const sendProd = (e) => {
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const product = { title: title, price: price, thumbnail: thumbnail };
    logger.info(product)
    socket.emit('new_product', product);
    return false;
};


const title = document.getElementById('title')
const price = document.getElementById('price')
const thumbnail = document.getElementById('thumbnail')

const send = document.getElementById('sendProd')
const detail = document.getElementById('prodDetail')

//Envia la informacion del producto
if(send){
    send.addEventListener('click', (e)=>{
        socketClient.emit('newProduct', {
            title: title.value,
            price: price.value,
            thumbnail: thumbnail.value
        })
    })

    //recibe los productos
    socketClient.on('list', (data) =>{
        let prod=''
        data.forEach(e => {
            prod += `<tr>
            <td>${e.title}</td>
            <td>${e.price}</td>
            <td><img src="${e.thumbnail}" alt="${e.title}"> </td>
            </tr>`
        });
        detail.innerHTML = prod
    })
}

// variables del chat
const historial = document.getElementById('historial')
const sendMsg = document.getElementById('sendMsg')
const msg = document.getElementById('msg')
let user,nombreUser,edad,alias,avatar

//DESNORMALIZAR
    //autor
    const authorSchema = new normalizr.schema.Entity('autor')
    //msg
    const msgSchema = new normalizr.schema.Entity('mensajes',{autor:authorSchema})
    //esquema chat
    const chatSchema = new normalizr.schema.Entity('chat',{
        mensajes:[msgSchema]
    },{idAttribute:'id'})


Swal.fire({
    title: 'Bienvenido/a',
    text:'Ingrese su Email',
    html: `<input type="text" id="email" class="swal2-input" placeholder="Correo" required>
    <input type="text" id="nombreUser" class="swal2-input" placeholder="Nombre" required>
    <input type="number" id="edad" class="swal2-input" placeholder="Edad" required>
    <input type="text" id="alias" class="swal2-input" placeholder="Alias" required>
    <input type="text" id="avatar" class="swal2-input" placeholder="Avatar" required>`,
    confirmButtonText: 'Continuar',
    allowOutsideClick: false,
    preConfirm: () => {
        const email = Swal.getPopup().querySelector('#email').value;
        const nombreUser = Swal.getPopup().querySelector('#nombreUser').value;
        const alias = Swal.getPopup().querySelector("#alias").value;
        const edad = Swal.getPopup().querySelector("#edad").value;
        const avatar = Swal.getPopup().querySelector("#avatar").value;
        if (!email || !nombreUser || !alias || !edad||!avatar) {
            Swal.showValidationMessage(`complete el formulario`);
        }
        return { email, nombreUser, alias, edad, avatar}
    },
}).then(res=>{
    user = res.value.email
    nombreUser = res.value.nombreUser
    edad = res.value.edad
    alias = res.value.alias
    avatar = res.value.avatar

    return user,nombreUser,edad,alias,avatar
})

if(msg){
    sendMsg.addEventListener('click',(e) => {
        socketClient.emit('newMsgs',{
            id: user,
            nombre:nombreUser,
            edad:edad,
            alias:alias,
            avatar:avatar,
            texto: msg.value,
            hora: new Date()
        })
        msg.value=''
    })

    //recibe los msj
    socketClient.on('chat', async (data)=>{
        logger.info(data);
        const normalData = await normalizr.denormalize(data.result,chatSchema,data.entities)
        logger.info(normalData);
        let elemento = ''
        normalData.mensajes.forEach(e => {

            elemento += `<p class='text-secondary'><strong class='text-success'>${e.autor.id}</strong> <strong class='text-secondary'>${e.hora}</strong>: ${e.texto}</p>`
        });
        historial.innerHTML = elemento
    })
}
