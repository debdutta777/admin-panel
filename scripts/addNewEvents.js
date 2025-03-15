// Script to add new events to the database
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define Event Schema (matching the one in models/Event.ts)
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

// New events to add
const newEvents = [
  {
    title: "Robotrail",
    description: "Design and construct a line-following robot that navigates a predefined path.",
    date: new Date("2025-04-04"),
    venue: "Mechanical Dept, Jadavpur University",
    maxTeamSize: 4,
    minTeamSize: 3,
    registrationDeadline: new Date("2025-03-30"),
  },
  {
    title: "Treasure Hunt",
    description: "An adventurous event where participants solve clues and complete challenges to find hidden treasures. It combines teamwork, problem-solving, and strategy as teams race to finish first and claim victory.",
    date: new Date("2025-04-04"),
    venue: "Mechanical Dept, Jadavpur University",
    maxTeamSize: 1,
    minTeamSize: 1,
    registrationDeadline: new Date("2025-03-30"),
  }
];

// Function to add events
async function addEvents() {
  try {
    // Check if events already exist
    for (const eventData of newEvents) {
      const existingEvent = await Event.findOne({ title: eventData.title });
      
      if (existingEvent) {
        console.log(`Event "${eventData.title}" already exists. Skipping.`);
      } else {
        const event = new Event(eventData);
        await event.save();
        console.log(`Added event: ${eventData.title}`);
      }
    }
    
    console.log('All events added successfully');
  } catch (error) {
    console.error('Error adding events:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
addEvents(); 