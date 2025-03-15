// Script to fix duplicate events in the database
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

// Function to fix duplicate events
async function fixDuplicateEvents() {
  try {
    console.log('Looking for duplicate events...');
    
    // Find all events
    const allEvents = await Event.find();
    
    // Group events by title
    const eventsByTitle = {};
    allEvents.forEach(event => {
      const title = event.title;
      if (!eventsByTitle[title]) {
        eventsByTitle[title] = [];
      }
      eventsByTitle[title].push(event);
    });
    
    // Find duplicates
    const duplicateTitles = Object.keys(eventsByTitle).filter(title => eventsByTitle[title].length > 1);
    
    if (duplicateTitles.length === 0) {
      console.log('No duplicate events found.');
      return;
    }
    
    console.log(`Found ${duplicateTitles.length} duplicate event titles: ${duplicateTitles.join(', ')}`);
    
    // Fix duplicates
    for (const title of duplicateTitles) {
      const duplicates = eventsByTitle[title];
      console.log(`\nFixing duplicates for "${title}":`);
      
      // Keep the one with the specified ID if it exists
      const correctId = title === "Treasure Hunt" ? "67b714b79a01ff3f0a3c85ee" : null;
      
      let keepEvent = null;
      
      if (correctId) {
        keepEvent = duplicates.find(event => event._id.toString() === correctId);
      }
      
      // If no specific ID to keep, keep the oldest one
      if (!keepEvent) {
        keepEvent = duplicates.sort((a, b) => a.createdAt - b.createdAt)[0];
      }
      
      console.log(`Keeping event with ID: ${keepEvent._id}`);
      
      // Delete the others
      for (const event of duplicates) {
        if (event._id.toString() !== keepEvent._id.toString()) {
          console.log(`Deleting duplicate event with ID: ${event._id}`);
          await Event.deleteOne({ _id: event._id });
        }
      }
    }
    
    // Verify the fix
    const updatedEvents = await Event.find().sort({ title: 1 });
    
    console.log('\n=== Current Events in Database ===');
    updatedEvents.forEach(event => {
      console.log(`ID: ${event._id}, Title: ${event.title}`);
    });
    
  } catch (error) {
    console.error('Error fixing duplicate events:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
fixDuplicateEvents(); 