import { 
  collection, 
  query, 
  where, 
  getDocs, 
  GeoPoint,
  DocumentData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { UserProfile } from '@/types';

const USERS_COLLECTION = 'users';

// Convert Firestore data to UserProfile
const convertToUserProfile = (doc: DocumentData): UserProfile => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    age: data.age,
    bio: data.bio,
    image: data.image,
    hobbies: data.hobbies || [],
    sports: data.sports || [],
    location: {
      latitude: data.location.latitude,
      longitude: data.location.longitude,
    },
    rating: {
      average: data.rating?.average || 0,
      count: data.rating?.count || 0,
    },
    lastActive: data.lastActive,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

// Get nearby users within radius (in km)
export const getNearbyUsers = async (
  latitude: number,
  longitude: number,
  radiusInKm: number
): Promise<UserProfile[]> => {
  try {
    // For demo purposes, we'll fetch all users and filter client-side
    // In production, you should use Geohashing or a specialized geo-query solution
    const usersRef = collection(db, USERS_COLLECTION);
    const querySnapshot = await getDocs(usersRef);
    
    const users: UserProfile[] = [];
    
    querySnapshot.forEach(doc => {
      const user = convertToUserProfile(doc);
      
      // Calculate distance between points
      const distance = calculateDistance(
        latitude,
        longitude,
        user.location.latitude,
        user.location.longitude
      );
      
      // Only include users within the radius
      if (distance <= radiusInKm) {
        users.push(user);
      }
    });
    
    return users;
  } catch (error) {
    console.error('Error getting nearby users:', error);
    throw error;
  }
};

// Helper function to calculate distance between two points in km
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Add more user-related Firestore operations here
export const addUser = async (user: Omit<UserProfile, 'id'>): Promise<string> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const docRef = await addDoc(usersRef, {
      ...user,
      location: new GeoPoint(user.location.latitude, user.location.longitude),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const updateUser = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}; 