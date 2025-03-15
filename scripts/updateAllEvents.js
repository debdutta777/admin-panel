// Script to update all events in the database
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

// Event data from the provided JSON
const eventsData = [
  {
    id: "67b7102b9a01ff3f0a3c85e1",
    title: "HydroBlasters",
    description: "Get ready for an exciting water-based adventure event featuring water jets and aerodynamics. Participants create rockets using bottles, fill them with water, and launch them, demonstrating creativity, physics, and teamwork.",
    date: new Date("2025-04-04"), // finalsDate
    venue: "Mechanical Dept, Jadavpur University",
    maxTeamSize: 3,
    minTeamSize: 2,
    registrationDeadline: new Date("2025-03-30"),
  },
  {
    id: "67b7148d9a01ff3f0a3c85ec",
    title: "Data Mine",
    description: "A code-breaking and puzzle-solving event where participants decode encrypted messages, solve cryptic clues, and crack complex challenges. It tests logical thinking, cryptography knowledge, and problem-solving speed",
    date: new Date("2025-04-03"), // finalsDate
    venue: "Mechanical Dept, Jadavpur University",
    maxTeamSize: 4,
    minTeamSize: 2,
    registrationDeadline: new Date("2025-03-30"),
  },
  {
    id: "67b714449a01ff3f0a3c85e6",
    title: "Model Matrix",
    description: "Gear up to flex your skills in CAD modeling and simulation. Focussed on complex core engineering parts and components, it challenges precision, creativity, and technical expertise in a dynamic and competitive setting.",
    date: new Date("2025-04-03"), // finalsDate
    venue: "Mechanical Dept, Jadavpur University",
    maxTeamSize: 1,
    minTeamSize: 1,
    registrationDeadline: new Date("2025-03-30"),
  },
  {
    id: "67b714799a01ff3f0a3c85ea",
    title: "Clash of Cases",
    description: "Use your skills to analyze real-world business scenarios and present innovative solutions to showcase your problem-solving and analytical thinking abilities",
    date: new Date("2025-04-03"), // finalsDate
    venue: "Mechanical Dept, Jadavpur University",
    maxTeamSize: 4,
    minTeamSize: 1,
    registrationDeadline: new Date("2025-03-30"),
  },
  {
    id: "67b7145e9a01ff3f0a3c85e8",
    title: "Torko Bitorko",
    description: "Be prepared to engage yourself in thought-provoking discussions on general knowledge, core engineering concepts, and current affairs to showcase analytical thinking, argumentation skills and intellectual agility",
    date: new Date("2025-04-04"), // finalsDate
    venue: "Mechanical Dept, Jadavpur University",
    maxTeamSize: 1,
    minTeamSize: 1,
    registrationDeadline: new Date("2025-03-30"),
  },
  {
    id: "67b714349a01ff3f0a3c85e5",
    title: "Hoverpod",
    description: "An exciting event where participants build and race hovercraft-like vehicles. These self-propelled pods glide on a cushion of air. Teams focus on design, stability, and speed to compete in time-based challenges",
    date: new Date("2025-04-03"), // finalsDate
    venue: "Mechanical Dept, Jadavpur University",
    maxTeamSize: 5,
    minTeamSize: 5,
    registrationDeadline: new Date("2025-03-30"),
  },
  {
    id: "67b7141b9a01ff3f0a3c85e4",
    title: "Prot-Egg-t",
    description: "A fun event where participants design protective contraptions to prevent an egg from breaking during a high drop. Teams test creativity and engineering skills by building structures to cushion the egg's impact.",
    date: new Date("2025-04-03"), // finalsDate
    venue: "Mechanical Dept, Jadavpur University",
    maxTeamSize: 4,
    minTeamSize: 2,
    registrationDeadline: new Date("2025-03-30"),
  },
  {
    id: "67b7146e9a01ff3f0a3c85e9",
    title: "Beyond The Frame",
    description: "Grasp the oppurtunity to capture the world from a unique perspective. This event challenges creativity in storytelling, showcasing extraordinary moments that highlight life's beauty and intricacies.",
    date: new Date("2025-04-04"), // finalsDate
    venue: "Mechanical Dept, Jadavpur University",
    maxTeamSize: 1,
    minTeamSize: 1,
    registrationDeadline: new Date("2025-03-30"),
  },
  {
    id: "67b710919a01ff3f0a3c85e2",
    title: "Robo League",
    description: "Buckle up to build and program robots to play soccer autonomously or via remote control. Teams compete by scoring goals in a fast-paced, strategy-driven match on a mini soccer field.",
    date: new Date("2025-04-03"), // finalsDate
    venue: "Mechanical Dept, Jadavpur University",
    maxTeamSize: 5,
    minTeamSize: 2,
    registrationDeadline: new Date("2025-03-30"),
  },
  {
    id: "67b714529a01ff3f0a3c85e7",
    title: "Gyan Yudh",
    description: "Test your knowledge in a variety of subjects in this quiz competition. It challenges intellect, speed, and awareness, offering a thrilling battle of wits for all knowledge enthusiasts.",
    date: new Date("2025-04-03"), // finalsDate
    venue: "Lecture Hall, Jadavpur University",
    maxTeamSize: 3,
    minTeamSize: 1,
    registrationDeadline: new Date("2025-03-30"),
  },
  {
    id: "67b710b69a01ff3f0a3c85e3",
    title: "Robotrail",
    description: "Design and construct a line-following robot that navigates a predefined path.",
    date: new Date("2025-04-04"), // finalsDate
    venue: "Mechanical Dept, Jadavpur University",
    maxTeamSize: 4,
    minTeamSize: 3,
    registrationDeadline: new Date("2025-03-30"),
  },
  {
    id: "67b714b79a01ff3f0a3c85ee",
    title: "Treasure Hunt",
    description: "An adventurous event where participants solve clues and complete challenges to find hidden treasures. It combines teamwork,problem-solving, and strategy as teams race to finish first and claim victory.",
    date: new Date("2025-04-04"), // finalsDate
    venue: "Mechanical Dept, Jadavpur University",
    maxTeamSize: 1,
    minTeamSize: 1,
    registrationDeadline: new Date("2025-03-30"),
  }
];

