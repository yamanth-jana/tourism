import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

// Import initial dataset to seed in-memory state
import destinationsData from './src/data/destinations.js';
import additionalDestinations from './src/data/additionalDestinations.js';
import statesData from './src/data/states.js';
import { districts as districtsData } from './src/data/districts.js';
import categoriesData from './src/data/categories.js';
import hiddenGemsData from './src/data/hiddenGems.js';
import guidesData from './src/data/guides.js';
import { guideRegistrationRequests as initialRequests } from './src/data/guideRegistrations.js';
import bookingsData from './src/data/bookings.js';
import reviewsData from './src/data/reviews.js';
import { dashboardStats, reportedContent, adminUsers } from './src/data/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(cors());
  app.use(express.json());

  // ── In-Memory Database State ──
  const allDestinations = [...destinationsData, ...additionalDestinations];
  let users = [
    { id: 1, email: 'admin@exploreindia.com', password: 'admin123', name: 'Administrator', role: 'admin', status: 'ACTIVE', photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { id: 2, email: 'user@exploreindia.com', password: 'user123', name: 'Aarav Sharma', role: 'user', status: 'ACTIVE', photo: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200' },
  ];
  let bookings = [...bookingsData];
  let reviews = [...reviewsData];
  let favorites = new Map<string, Set<string>>(); // email/userId -> Set of placeIds
  favorites.set('user@exploreindia.com', new Set(['taj-mahal', 'munnar-tea-gardens', 'hampi-ruins']));
  let hiddenGems = [...hiddenGemsData];
  let guideRegistrations = [...initialRequests];
  let guides = [...guidesData];
  let reports = [...reportedContent];
  let placeSubmissions: any[] = [];
  let tripPlans: any[] = [];
  let contactMessages: any[] = [];
  let newsletterSubscribers: string[] = [];

  let notifications = [
    { id: 'n-1', type: 'booking', audience: 'user', title: 'Booking Confirmed', message: 'Your guided tour of the Taj Mahal has been confirmed for tomorrow at 9:00 AM.', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: 'n-2', type: 'trip', audience: 'user', title: 'Trip Recommendation', message: 'Based on your favourites, we recommend exploring the backwaters of Kerala this season.', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    { id: 'n-3', type: 'new_registration', audience: 'admin', title: 'New Guide Registration', message: 'Arjun Sharma submitted a new Government Certified Guide application.', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
    { id: 'n-4', type: 'pending_approval', audience: 'admin', title: 'Pending Approval', message: '2 guide applications are awaiting your review.', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  ];

  // Helper auth extractor
  function getAuthUser(req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.substring(7);
    try {
      // Decode simulated token or return matching user
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      return users.find((u) => u.email === decoded.email) || null;
    } catch {
      return users.find((u) => u.role === 'admin') || null;
    }
  }

  // ── Spring Boot Auto-Detection & Live Proxy ──
  const SPRING_BOOT_URL = process.env.SPRING_BOOT_URL || 'http://localhost:8080';
  let springBootLive = false;

  async function probeSpringBoot() {
    try {
      const res = await fetch(`${SPRING_BOOT_URL}/api/health`, { signal: AbortSignal.timeout(1000) });
      springBootLive = res.ok;
    } catch {
      springBootLive = false;
    }
  }
  probeSpringBoot();
  setInterval(probeSpringBoot, 8000);

  // If Spring Boot is running on port 8080, route all /api calls straight to Spring Boot
  app.use('/api', async (req: Request, res: Response, next) => {
    if (springBootLive) {
      try {
        const targetUrl = `${SPRING_BOOT_URL}/api${req.url}`;
        const headers: Record<string, string> = {};
        for (const [k, v] of Object.entries(req.headers)) {
          if (v && k !== 'host') headers[k] = Array.isArray(v) ? v.join(', ') : v;
        }
        const forwardOptions: RequestInit = {
          method: req.method,
          headers,
          body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
        };
        const springRes = await fetch(targetUrl, forwardOptions);
        const text = await springRes.text();
        res.status(springRes.status);
        springRes.headers.forEach((val, key) => {
          if (key.toLowerCase() !== 'content-encoding') res.setHeader(key, val);
        });
        res.setHeader('X-Backend-Mode', 'spring-boot-live');
        return res.send(text);
      } catch (err) {
        springBootLive = false;
        next();
      }
    } else {
      res.setHeader('X-Backend-Mode', 'preview-environment');
      next();
    }
  });

  // ── Health Check ──
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'UP', service: 'Explore India Backend', timestamp: new Date().toISOString() });
  });

  // ── Auth APIs ──
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Email and password are required' });
    }

    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (role === 'admin') {
      if (email === 'admin@exploreindia.com' && password === 'admin123') {
        const token = Buffer.from(JSON.stringify({ id: user?.id || 1, email, role: 'admin' })).toString('base64');
        return res.json({
          ok: true,
          message: 'Login successful',
          data: { token, id: 1, email, name: 'Administrator', role: 'admin', photo: user?.photo },
        });
      }
      return res.status(401).json({ ok: false, message: 'Invalid admin credentials' });
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ ok: false, message: 'Invalid email or password' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ ok: false, message: 'Account is not active' });
    }

    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role })).toString('base64');
    return res.json({
      ok: true,
      message: 'Login successful',
      data: { token, id: user.id, email: user.email, name: user.name, role: user.role, photo: user.photo },
    });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, password, phone } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ ok: false, message: 'Name, email, and password are required' });
    }

    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ ok: false, message: 'Email already exists' });
    }

    const newUser = {
      id: users.length + 1,
      email,
      password,
      name,
      phone: phone || '',
      role: 'user',
      status: 'ACTIVE',
      photo: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
    };
    users.push(newUser);

    const token = Buffer.from(JSON.stringify({ id: newUser.id, email: newUser.email, role: newUser.role })).toString('base64');
    return res.json({
      ok: true,
      message: 'Registration successful',
      data: { token, id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, photo: newUser.photo },
    });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = getAuthUser(req) || users[1];
    return res.json({ ok: true, data: user });
  });

  // ── Places APIs ──
  app.get('/api/places', (req: Request, res: Response) => {
    const { search, state, district, category, minRating, page = '0', size = '12' } = req.query;
    let list = [...allDestinations];

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.city && p.city.toLowerCase().includes(q)) ||
        (p.state && p.state.toLowerCase().includes(q))
      );
    }
    if (state) {
      list = list.filter((p) => p.stateId === state || p.state.toLowerCase() === String(state).toLowerCase());
    }
    if (district) {
      list = list.filter((p) => p.districtId === district || (p.district && p.district.toLowerCase() === String(district).toLowerCase()));
    }
    if (category) {
      list = list.filter((p) => p.category === category || p.categoryName?.toLowerCase() === String(category).toLowerCase());
    }
    if (minRating) {
      list = list.filter((p) => (p.rating || 0) >= parseFloat(String(minRating)));
    }

    const pNum = parseInt(String(page), 10);
    const pSize = parseInt(String(size), 10);
    const totalElements = list.length;
    const totalPages = Math.ceil(totalElements / pSize);
    const content = list.slice(pNum * pSize, (pNum + 1) * pSize);

    return res.json({
      ok: true,
      data: {
        content,
        totalElements,
        totalPages,
        number: pNum,
        size: pSize,
      },
    });
  });

  app.get('/api/places/:id', (req: Request, res: Response) => {
    const place = allDestinations.find((p) => p.id === req.params.id);
    if (!place) return res.status(404).json({ ok: false, message: 'Place not found' });
    return res.json({ ok: true, data: place });
  });

  // ── States & Districts APIs ──
  app.get('/api/states', (req: Request, res: Response) => {
    return res.json({ ok: true, data: statesData });
  });

  app.get('/api/districts', (req: Request, res: Response) => {
    return res.json({ ok: true, data: districtsData });
  });

  app.get('/api/states/:stateId/districts', (req: Request, res: Response) => {
    const stateDistricts = districtsData.filter((d: any) => d.stateId === req.params.stateId);
    return res.json({ ok: true, data: stateDistricts });
  });

  // ── Categories APIs ──
  app.get('/api/categories', (req: Request, res: Response) => {
    return res.json({ ok: true, data: categoriesData });
  });

  // ── Hidden Gems APIs ──
  app.get('/api/hidden-gems', (req: Request, res: Response) => {
    return res.json({ ok: true, data: hiddenGems });
  });

  app.post('/api/hidden-gems', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const newGem = {
      id: `gem-${Date.now()}`,
      ...req.body,
      submittedBy: user?.name || req.body.submittedBy || 'Anonymous',
      status: 'APPROVED',
      upvotesCount: 0,
      createdAt: new Date().toISOString(),
    };
    hiddenGems.unshift(newGem);
    return res.json({ ok: true, data: newGem });
  });

  // ── Favorites APIs ──
  app.get('/api/favorites', (req: Request, res: Response) => {
    const user = getAuthUser(req) || users[1];
    const favSet = favorites.get(user.email) || new Set();
    return res.json({ ok: true, data: Array.from(favSet) });
  });

  app.post('/api/favorites/:placeId', (req: Request, res: Response) => {
    const user = getAuthUser(req) || users[1];
    let favSet = favorites.get(user.email);
    if (!favSet) {
      favSet = new Set();
      favorites.set(user.email, favSet);
    }
    favSet.add(req.params.placeId);
    return res.json({ ok: true, message: 'Added to favorites' });
  });

  app.delete('/api/favorites/:placeId', (req: Request, res: Response) => {
    const user = getAuthUser(req) || users[1];
    const favSet = favorites.get(user.email);
    if (favSet) {
      favSet.delete(req.params.placeId);
    }
    return res.json({ ok: true, message: 'Removed from favorites' });
  });

  // ── Reviews APIs ──
  app.get('/api/reviews', (req: Request, res: Response) => {
    return res.json({ ok: true, data: reviews });
  });

  app.get('/api/places/:placeId/reviews', (req: Request, res: Response) => {
    const list = reviews.filter((r) => r.placeId === req.params.placeId || r.placeName?.toLowerCase().includes(req.params.placeId.replace(/-/g, ' ')));
    return res.json({ ok: true, data: list });
  });

  app.post('/api/places/:placeId/reviews', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const newReview = {
      id: `rev-${Date.now()}`,
      placeId: req.params.placeId,
      placeName: req.body.placeName || 'Tourist Destination',
      userName: user?.name || req.body.userName || 'Traveller',
      userAvatar: user?.photo || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: req.body.rating || 5,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      title: req.body.title || 'Wonderful experience',
      comment: req.body.comment || '',
      photos: req.body.photos || [],
    };
    reviews.unshift(newReview);
    return res.json({ ok: true, data: newReview });
  });

  app.post('/api/reviews/:id/helpful', (req: Request, res: Response) => {
    const review = reviews.find((r) => r.id === req.params.id);
    if (review) {
      review.helpful = (review.helpful || 0) + 1;
      return res.json({ ok: true, data: review.helpful });
    }
    return res.status(404).json({ ok: false, message: 'Review not found' });
  });

  // ── Bookings APIs ──
  app.get('/api/bookings/my', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const userEmail = user?.email || 'priya.nair@email.com';
    const list = bookings.filter((b) => b.email?.toLowerCase() === userEmail.toLowerCase() || b.visitorName?.toLowerCase() === user?.name?.toLowerCase());
    return res.json({ ok: true, data: list.length > 0 ? list : bookings });
  });

  app.get('/api/bookings/:id', (req: Request, res: Response) => {
    const booking = bookings.find((b) => b.id === req.params.id);
    if (!booking) return res.status(404).json({ ok: false, message: 'Booking not found' });
    return res.json({ ok: true, data: booking });
  });

  app.post('/api/bookings', (req: Request, res: Response) => {
    const newBooking = {
      id: `BK-2024-${Math.floor(Math.random() * 900) + 100}`,
      status: 'upcoming',
      bookingDate: new Date().toISOString().split('T')[0],
      ...req.body,
    };
    bookings.unshift(newBooking);

    // Notify user & admin
    notifications.unshift({
      id: `n-${Date.now()}`,
      type: 'booking',
      audience: 'user',
      title: 'Booking Confirmed',
      message: `Your visit to ${newBooking.placeName} on ${newBooking.visitDate} is booked.`,
      read: false,
      createdAt: new Date().toISOString(),
    });

    return res.json({ ok: true, message: 'Booking created', data: newBooking });
  });

  app.put('/api/bookings/:id/cancel', (req: Request, res: Response) => {
    const booking = bookings.find((b) => b.id === req.params.id);
    if (!booking) return res.status(404).json({ ok: false, message: 'Booking not found' });
    booking.status = 'cancelled';
    return res.json({ ok: true, message: 'Booking cancelled', data: booking });
  });

  // ── Guides APIs ──
  app.get('/api/guides', (req: Request, res: Response) => {
    const { state, type } = req.query;
    let list = [...guides];
    if (state) list = list.filter((g) => g.state?.toLowerCase() === String(state).toLowerCase());
    if (type) list = list.filter((g) => g.guideType?.toLowerCase() === String(type).toLowerCase());
    return res.json({ ok: true, data: list });
  });

  app.get('/api/guides/:id', (req: Request, res: Response) => {
    const guide = guides.find((g) => g.id === req.params.id);
    if (!guide) return res.status(404).json({ ok: false, message: 'Guide not found' });
    return res.json({ ok: true, data: guide });
  });

  app.post('/api/guide-registrations', (req: Request, res: Response) => {
    const newReq = {
      id: `gr-${Date.now()}`,
      submittedDate: new Date().toISOString().slice(0, 10),
      status: 'pending',
      adminComments: '',
      ...req.body,
    };
    guideRegistrations.unshift(newReq);

    notifications.unshift({
      id: `n-${Date.now()}`,
      type: 'new_registration',
      audience: 'admin',
      title: 'New Guide Registration',
      message: `${newReq.fullName} submitted a guide application.`,
      read: false,
      createdAt: new Date().toISOString(),
    });

    return res.json({ ok: true, message: 'Registration submitted', data: newReq });
  });

  app.get('/api/guide-registrations/my', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const list = guideRegistrations.filter((r) => r.email === user?.email || r.fullName === user?.name);
    return res.json({ ok: true, data: list.length > 0 ? list : guideRegistrations });
  });

  // ── Notifications APIs ──
  app.get('/api/notifications', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const audience = user?.role === 'admin' ? 'admin' : 'user';
    const list = notifications.filter((n) => n.audience === audience || !n.audience);
    return res.json({ ok: true, data: list.length > 0 ? list : notifications });
  });

  app.put('/api/notifications/:id/read', (req: Request, res: Response) => {
    const n = notifications.find((item) => item.id === req.params.id);
    if (n) n.read = true;
    return res.json({ ok: true, message: 'Marked as read' });
  });

  app.put('/api/notifications/read-all', (req: Request, res: Response) => {
    notifications.forEach((n) => (n.read = true));
    return res.json({ ok: true, message: 'All marked as read' });
  });

  // ── Place Submissions & Reports ──
  app.post('/api/place-submissions', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const sub = {
      id: Date.now(),
      ...req.body,
      submittedBy: user?.name || 'Traveller',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    placeSubmissions.unshift(sub);
    return res.json({ ok: true, message: 'Place submitted for review', data: sub });
  });

  app.post('/api/reports', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const report = {
      id: Date.now(),
      ...req.body,
      reportedBy: user?.name || 'Anonymous',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };
    reports.unshift(report);
    return res.json({ ok: true, message: 'Report submitted', data: report });
  });

  // ── Contact & Newsletter ──
  app.post('/api/contact', (req: Request, res: Response) => {
    const msg = { id: Date.now(), ...req.body, isRead: false, createdAt: new Date().toISOString() };
    contactMessages.push(msg);
    return res.json({ ok: true, message: 'Message received', data: msg });
  });

  app.post('/api/newsletter/subscribe', (req: Request, res: Response) => {
    const { email } = req.body;
    if (email && !newsletterSubscribers.includes(email)) {
      newsletterSubscribers.push(email);
    }
    return res.json({ ok: true, message: 'Subscribed successfully' });
  });

  // ── Chatbot API ──
  app.post('/api/chatbot/message', (req: Request, res: Response) => {
    const { message = '', conversationId = 'default' } = req.body;
    const q = message.toLowerCase();
    let reply = "Hello! I am your AI Travel Assistant for Explore India. Ask me about popular destinations, hidden gems, booking guides, or planning your dream journey across India!";
    let suggestions = ["Famous Places in Rajasthan", "Hidden Gems in Himachal", "Trip Planner"];

    if (q.includes('taj') || q.includes('agra')) {
      reply = "The Taj Mahal in Agra, Uttar Pradesh is an ivory-white marble mausoleum commissioned in 1632 by Mughal emperor Shah Jahan. Early morning sunrise is the best time for photography!";
      suggestions = ["Book Taj Mahal Guide", "Explore Uttar Pradesh", "How to reach Taj Mahal?"];
    } else if (q.includes('kerala') || q.includes('backwater') || q.includes('munnar')) {
      reply = "Kerala offers serene backwaters in Alappuzha, lush tea estates in Munnar, and peaceful beaches. November through February offers the most comfortable weather!";
      suggestions = ["Best time to visit Kerala", "Kerala Backwaters", "Plan Kerala Itinerary"];
    } else if (q.includes('guide')) {
      reply = "Explore India has certified, experienced tour guides across all major states. You can book an authorized guide directly through our Guides page or during destination booking!";
      suggestions = ["Find tour guides", "Become a guide", "My bookings"];
    } else if (q.includes('plan') || q.includes('trip')) {
      reply = "You can use our smart Trip Planner wizard to generate personalized day-by-day itineraries tailored to your state, district, and preferred theme!";
      suggestions = ["Open Trip Planner", "Top rated places", "Trending destinations"];
    }

    return res.json({
      ok: true,
      data: { reply, suggestions, conversationId },
    });
  });

  // ── Admin APIs ──
  app.get('/api/admin/dashboard/stats', (req: Request, res: Response) => {
    return res.json({
      ok: true,
      data: {
        totalUsers: users.length + 24850,
        totalTouristPlaces: allDestinations.length,
        pendingUploads: placeSubmissions.length + 47,
        totalReports: reports.length + 23,
        totalReviews: reviews.length + 15600,
        totalHiddenGems: hiddenGems.length + 310,
        monthlyGrowth: 12.5,
        activeUsers: users.length + 8930,
        totalBookings: bookings.length + 1240,
        upcomingBookings: bookings.filter((b) => b.status === 'upcoming').length,
        verifiedGuides: guides.length + 45,
        pendingGuideApplications: guideRegistrations.filter((r) => r.status === 'pending').length,
      },
    });
  });

  app.get('/api/admin/bookings', (req: Request, res: Response) => {
    return res.json({ ok: true, data: bookings });
  });

  app.put('/api/admin/bookings/:id/status', (req: Request, res: Response) => {
    const booking = bookings.find((b) => b.id === req.params.id);
    if (booking) {
      booking.status = req.body.status;
      return res.json({ ok: true, data: booking });
    }
    return res.status(404).json({ ok: false, message: 'Booking not found' });
  });

  app.get('/api/admin/guide-registrations', (req: Request, res: Response) => {
    return res.json({ ok: true, data: guideRegistrations });
  });

  app.put('/api/admin/guide-registrations/:id/status', (req: Request, res: Response) => {
    const reg = guideRegistrations.find((r) => r.id === req.params.id);
    if (reg) {
      reg.status = req.body.status;
      if (req.body.adminComments) reg.adminComments = req.body.adminComments;
      return res.json({ ok: true, data: reg });
    }
    return res.status(404).json({ ok: false, message: 'Registration not found' });
  });

  app.get('/api/admin/reports', (req: Request, res: Response) => {
    return res.json({ ok: true, data: reports });
  });

  app.put('/api/admin/reports/:id/status', (req: Request, res: Response) => {
    const rep = reports.find((r) => String(r.id) === String(req.params.id));
    if (rep) {
      rep.status = req.body.status;
      return res.json({ ok: true, data: rep });
    }
    return res.status(404).json({ ok: false, message: 'Report not found' });
  });

  app.get('/api/admin/place-submissions', (req: Request, res: Response) => {
    return res.json({ ok: true, data: placeSubmissions });
  });

  app.get('/api/admin/users', (req: Request, res: Response) => {
    return res.json({ ok: true, data: users });
  });

  // ── Mount Vite Dev Middleware ──
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Explore India Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
