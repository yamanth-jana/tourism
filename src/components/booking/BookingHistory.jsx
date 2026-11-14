import BookingCard from './BookingCard';

const STATUS_TABS = [
  { id: 'all', label: 'All Bookings' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function BookingHistory({ bookings, activeTab, onTabChange, onCancel }) {
  const filtered = activeTab === 'all'
    ? bookings
    : bookings.filter((b) => b.status === activeTab);

  return (
    <div>
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {STATUS_TABS.map((tab) => {
          const count = tab.id === 'all'
            ? bookings.length
            : bookings.filter((b) => b.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-stone-200/60 dark:bg-stone-700/60'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in">
          {filtered.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onCancel={onCancel} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center animate-fade-in">
          <p className="text-stone-500 dark:text-stone-400 mb-2">No {activeTab !== 'all' ? activeTab : ''} bookings found.</p>
          <p className="text-sm text-stone-400 dark:text-stone-500">Book a visit from any destination's details page!</p>
        </div>
      )}
    </div>
  );
}