// Function to update events
async function updateEvents() {
  try {
    console.log('Starting event updates...');
    
    // Get all existing events
    const existingEvents = await Event.find();
    const existingEventIds = existingEvents.map(event => event._id.toString());
    
    console.log(`Found ${existingEvents.length} existing events`);
    
    // Track statistics
    let updated = 0;
    let added = 0;
    let unchanged = 0;
    
    // Process each event
    for (const eventData of eventsData) {
      // Check if event exists by ID
      if (existingEventIds.includes(eventData.id)) {
        // Update existing event
        const result = await Event.updateOne(
          { _id: eventData.id },
          {
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            venue: eventData.venue,
            maxTeamSize: eventData.maxTeamSize,
            minTeamSize: eventData.minTeamSize,
            registrationDeadline: eventData.registrationDeadline
          }
        );
        
        if (result.modifiedCount > 0) {
          console.log(`Updated event: ${eventData.title}`);
          updated++;
        } else {
          console.log(`No changes needed for: ${eventData.title}`);
          unchanged++;
        }
      } else {
        // Create new event with specific ID
        const newEvent = new Event({
          _id: eventData.id,
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          venue: eventData.venue,
          maxTeamSize: eventData.maxTeamSize,
          minTeamSize: eventData.minTeamSize,
          registrationDeadline: eventData.registrationDeadline
        });
        
        await newEvent.save();
        console.log(`Added new event: ${eventData.title}`);
        added++;
      }
    }
    
    console.log('\n=== Update Summary ===');
    console.log(`Total events processed: ${eventsData.length}`);
    console.log(`Events updated: ${updated}`);
    console.log(`Events added: ${added}`);
    console.log(`Events unchanged: ${unchanged}`);
    
    // List all events after updates
    const updatedEvents = await Event.find().sort({ title: 1 });
    
    console.log('\n=== Current Events in Database ===');
    updatedEvents.forEach(event => {
      console.log(`ID: ${event._id}, Title: ${event.title}`);
    });
    
  } catch (error) {
    console.error('Error updating events:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
updateEvents(); 