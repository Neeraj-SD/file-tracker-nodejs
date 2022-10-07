const departments = require('../routes/departments')
const roles = require('../routes/roles')
const faculties = require('../routes/faculties')
const requests = require('../routes/requests')
const students = require('../routes/students')

module.exports = function (app) {
    // app.use('/api/auth', auth);
    // app.use('/api/users', users);
    app.use('/api/departments', departments);
    app.use('/api/roles', roles);
    app.use('/api/faculties', faculties);
    app.use('/api/students', students);
    app.use('/api/requests', requests);
}