import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Event from '../../../models/Event';

export async function GET(request: Request) {
  try {
    // No authentication check
    
    // Connect to the database
    await connectToDatabase();
    
    // Fetch all events
    const events = await Event.find().sort({ date: 1 });
    
    // Format the response
    const formattedEvents = events.map(event => ({
      _id: event._id.toString(),
      title: event.title,
      description: event.description,
      date: event.date.toISOString(),
      venue: event.venue,
      maxTeamSize: event.maxTeamSize,
      minTeamSize: event.minTeamSize,
      registrationDeadline: event.registrationDeadline.toISOString()
    }));
    
    return NextResponse.json({ events: formattedEvents });
  } catch (error) {
    console.error('Error in events API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 