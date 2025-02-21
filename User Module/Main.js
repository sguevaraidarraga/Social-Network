import UserController from './UserController.js';
import promptSync from 'prompt-sync';
const prompt = promptSync();

function main() {
    let cmd, id, name, email, age, flag = true;
    const controller = new UserController();
    while(flag) {
        console.log("1.) Añadir usuario");
        console.log("2.) Editar usuario");
        console.log("3.) Eliminar usuario");
        console.log("4.) Imprimir usuarios");
        console.log("5.) Salir");
        cmd = prompt();
        switch(cmd) {
            case "1":
                console.log("Ingresa tu id");
                id = prompt();
                console.log("Ingresa tu nombre");
                name = prompt();
                console.log("Ingresa tu email");
                email = prompt();
                console.log("Ingresa tu edad");
                age = prompt();
                controller.addUser(id, name, email, age);
                break;
            case "2":
                console.log("Ingresa tu id");
                id = prompt();
                console.log("Ingresa tu nombre");
                name = prompt();
                console.log("Ingresa tu email");
                email = prompt();
                console.log("Ingresa tu edad");
                age = prompt();
                controller.editUser(id, name, email, age);
                break;
            case "3":
                console.log("Ingresa tu id");
                id = prompt();
                controller.deleteUser();
                break;
            case "4":
                console.log(controller.printUsers());
                break;
            default:
                f = false;
                break;
        }
    }
}
main();