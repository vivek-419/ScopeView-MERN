const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, role = 'viewer' } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Validate role
      const allowedRoles = ['viewer', 'engineer', 'admin'];
      const userRole = allowedRoles.includes(role) ? role : 'viewer';
      
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: "User already exists" });
      }
      
      const passwordHash = await bcrypt.hash(password, 10);
      await User.create({ email, passwordHash, role: userRole });
      
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: "Error registering user", error: error.message });
    }
  },
  
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      res.json({ 
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Error during login" });
    }
  }
};

module.exports = authController;
