import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from '../prisma/prisma.config';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
app.get('/', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      message: 'Server running',
      database: 'Connected ✅'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server running',
      database: 'Disconnected ❌',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create a user
app.post('/users', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ?  error.message : 'Unknown error'
    });
  }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma. user.findUnique({
      where: { id:  parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update user
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name } = req.body;

    const user = await prisma.user. update({
      where: { id: parseInt(id) },
      data: {
        email,
        name,
      },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`📊 Database:  PostgreSQL`);
  console.log(`🐳 Docker Container: my_measurement_postgres`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down.. .');
  await prisma.$disconnect();
  process.exit(0);
});