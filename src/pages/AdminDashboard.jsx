import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  LayoutDashboard, MapPin, Gem, Clock, Flag, Users, Tag, Star,
  Settings, Menu, X, TrendingUp, ArrowUpRight, ArrowDownRight,
  Check, X as XIcon, Eye, Trash2, Search, Bell, ChevronRight,
  Calendar, UserCheck, DollarSign, ClipboardList, LogOut, ShieldCheck,
} from 'lucide-react';
import GuideRegistrationRequests from '../components/admin/GuideRegistrationRequests';
import { useAuth } from '../context/AuthContext';
import {
  dashboardStats, recentActivity, pendingApprovals,
  reportedContent, adminUsers, weeklyVisitors,
} from '../data/admin';
import { adminApi } from '../services/api';
import categories from '../data/categories';
import { adminBookingStats, pendingBookingsData } from '../data/bookings';
import guidesData from '../data/guides';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'places', label: 'Tourist Places', icon: MapPin },
  { id: 'gems', label: 'Hidden Gems', icon: Gem },
  { id: 'approvals', label: 'Pending Approvals', icon: Clock },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'guides', label: 'Guide Management', icon: UserCheck },
  { id: 'guide-requests', label: 'Guide Registration Requests', icon: ClipboardList },
  { id: 'reports', label: 'Reports', icon: Flag },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const statCards = [
  { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'from-primary-500 to-primary-700', trend: '+12.5%', up: true },
  { key: 'totalTouristPlaces', label: 'Tourist Places', icon: MapPin, color: 'from-secondary-500 to-secondary-700', trend: '+8.2%', up: true },
  { key: 'pendingUploads', label: 'Pending Uploads', icon: Clock, color: 'from-accent-500 to-accent-700', trend: '-3.1%', up: false },
  { key: 'totalReports', label: 'Reports', icon: Flag, color: 'from-rose-500 to-rose-700', trend: '+5.4%', up: true },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(dashboardStats);

  useEffect(() => {
    async function loadStats() {
      const res = await adminApi.getDashboardStats();
      if (res.ok && res.data) {
        setStats((prev) => ({ ...prev, ...res.data }));
      }
    }
    loadStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const maxVisitors = Math.max(...weeklyVisitors.map((w) => w.visitors));

  return (
    <div className="pt-20 min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-20 left-0 z-40 h-[calc(100vh-5rem)] w-64 glass-nav border-r border-white/20 dark:border-white/10 overflow-y-auto transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-stone-900 dark:text-white">Admin Panel</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <item.icon size={18} /> {item.label}
                {item.id === 'approvals' && (
                  <span className="ml-auto bg-error-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {dashboardStats.pendingUploads}
                  </span>
                )}
                {item.id === 'reports' && (
                  <span className="ml-auto bg-error-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {dashboardStats.totalReports}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-stone-100 dark:bg-stone-800"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-stone-900 dark:text-white capitalize">
                {activeSection}
              </h1>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Welcome back, Admin
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
              <Bell size={20} className="text-stone-600 dark:text-stone-300" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error-500" />
            </button>
            <div className="flex items-center gap-2">
              <img
                src={user?.photo || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'}
                alt="Admin"
                className="w-10 h-10 rounded-full object-cover border-2 border-primary-500"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-stone-900 dark:text-white">{user?.name || 'Administrator'}</p>
                <span className="badge bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300">
                  <ShieldCheck size={11} /> Administrator
                </span>
              </div>
            </div>
            <button onClick={handleLogout} title="Logout" className="p-2.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-error-50 dark:hover:bg-error-500/10 text-stone-600 dark:text-stone-300 hover:text-error-500 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((card) => (
                <div key={card.key} className="glass-card p-5 card-hover">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                      <card.icon size={24} className="text-white" />
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-semibold ${
                      card.up ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
                    }`}>
                      {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {card.trend}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-stone-900 dark:text-white mb-1">
                    {dashboardStats[card.key].toLocaleString()}
                  </div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Analytics & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Weekly Visitor Analytics
                  </h3>
                  <TrendingUp size={20} className="text-success-500" />
                </div>
                <div className="flex items-end justify-between gap-2 h-48">
                  {weeklyVisitors.map((day) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-t-xl relative overflow-hidden" style={{ height: '100%' }}>
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-xl transition-all duration-500 hover:from-primary-600 hover:to-primary-500"
                          style={{ height: `${(day.visitors / maxVisitors) * 100}%` }}
                        >
                          <div className="absolute top-0 left-0 right-0 text-center text-xs text-white font-semibold pt-1">
                            {(day.visitors / 1000).toFixed(1)}k
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-stone-500 dark:text-stone-400">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Active Users', value: dashboardStats.activeUsers, icon: Users, color: 'text-success-500' },
                    { label: 'Total Reviews', value: dashboardStats.totalReviews, icon: Star, color: 'text-accent-500' },
                    { label: 'Hidden Gems', value: dashboardStats.totalHiddenGems, icon: Gem, color: 'text-secondary-500' },
                    { label: 'Monthly Growth', value: `${dashboardStats.monthlyGrowth}%`, icon: TrendingUp, color: 'text-primary-500' },
                  ].map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-stone-100 dark:bg-stone-800">
                      <div className="flex items-center gap-3">
                        <stat.icon size={18} className={stat.color} />
                        <span className="text-sm text-stone-600 dark:text-stone-400">{stat.label}</span>
                      </div>
                      <span className="text-sm font-bold text-stone-900 dark:text-white">
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity & Pending Approvals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <img src={activity.avatar} alt={activity.user} className="w-9 h-9 rounded-full object-cover shrink-0" loading="lazy" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2236%22 height=%2236%22%3E%3Crect fill=%22%23e7e5e4%22 width=%2236%22 height=%2236%22/%3E%3C/svg%3E'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-stone-700 dark:text-stone-300">
                          <span className="font-semibold">{activity.user}</span> {activity.action}
                          {activity.target && <span className="font-semibold"> {activity.target}</span>}
                        </p>
                        <p className="text-xs text-stone-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">Pending Approvals</h3>
                  <button onClick={() => setActiveSection('approvals')} className="text-sm text-primary-500 font-semibold flex items-center gap-1">
                    View All <ChevronRight size={14} />
                  </button>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {pendingApprovals.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl bg-stone-100 dark:bg-stone-800">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" loading="lazy" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22%3E%3Crect fill=%22%23e7e5e4%22 width=%2248%22 height=%2248%22/%3E%3C/svg%3E'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{item.state} • {item.category}</p>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 rounded-lg bg-success-500 text-white hover:scale-110 transition-transform" aria-label="Approve">
                          <Check size={16} />
                        </button>
                        <button className="p-2 rounded-lg bg-error-500 text-white hover:scale-110 transition-transform" aria-label="Reject">
                          <XIcon size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tourist Places Section */}
        {activeSection === 'places' && (
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">All Tourist Places</h3>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input type="text" placeholder="Search places..." className="pl-10 pr-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-700">
                    <th className="pb-3 font-semibold">Place</th>
                    <th className="pb-3 font-semibold">State</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Rating</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Taj Mahal', state: 'Uttar Pradesh', category: 'Heritage', rating: 4.9, image: 'https://images.pexels.com/photos/356943/pexels-photo-356943.jpeg?auto=compress&cs=tinysrgb&w=100' },
                    { name: 'Kerala Backwaters', state: 'Kerala', category: 'Adventure', rating: 4.8, image: 'https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg?auto=compress&cs=tinysrgb&w=100' },
                    { name: 'Jaipur Pink City', state: 'Rajasthan', category: 'Heritage', rating: 4.8, image: 'https://images.pexels.com/photos/356943/pexels-photo-356943.jpeg?auto=compress&cs=tinysrgb&w=100' },
                    { name: 'Goa Beaches', state: 'Goa', category: 'Beaches', rating: 4.6, image: 'https://images.pexels.com/photos/1450354/pexels-photo-1450354.jpeg?auto=compress&cs=tinysrgb&w=100' },
                    { name: 'Hampi Ruins', state: 'Karnataka', category: 'Historical', rating: 4.8, image: 'https://images.pexels.com/photos/5601199/pexels-photo-5601199.jpeg?auto=compress&cs=tinysrgb&w=100' },
                  ].map((place, idx) => (
                    <tr key={idx} className="border-b border-stone-100 dark:border-stone-800">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img src={place.image} alt={place.name} className="w-10 h-10 rounded-xl object-cover" loading="lazy" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22%3E%3Crect fill=%22%23e7e5e4%22 width=%2240%22 height=%2240%22/%3E%3C/svg%3E'; }} />
                          <span className="font-semibold text-stone-900 dark:text-white">{place.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-stone-600 dark:text-stone-400">{place.state}</td>
                      <td className="py-3"><span className="badge bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300">{place.category}</span></td>
                      <td className="py-3 text-stone-600 dark:text-stone-400">{place.rating} ★</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500" aria-label="View"><Eye size={16} /></button>
                          <button className="p-2 rounded-lg hover:bg-error-50 dark:hover:bg-error-500/10 text-error-500" aria-label="Delete"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hidden Gems Section */}
        {activeSection === 'gems' && (
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-6">Hidden Gems Management</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img src={item.image} alt={item.name} className="w-full h-40 object-cover" loading="lazy" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22160%22%3E%3Crect fill=%22%23e7e5e4%22 width=%22400%22 height=%22160%22/%3E%3C/svg%3E'; }} />
                  <div className="p-4">
                    <h4 className="font-bold text-stone-900 dark:text-white">{item.name}</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">{item.state} • {item.category}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 rounded-xl bg-success-500 text-white text-sm font-semibold flex items-center justify-center gap-1">
                        <Check size={14} /> Approve
                      </button>
                      <button className="flex-1 py-2 rounded-xl bg-error-500 text-white text-sm font-semibold flex items-center justify-center gap-1">
                        <XIcon size={14} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Approvals Section */}
        {activeSection === 'approvals' && (
          <div className="space-y-4">
            {pendingApprovals.map((item) => (
              <div key={item.id} className="glass-card p-5 flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover shrink-0" loading="lazy" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2264%22 height=%2264%22%3E%3Crect fill=%22%23e7e5e4%22 width=%2264%22 height=%2264%22/%3E%3C/svg%3E'; }} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-stone-900 dark:text-white">{item.name}</h4>
                  <p className="text-sm text-stone-500 dark:text-stone-400">{item.state} • {item.category}</p>
                  <p className="text-xs text-stone-400 mt-1">Submitted by {item.submittedBy} on {item.date}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-ghost text-sm"><Eye size={16} /> Preview</button>
                  <button className="px-4 py-2 rounded-full bg-success-500 text-white text-sm font-semibold flex items-center gap-1">
                    <Check size={16} /> Approve
                  </button>
                  <button className="px-4 py-2 rounded-full bg-error-500 text-white text-sm font-semibold flex items-center gap-1">
                    <XIcon size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reports Section */}
        {activeSection === 'reports' && (
          <div className="space-y-4">
            {reportedContent.map((report) => (
              <div key={report.id} className="glass-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-900 dark:text-white mb-1">{report.content}</h4>
                    <div className="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
                      <span>Reported by {report.reportedBy}</span>
                      <span>•</span>
                      <span>{report.date}</span>
                    </div>
                  </div>
                  <span className={`badge ${
                    report.status === 'pending' ? 'bg-accent-100 dark:bg-accent-500/20 text-accent-700 dark:text-accent-300' :
                    report.status === 'reviewing' ? 'bg-secondary-100 dark:bg-secondary-500/20 text-secondary-700 dark:text-secondary-300' :
                    'bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="badge bg-error-100 dark:bg-error-500/20 text-error-700 dark:text-error-300">
                    <Flag size={12} /> {report.reason}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="btn-ghost text-sm">Review</button>
                  {report.status !== 'resolved' && (
                    <button className="px-4 py-2 rounded-full bg-success-500 text-white text-sm font-semibold">
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users Section */}
        {activeSection === 'users' && (
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-6">User Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-700">
                    <th className="pb-3 font-semibold">User</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Joined</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((user) => (
                    <tr key={user.id} className="border-b border-stone-100 dark:border-stone-800">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" loading="lazy" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2236%22 height=%2236%22%3E%3Crect fill=%22%23e7e5e4%22 width=%2236%22 height=%2236%22/%3E%3C/svg%3E'; }} />
                          <div>
                            <p className="font-semibold text-stone-900 dark:text-white">{user.name}</p>
                            <p className="text-xs text-stone-500 dark:text-stone-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3"><span className="badge bg-secondary-100 dark:bg-secondary-500/20 text-secondary-700 dark:text-secondary-300">{user.role}</span></td>
                      <td className="py-3">
                        <span className={`badge ${user.status === 'Active' ? 'bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300' : 'bg-error-100 dark:bg-error-500/20 text-error-700 dark:text-error-300'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 text-stone-600 dark:text-stone-400">{user.joined}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500" aria-label="View"><Eye size={16} /></button>
                          <button className="p-2 rounded-lg hover:bg-error-50 dark:hover:bg-error-500/10 text-error-500" aria-label="Suspend"><XIcon size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories Section */}
        {activeSection === 'categories' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="glass-card p-5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3`}>
                  <Tag size={24} className="text-white" />
                </div>
                <h4 className="font-bold text-stone-900 dark:text-white">{cat.name}</h4>
                <p className="text-sm text-stone-500 dark:text-stone-400">{cat.count} places</p>
              </div>
            ))}
          </div>
        )}

        {/* Reviews Section */}
        {activeSection === 'reviews' && (
          <div className="space-y-4">
            {[
              { user: 'Emily Johnson', place: 'Taj Mahal', rating: 5, text: 'Truly a wonder of the world', date: '2024-06-15' },
              { user: 'David Chen', place: 'Kerala Backwaters', rating: 5, text: 'Paradise on Earth', date: '2024-05-22' },
              { user: 'Sara Williams', place: 'Jaipur Pink City', rating: 4, text: 'A city of colors and culture', date: '2024-04-10' },
            ].map((review, idx) => (
              <div key={idx} className="glass-card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-white">{review.user}</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">on {review.place} • {review.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className={s <= review.rating ? 'fill-accent-400 text-accent-400' : 'text-stone-300 dark:text-stone-600'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">{review.text}</p>
                <div className="flex gap-2 mt-3">
                  <button className="btn-ghost text-sm">View</button>
                  <button className="px-4 py-2 rounded-full bg-error-500 text-white text-sm font-semibold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bookings Section */}
        {activeSection === 'bookings' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">Booking Statistics</h2>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Bookings', value: adminBookingStats.totalBookings.toLocaleString(), icon: Calendar, color: 'primary' },
                { label: 'Upcoming', value: adminBookingStats.upcoming, icon: Clock, color: 'accent' },
                { label: 'Completed', value: adminBookingStats.completed, icon: Check, color: 'success' },
                { label: 'Cancelled', value: adminBookingStats.cancelled, icon: XIcon, color: 'error' },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                const colorClass = {
                  primary: 'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400',
                  accent: 'bg-accent-100 dark:bg-accent-500/20 text-accent-600 dark:text-accent-400',
                  success: 'bg-success-100 dark:bg-success-500/20 text-success-600 dark:text-success-400',
                  error: 'bg-error-100 dark:bg-error-500/20 text-error-600 dark:text-error-400',
                }[stat.color];
                return (
                  <div key={idx} className="glass-card p-4">
                    <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center mb-3`}>
                      <Icon size={20} />
                    </div>
                    <p className="text-2xl font-bold text-stone-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Revenue + avg visitors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-card p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success-100 dark:bg-success-500/20 flex items-center justify-center">
                  <DollarSign size={24} className="text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Total Revenue</p>
                  <p className="text-xl font-bold text-stone-900 dark:text-white">{adminBookingStats.revenue}</p>
                </div>
              </div>
              <div className="glass-card p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                  <Users size={24} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Avg Visitors/Booking</p>
                  <p className="text-xl font-bold text-stone-900 dark:text-white">{adminBookingStats.avgVisitors}</p>
                </div>
              </div>
            </div>

            {/* Booking Analytics Placeholder */}
            <div className="glass-card p-6">
              <h3 className="font-bold text-stone-900 dark:text-white mb-4">Booking Analytics</h3>
              <div className="flex items-end justify-between gap-3 h-48 pt-4">
                {adminBookingStats.monthlyData.map((d, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 transition-all cursor-pointer"
                      style={{ height: `${(d.bookings / 250) * 100}%` }}
                      title={`${d.bookings} bookings - ${d.revenue.toLocaleString()}`}
                    />
                    <span className="text-xs text-stone-500 dark:text-stone-400">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Bookings */}
            <div className="glass-card p-6">
              <h3 className="font-bold text-stone-900 dark:text-white mb-4">Pending Bookings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-700">
                      <th className="pb-2 pr-4 font-semibold">Booking ID</th>
                      <th className="pb-2 pr-4 font-semibold">Place</th>
                      <th className="pb-2 pr-4 font-semibold">Visitor</th>
                      <th className="pb-2 pr-4 font-semibold hidden sm:table-cell">Date</th>
                      <th className="pb-2 pr-4 font-semibold hidden sm:table-cell">Pax</th>
                      <th className="pb-2 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingBookingsData.map((b) => (
                      <tr key={b.id} className="border-b border-stone-100 dark:border-stone-800">
                        <td className="py-3 pr-4 font-semibold text-primary-600 dark:text-primary-400">{b.id}</td>
                        <td className="py-3 pr-4 text-stone-700 dark:text-stone-300">{b.placeName}</td>
                        <td className="py-3 pr-4 text-stone-700 dark:text-stone-300">{b.visitorName}</td>
                        <td className="py-3 pr-4 text-stone-500 dark:text-stone-400 hidden sm:table-cell">{b.visitDate}</td>
                        <td className="py-3 pr-4 text-stone-500 dark:text-stone-400 hidden sm:table-cell">{b.visitors}</td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            <button className="p-1.5 rounded-lg bg-success-100 dark:bg-success-500/20 text-success-600 dark:text-success-400 hover:bg-success-500 hover:text-white transition-colors">
                              <Check size={14} />
                            </button>
                            <button className="p-1.5 rounded-lg bg-error-100 dark:bg-error-500/20 text-error-600 dark:text-error-400 hover:bg-error-500 hover:text-white transition-colors">
                              <XIcon size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Completed & Cancelled summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-card p-5">
                <h3 className="font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
                  <Check size={18} className="text-success-500" /> Completed Bookings
                </h3>
                <p className="text-3xl font-bold text-success-600 dark:text-success-400">{adminBookingStats.completed}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {((adminBookingStats.completed / adminBookingStats.totalBookings) * 100).toFixed(1)}% of total bookings
                </p>
              </div>
              <div className="glass-card p-5">
                <h3 className="font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
                  <XIcon size={18} className="text-error-500" /> Cancelled Bookings
                </h3>
                <p className="text-3xl font-bold text-error-600 dark:text-error-400">{adminBookingStats.cancelled}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {((adminBookingStats.cancelled / adminBookingStats.totalBookings) * 100).toFixed(1)}% cancellation rate
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Guide Registration Requests Section */}
        {activeSection === 'guide-requests' && <GuideRegistrationRequests />}

        {/* Guide Management Section */}
        {activeSection === 'guides' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">Guide Management</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {guidesData.map((guide) => (
                <div key={guide.id} className="glass-card p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={guide.photo} alt={guide.name} className="w-12 h-12 rounded-xl object-cover" loading="lazy" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22%3E%3Crect fill=%22%23e7e5e4%22 width=%2248%22 height=%2248%22/%3E%3C/svg%3E'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 dark:text-white truncate">{guide.name}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{guide.experience} yrs • {guide.location}</p>
                    </div>
                    <span className={`badge ${guide.availability === 'available' ? 'bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300' : 'bg-accent-100 dark:bg-accent-500/20 text-accent-700 dark:text-accent-300'}`}>
                      {guide.availability}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 dark:text-stone-400">★ {guide.rating} ({guide.reviews})</span>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">{guide.fee}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white transition-all">Edit</button>
                    <button className="px-3 py-1.5 rounded-full text-xs font-semibold bg-error-500/10 text-error-600 dark:text-error-400 hover:bg-error-500 hover:text-white transition-all">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div className="glass-card p-6 sm:p-8 max-w-2xl">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-6">Admin Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Site Name</label>
                <input type="text" defaultValue="Explore India" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Admin Email</label>
                <input type="email" defaultValue="admin@exploreindia.in" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Auto-approve Reviews</label>
                <select className="input-field">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Max Upload Size (MB)</label>
                <input type="number" defaultValue="10" className="input-field" />
              </div>
              <button className="btn-primary">Save Settings</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
