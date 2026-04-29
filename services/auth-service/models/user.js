const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/users.json');

function loadUsers() {
    return JSON.parse(fs.readFileSync(filePath));
}

function saveUsers(users) {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

module.exports = {
    findByUsername: (username) => {
        const users = loadUsers();
        return users.find(user => user.username === username);
    },

    findById: (id) => {
        const users = loadUsers();
        return users.find(user => user.id === id);
    },

    createUser: (newUser) => {
        const users = loadUsers();
        users.push(newUser);
        saveUsers(users);
        return newUser;
    }
};