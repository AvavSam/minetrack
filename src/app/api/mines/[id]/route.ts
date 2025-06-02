import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Update a mine
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Access id directly from context.params instead of destructuring
    const id = context.params.id;
    const updates = await request.json();

    // Validate the ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid mine ID' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Convert string fields to appropriate types for MongoDB
    const updateData: Record<string, any> = {};

    if (updates.licenseStatus) {
      updateData.lisensi = updates.licenseStatus.toLowerCase();
    }

    if (updates.verified !== undefined) {
      updateData.verifikasi = updates.verified;
    }

    // Add update timestamp
    updateData.updatedAt = new Date();

    const result = await db.collection('tambang').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Mine not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Mine updated successfully' }
    );
  } catch (error) {
    console.error('Error updating mine:', error);
    return NextResponse.json(
      { error: 'Failed to update mine' },
      { status: 500 }
    );
  }
}

// Delete a mine
export async function DELETE(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Access id directly from context.params
    const id = context.params.id;

    // Validate the ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid mine ID' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const result = await db.collection('tambang').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Mine not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Mine deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting mine:', error);
    return NextResponse.json(
      { error: 'Failed to delete mine' },
      { status: 500 }
    );
  }
}
