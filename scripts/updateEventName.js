// Script to update event names in the database
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

// Function to update event names
async function updateEventNames() {
  try {
    // 1. Find the Mazecraft event
    const mazecraftEvent = await Event.findOne({ title: "Mazecraft" });
    
    if (!mazecraftEvent) {
      console.log('Mazecraft event not found');
      return;
    }
    
    console.log(`Found Mazecraft event with ID: ${mazecraftEvent._id}`);
    
    // 2. Find the Robotrail event to delete
    const robotrailEvent = await Event.findOne({ title: "Robotrail" });
    
    if (robotrailEvent) {
      console.log(`Found Robotrail event with ID: ${robotrailEvent._id}`);
      
      // Delete the Robotrail event
      await Event.deleteOne({ _id: robotrailEvent._id });
      console.log('Deleted Robotrail event');
    } else {
      console.log('No Robotrail event found to delete');
    }
    
    // 3. Update the Mazecraft event name to Robotrail
    mazecraftEvent.title = "Robotrail";
    await mazecraftEvent.save();
    
    console.log('Updated Mazecraft event name to Robotrail');
    
    // 4. Verify the changes
    const events = await Event.find().sort({ title: 1 });
    
    console.log('\n=== Updated Events List ===');
    events.forEach(event => {
      console.log(`ID: ${event._id}, Title: ${event.title}`);
    });
    
  } catch (error) {
    console.error('Error updating event names:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
updateEventNames(); 