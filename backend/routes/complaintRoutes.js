const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');

// Add Complaint
router.post('/', async (req, res) => {
  try {
    const { name, email, title, description, category, location } = req.body;
    if (!title || !email) {
      return res.status(400).json({ error: 'Validation error: Missing fields' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Error message: Invalid email' });
    }

    const newComplaint = new Complaint({
      name, email, title, description, category, location
    });
    await newComplaint.save();
    res.json({ message: 'Complaint stored successfully', complaint: newComplaint });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get All Complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Search Complaint by Location
router.get('/search', async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ msg: 'Please provide a location' });
    }
    const complaints = await Complaint.find({ location: { $regex: location, $options: 'i' } });
    res.json(complaints);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update Complaint Status
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!complaint) return res.status(404).json({ msg: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete complaint (requested in Q4 test cases)
router.delete('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ msg: 'Complaint not found' });
    res.json({ msg: 'Complaint removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
