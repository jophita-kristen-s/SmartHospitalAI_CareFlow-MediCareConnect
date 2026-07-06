const http      = require('http');
const { Server }= require('socket.io');
const app       = require('./src/app');
const sequelize = require('./src/config/database');
const initSockets = require('./src/sockets');

// Import models to register them with Sequelize
require('./src/models/User');
require('./src/models/Hospital');
require('./src/models/Bed');
require('./src/models/Appointment');
require('./src/models/Emergency');
require('./src/models/Admission');
require('./src/models/Prescription');

const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*' } });

app.set('io', io);
initSockets(io);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })  // use { force: true } only to reset DB
  .then(() => {
    console.log('DB synced');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('DB connection failed:', err));

app.get('/api/patients/:id', (req, res) => {
    // Fetch patient data from DB
    res.json({ patient: 'data' });
});

app.put('/api/workflows/:id', (req, res) => {
    // Update workflow in DB
    res.json({ success: true });
});

app.post('/api/medicare/connect', (req, res) => {
    // Handle Medicare connection
    res.json({ connected: true });
});

app.post('/api/medicare/sync', (req, res) => {
    // Sync data
    res.json({ synced: true });
});