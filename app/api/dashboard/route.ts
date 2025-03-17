import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Team from '../../../models/Team';
import Event from '../../../models/Event';
import mongoose from 'mongoose';

// Define interfaces for our expected document structures
interface EventData {
  _id: mongoose.Types.ObjectId | string;
  title: string;
}

interface TeamData {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  event?: mongoose.Types.ObjectId | string;
  createdAt: Date;
}

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Count total teams
    const totalTeams = await Team.countDocuments();

    // Count total events
    const totalEvents = await Event.countDocuments();

    // Get events with team counts
    const eventsData = await Event.find().sort({ title: 1 }).lean();
    
    // Get team counts for each event
    const teamCounts = await Team.aggregate([
      { $group: { _id: '$event', count: { $sum: 1 } } }
    ]);
    
    // Create a map of event IDs to team counts
    const eventCountMap = new Map<string, number>();
    teamCounts.forEach(item => {
      if (item._id) {
        eventCountMap.set(String(item._id), item.count);
      }
    });
    
    // Format events with counts
    const eventsWithCounts = eventsData.map(event => ({
      _id: String(event._id),
      title: String(event.title),
      teamCount: eventCountMap.get(String(event._id)) || 0
    }));
    
    // Get recent team registrations (limit to 5)
    const teamsData = await Team.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
      
    // Format recent registrations
    const formattedRecentRegistrations = teamsData.map(team => ({
      _id: String(team._id),
      name: String(team.name),
      createdAt: team.createdAt,
      eventId: team.event ? String(team.event) : null
    }));
    
    // Get event data for recent registrations
    const eventIds = formattedRecentRegistrations
      .map(reg => reg.eventId)
      .filter((id): id is string => id !== null);
      
    const eventsForRegistrations = await Event.find({ 
      _id: { $in: eventIds.map(id => new mongoose.Types.ObjectId(id)) } 
    }).lean();
    
    // Build event map
    const eventMap = new Map<string, string>();
    eventsForRegistrations.forEach(event => {
      eventMap.set(String(event._id), String(event.title));
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