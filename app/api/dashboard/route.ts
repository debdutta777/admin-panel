import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Team from '../../../models/Team';
import Event from '../../../models/Event';

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Count total teams
    const totalTeams = await Team.countDocuments();

    // Count total events
    const totalEvents = await Event.countDocuments();

    // Return the dashboard stats
    return NextResponse.json({
      totalTeams,
      totalEvents
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
} 