// Admin dashboard data
export const dashboardStats = {
  totalUsers: 24856,
  totalTouristPlaces: 8432,
  pendingUploads: 47,
  totalReports: 23,
  totalReviews: 15678,
  totalHiddenGems: 312,
  monthlyGrowth: 12.5,
  activeUsers: 8932,
};

export const recentActivity = [
  { id: 1, user: 'Priya Nair', action: 'uploaded a new hidden gem', target: 'Gokarna Beaches', time: '5 min ago', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 2, user: 'Rahul Sharma', action: 'reviewed', target: 'Taj Mahal', time: '15 min ago', avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 3, user: 'Aisha Khan', action: 'reported', target: 'Fake information on Mandu', time: '1 hour ago', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 4, user: 'Vikram Menon', action: 'registered as a new user', target: '', time: '2 hours ago', avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 5, user: 'Sofia Martinez', action: 'uploaded a new hidden gem', target: 'Chembra Peak', time: '3 hours ago', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 6, user: 'Karthik R', action: 'favorited', target: 'Andaman Scuba Diving', time: '5 hours ago', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100' },
];

export const pendingApprovals = [
  { id: 1, name: 'Ziro Valley Waterfall', state: 'Arunachal Pradesh', category: 'Hidden Gems', submittedBy: 'Bhuvan Singh', date: '2024-07-10', image: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 2, name: 'Secret Cave Temple', state: 'Maharashtra', category: 'Temples', submittedBy: 'Anil Pawar', date: '2024-07-09', image: 'https://images.pexels.com/photos/1680260/pexels-photo-1680260.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 3, name: 'Hidden Beach Cove', state: 'Kerala', category: 'Beaches', submittedBy: 'Meera Joseph', date: '2024-07-08', image: 'https://images.pexels.com/photos/1450354/pexels-photo-1450354.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 4, name: 'Ancient Stepwell', state: 'Rajasthan', category: 'Historical Places', submittedBy: 'Raj Singh', date: '2024-07-07', image: 'https://images.pexels.com/photos/3837466/pexels-photo-3837466.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

export const reportedContent = [
  { id: 1, content: 'Fake information about Mandu entry fees', reportedBy: 'Aisha Khan', reason: 'Fake Information', date: '2024-07-10', status: 'pending' },
  { id: 2, content: 'Duplicate entry for Goa Beaches', reportedBy: 'Rahul Sharma', reason: 'Duplicate', date: '2024-07-09', status: 'pending' },
  { id: 3, content: 'Inappropriate photo in Hidden Gems', reportedBy: 'Priya Nair', reason: 'Inappropriate Photo', date: '2024-07-08', status: 'reviewing' },
  { id: 4, content: 'Wrong location for Chembra Peak', reportedBy: 'Vikram Menon', reason: 'Wrong Location', date: '2024-07-07', status: 'resolved' },
];

export const adminUsers = [
  { id: 1, name: 'Priya Nair', email: 'priya.nair@email.com', role: 'User', status: 'Active', joined: '2024-01-15', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 2, name: 'Rahul Sharma', email: 'rahul.s@email.com', role: 'Contributor', status: 'Active', joined: '2024-02-20', avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 3, name: 'Aisha Khan', email: 'aisha.k@email.com', role: 'User', status: 'Active', joined: '2024-03-10', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 4, name: 'Vikram Menon', email: 'vikram.m@email.com', role: 'Contributor', status: 'Active', joined: '2024-04-05', avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 5, name: 'Sofia Martinez', email: 'sofia.m@email.com', role: 'User', status: 'Suspended', joined: '2024-05-12', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 6, name: 'Karthik R', email: 'karthik.r@email.com', role: 'User', status: 'Active', joined: '2024-06-18', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100' },
];

export const weeklyVisitors = [
  { day: 'Mon', visitors: 3200 },
  { day: 'Tue', visitors: 4100 },
  { day: 'Wed', visitors: 3800 },
  { day: 'Thu', visitors: 5200 },
  { day: 'Fri', visitors: 6800 },
  { day: 'Sat', visitors: 8900 },
  { day: 'Sun', visitors: 7600 },
];
