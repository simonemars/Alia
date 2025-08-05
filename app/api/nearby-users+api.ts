import { UserProfile } from '@/types';
import { getNearbyUsers } from '@/services/users';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = parseFloat(url.searchParams.get('lat') || '0');
  const lng = parseFloat(url.searchParams.get('lng') || '0');
  const radius = parseFloat(url.searchParams.get('radius') || '5');

  const users = await getNearbyUsers(lat, lng, radius);

  return Response.json(users);
}