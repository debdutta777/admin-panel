// Script to check event IDs in the database
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define Event Schema
const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    maxTeamSize: { type: Number, required: true, default: 1 },
    minTeamSize: { type: Number, required: true, default: 1 },
    registrationDeadline: { type: Date, required: true },
  },
  { timestamps: true }
);

// Create Event model
const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

// Function to list all events with their IDs
async function listEvents() {
  try {
    const events = await Event.find().sort({ title: 1 });
    
    console.log('=== All Events with IDs ===');
    events.forEach(event => {
      console.log(`ID: ${event._id}, Title: ${event.title}`);
    });
    
    console.log('\n=== Event ID Mapping for Website ===');
    console.log('Copy this object to your website code:');
    
    const eventMapping = {};
    events.forEach(event => {
      eventMapping[event.title] = event._id.toString();
    });
    
    console.log(JSON.stringify(eventMapping, null, 2));
    
  } catch (error) {
    console.error('Error listing events:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
listEvents(); 