import User from "./User.js";

class UserController {
    constructor() {
        this.users = {};
    }
    addUser(id, name, email, age) {
        if(!this.users[id]) {
            this.users[id] = new User(id, name, email, age);
        }
        else {
            console.error("Este usuario ya existe!");
        }
    }
    editUser(id, newName, newEmail, newAge) {
        if(this.users[id]) {
            this.users[id].name = newName;
            this.users[id].email = newEmail;
            this.users[id].age = newAge;
        }
        else {
            console.error("El usuario a editar no existe!");
        }
    }
    deleteUser(id) {
        if(this.users[id]) {
            delete this.users[id];
        }
        else {
            console.error("El usuario a eliminar no existe!");
        }
    }
    printUsers() {
        return Object.values(this.users);
    }
}

export default UserController;