import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Team from '../../../models/Team';
import Event from '../../../models/Event';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Count total teams
    const totalTeams = await Team.countDocuments();

    // Count total events
    const totalEvents = await Event.countDocuments();

    // Get events with team counts
    const events = await Event.find().sort({ title: 1 }).lean();
    
    // Get team counts for each event
    const teamCounts = await Team.aggregate([
      { $group: { _id: '$event', count: { $sum: 1 } } }
    ]);
    
    // Create a map of event IDs to team counts
    const eventCountMap = new Map();
    teamCounts.forEach(item => {
      if (item._id) {
        eventCountMap.set(item._id.toString(), item.count);
      }
    });
    
    // Format events with counts
    const eventsWithCounts = events.map(event => ({
      _id: event._id.toString(),
      title: event.title,
      teamCount: eventCountMap.get(event._id.toString()) || 0
    }));
    
    // Get recent team registrations (limit to 5)
    const recentRegistrations = await Team.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
      
    // Format recent registrations
    const formattedRecentRegistrations = recentRegistrations.map(team => ({
      _id: team._id.toString(),
      name: team.name,
      createdAt: team.createdAt,
      eventId: team.event ? team.event.toString() : null
    }));
    
    // Get event data for recent registrations
    const eventIds = [...new Set(formattedRecentRegistrations
      .map(reg => reg.eventId)
      .filter(Boolean))];
      
    const recentEvents = await Event.find({ 
      _id: { $in: eventIds.map(id => new mongoose.Types.ObjectId(id)) } 
    }).lean();
    
    const eventMap = new Map();
    recentEvents.forEach(event => {
      eventMap.set(event._id.toString(), event.title);
    });
    
    // Add event names to recent registrations
    const recentRegistrationsWithEvents = formattedRecentRegistrations.map(reg => ({
      ...reg,
      eventName: reg.eventId ? eventMap.get(reg.eventId) || 'Unknown Event' : null
    }));

    // Return the dashboard stats
    return NextResponse.json({
      totalTeams,
      totalEvents,
      eventsList: eventsWithCounts,
      recentRegistrations: recentRegistrationsWithEvents
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
} 