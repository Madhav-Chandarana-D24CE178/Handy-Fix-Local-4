/**
 * HandyFix Shared Database Layer (localStorage-based)
 * Shared across User Panel (localhost:5173), Provider Panel (localhost:5174), Admin Panel (localhost:5175)
 * 
 * This serves as the "database" until backend is ready.
 * All data syncs via localStorage events in real-time between open tabs.
 */

window.HF_DB = {
  // Shared localStorage keys
  KEYS: {
    USERS: 'hf-users',                      // All registered users
    PROVIDERS: 'hf-providers',              // All registered providers
    BOOKINGS: 'hf-bookings',                // All bookings across all users
    ONLINE_STATUS: 'hf-providers-online',   // { providerId: boolean }
    ACTIVE_JOB: 'hf-active-job',            // Current job being worked by provider
    CHAT_THREADS: 'hf-chat-threads',        // { bookingId: {messages: [...]} }
    NOTIFICATIONS: 'hf-notifications',      // Global notifications
    SEEN_BOOKING_IDS: 'hf-seen-booking-ids', // Track which bookings provider has seen
    NEW_BOOKING_PING: 'hf-new-booking-ping',// Trigger for new bookings
    BOOKING_UPDATE_PING: 'hf-booking-update-ping', // Trigger for booking status updates
    ADMINS: 'hf-admins',                    // Multi-admin support {email: {name, password, role}}
  },

  // ======================= INITIALIZATION =======================
  init() {
    this.seedProviders();
    this.seedNotifications();
    this.seedAdmins();
    this.setupListeners();
    console.log('✓ HF_DB initialized');
  },

  seedProviders() {
    if (JSON.parse(localStorage.getItem(this.KEYS.PROVIDERS) || '[]').length > 0) return;
    
    const providers = [
      {
        id: 'PRO-001',
        phone: '9876543210',
        name: 'Ramesh Patel',
        services: ['AC Repair', 'AC Service', 'AC Installation'],
        city: 'Petlad', pincode: '388150',
        lat: 22.5645, lng: 72.9289,
        rating: 4.9, totalJobs: 284, totalEarnings: 89600,
        isOnline: true, status: 'approved', verified: true,
        hourlyRate: 350, experience: '7 years',
        profileImage: '', createdAt: new Date().toISOString(),
        bankAccount: 'AXIS1234567890', bankName: 'Axis Bank'
      },
      {
        id: 'PRO-002',
        phone: '8765432109',
        name: 'Sunil Mehta',
        services: ['Electrician', 'Appliance Repair'],
        city: 'Anand', pincode: '388001',
        lat: 22.5595, lng: 72.9340,
        rating: 4.6, totalJobs: 156, totalEarnings: 39000,
        isOnline: true, status: 'approved', verified: true,
        hourlyRate: 300, experience: '4 years',
        profileImage: '', createdAt: new Date().toISOString(),
        bankAccount: 'ICICI9876543210', bankName: 'ICICI Bank'
      },
      {
        id: 'PRO-003',
        phone: '7654321098',
        name: 'Kiran Shah',
        services: ['Plumber', 'Pipe Work'],
        city: 'Vadodara', pincode: '390001',
        lat: 22.3072, lng: 73.1812,
        rating: 4.8, totalJobs: 312, totalEarnings: 124800,
        isOnline: false, status: 'approved', verified: true,
        hourlyRate: 400, experience: '9 years',
        profileImage: '', createdAt: new Date().toISOString(),
        bankAccount: 'HDFC5432109876', bankName: 'HDFC Bank'
      }
    ];
    
    localStorage.setItem(this.KEYS.PROVIDERS, JSON.stringify(providers));
    
    // Initialize online status map
    const onlineMap = {};
    providers.forEach(p => { onlineMap[p.id] = p.isOnline; });
    localStorage.setItem(this.KEYS.ONLINE_STATUS, JSON.stringify(onlineMap));
  },

  seedNotifications() {
    if (JSON.parse(localStorage.getItem(this.KEYS.NOTIFICATIONS) || '[]').length > 0) return;
    const notifs = [
      { id: 'SYS-001', type: 'system', title: 'Welcome to HandyFix!', message: '✈️ Platform is ready. Start booking or accepting jobs.', timestamp: Date.now(), read: false }
    ];
    localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  seedAdmins() {
    if (localStorage.getItem(this.KEYS.ADMINS)) return;
    const admins = {
      'admin@handyfix.com': { name: 'Raj Kumar', password: 'admin123', role: 'super-admin', createdAt: new Date().toISOString() },
      'manager@handyfix.com': { name: 'Priya Sharma', password: 'manager123', role: 'manager', createdAt: new Date().toISOString() },
      'support@handyfix.com': { name: 'Amit Patel', password: 'support123', role: 'support', createdAt: new Date().toISOString() }
    };
    localStorage.setItem(this.KEYS.ADMINS, JSON.stringify(admins));
  },

  setupListeners() {
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === this.KEYS.NEW_BOOKING_PING || e.key === this.KEYS.BOOKING_UPDATE_PING) {
        window.dispatchEvent(new CustomEvent('hf-db-sync', { detail: { key: e.key, value: e.newValue } }));
      }
    });
  },

  // ======================= USERS =======================
  getAllUsers() {
    return JSON.parse(localStorage.getItem(this.KEYS.USERS) || '{}');
  },

  getUsersByPhone(phone) {
    const users = this.getAllUsers();
    return users[phone] || null;
  },

  saveUser(phone, userData) {
    const users = this.getAllUsers();
    users[phone] = userData;
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    this.broadcastSync(this.KEYS.USERS);
  },

  // ======================= ADMINS =======================
  getAllAdmins() {
    return JSON.parse(localStorage.getItem(this.KEYS.ADMINS) || '{}');
  },

  verifyAdmin(email, password) {
    const admins = this.getAllAdmins();
    const admin = admins[email];
    if (admin && admin.password === password) {
      return { email, name: admin.name, role: admin.role };
    }
    return null;
  },

  addAdmin(email, password, name, role = 'manager') {
    const admins = this.getAllAdmins();
    admins[email] = { name, password, role, createdAt: new Date().toISOString() };
    localStorage.setItem(this.KEYS.ADMINS, JSON.stringify(admins));
    this.broadcastSync(this.KEYS.ADMINS);
  },

  // ======================= PROVIDERS =======================
  getAllProviders() {
    return JSON.parse(localStorage.getItem(this.KEYS.PROVIDERS) || '[]');
  },

  getProviderById(id) {
    return this.getAllProviders().find(p => p.id === id) || null;
  },

  saveProvider(provider) {
    const providers = this.getAllProviders();
    const idx = providers.findIndex(p => p.id === provider.id);
    if (idx >= 0) providers[idx] = provider;
    else providers.push(provider);
    localStorage.setItem(this.KEYS.PROVIDERS, JSON.stringify(providers));
    this.broadcastSync(this.KEYS.PROVIDERS);
  },

  getOnlineProviders(serviceFilter = null) {
    const providers = this.getAllProviders();
    const onlineMap = JSON.parse(localStorage.getItem(this.KEYS.ONLINE_STATUS) || '{}');
    
    return providers.filter(p => {
      const isOnline = onlineMap[p.id] === true;
      const isApproved = p.status === 'approved';
      const matchesService = !serviceFilter || p.services.some(s => s.toLowerCase().includes(serviceFilter.toLowerCase()));
      return isOnline && isApproved && matchesService;
    });
  },

  setProviderOnline(providerId, isOnline) {
    const onlineMap = JSON.parse(localStorage.getItem(this.KEYS.ONLINE_STATUS) || '{}');
    onlineMap[providerId] = isOnline;
    
    // Also update provider record
    const providers = this.getAllProviders();
    const idx = providers.findIndex(p => p.id === providerId);
    if (idx >= 0) {
      providers[idx].isOnline = isOnline;
      localStorage.setItem(this.KEYS.PROVIDERS, JSON.stringify(providers));
    }
    
    localStorage.setItem(this.KEYS.ONLINE_STATUS, JSON.stringify(onlineMap));
    this.broadcastSync(this.KEYS.ONLINE_STATUS);
  },

  // ======================= BOOKINGS =======================
  getAllBookings() {
    return JSON.parse(localStorage.getItem(this.KEYS.BOOKINGS) || '[]');
  },

  getBookingById(bookingId) {
    return this.getAllBookings().find(b => b.id === bookingId) || null;
  },

  getBookingsByUserId(userId) {
    return this.getAllBookings().filter(b => b.userId === userId);
  },

  getBookingsByProviderId(providerId) {
    return this.getAllBookings().filter(b => b.providerId === providerId);
  },

  getUnassignedBookings(serviceFilter = null) {
    return this.getAllBookings().filter(b => {
      const isUnassigned = b.status === 'confirmed' && !b.providerId;
      const matchesService = !serviceFilter || b.service.toLowerCase().includes(serviceFilter.toLowerCase());
      return isUnassigned && matchesService;
    });
  },

  createBooking(bookingData) {
    const bookings = this.getAllBookings();
    const booking = {
      id: 'HF' + Date.now().toString().slice(-6),
      ...bookingData,
      createdAt: Date.now(),
      status: 'confirmed'
    };
    bookings.unshift(booking);
    localStorage.setItem(this.KEYS.BOOKINGS, JSON.stringify(bookings));
    
    // Ping listeners about new booking
    this.broadcastNewBooking(booking);
    
    return booking;
  },

  updateBooking(bookingId, updates) {
    const bookings = this.getAllBookings();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx >= 0) {
      bookings[idx] = { ...bookings[idx], ...updates };
      localStorage.setItem(this.KEYS.BOOKINGS, JSON.stringify(bookings));
      
      // Ping listeners about update
      this.broadcastBookingUpdate(bookingId, updates);
      
      return bookings[idx];
    }
    return null;
  },

  // ======================= ACTIVE JOB =======================
  getActiveJob() {
    const job = localStorage.getItem(this.KEYS.ACTIVE_JOB);
    return job ? JSON.parse(job) : null;
  },

  setActiveJob(booking) {
    localStorage.setItem(this.KEYS.ACTIVE_JOB, JSON.stringify(booking));
    this.broadcastSync(this.KEYS.ACTIVE_JOB);
  },

  clearActiveJob() {
    localStorage.removeItem(this.KEYS.ACTIVE_JOB);
    this.broadcastSync(this.KEYS.ACTIVE_JOB);
  },

  // ======================= CHAT =======================
  getChatThread(bookingId) {
    const threads = JSON.parse(localStorage.getItem(this.KEYS.CHAT_THREADS) || '{}');
    return threads[bookingId] || { messages: [] };
  },

  sendChatMessage(bookingId, message) {
    const threads = JSON.parse(localStorage.getItem(this.KEYS.CHAT_THREADS) || '{}');
    if (!threads[bookingId]) threads[bookingId] = { messages: [] };
    
    threads[bookingId].messages.push({
      id: Date.now(),
      ...message,
      timestamp: Date.now()
    });
    
    localStorage.setItem(this.KEYS.CHAT_THREADS, JSON.stringify(threads));
    this.broadcastSync(this.KEYS.CHAT_THREADS);
    
    return threads[bookingId].messages[threads[bookingId].messages.length - 1];
  },

  // ======================= NOTIFICATIONS =======================
  getNotifications() {
    return JSON.parse(localStorage.getItem(this.KEYS.NOTIFICATIONS) || '[]');
  },

  addNotification(notification) {
    const notifs = this.getNotifications();
    notifs.unshift({
      id: 'N' + Date.now(),
      timestamp: Date.now(),
      read: false,
      ...notification
    });
    localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    this.broadcastSync(this.KEYS.NOTIFICATIONS);
  },

  markNotificationRead(notificationId) {
    const notifs = this.getNotifications();
    const idx = notifs.findIndex(n => n.id === notificationId);
    if (idx >= 0) notifs[idx].read = true;
    localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  // ======================= BROADCAST / SYNC =======================
  broadcastSync(key) {
    // Trigger storage event for other tabs
    const ping = { key, timestamp: Date.now() };
    localStorage.setItem('hf-db-sync-ping-' + key, JSON.stringify(ping));
    setTimeout(() => localStorage.removeItem('hf-db-sync-ping-' + key), 1000);
  },

  broadcastNewBooking(booking) {
    localStorage.setItem(this.KEYS.NEW_BOOKING_PING, JSON.stringify({
      bookingId: booking.id,
      timestamp: Date.now()
    }));
  },

  broadcastBookingUpdate(bookingId, updates) {
    localStorage.setItem(this.KEYS.BOOKING_UPDATE_PING, JSON.stringify({
      bookingId,
      updates,
      timestamp: Date.now()
    }));
  },

  // ======================= SEEN BOOKINGS =======================
  getSeenBookingIds() {
    return new Set(JSON.parse(localStorage.getItem(this.KEYS.SEEN_BOOKING_IDS) || '[]'));
  },

  markBookingAsSeen(bookingId) {
    const seen = this.getSeenBookingIds();
    seen.add(bookingId);
    localStorage.setItem(this.KEYS.SEEN_BOOKING_IDS, JSON.stringify([...seen]));
  },

  // ======================= EARNINGS =======================
  getEarningsToday(providerId) {
    const bookings = this.getBookingsByProviderId(providerId);
    const today = new Date().toDateString();
    return bookings
      .filter(b => b.status === 'completed' && new Date(b.completedAt || 0).toDateString() === today)
      .reduce((sum, b) => sum + (b.amount || 0), 0);
  },

  getEarningsThisMonth(providerId) {
    const bookings = this.getBookingsByProviderId(providerId);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return bookings
      .filter(b => {
        const completedDate = new Date(b.completedAt || 0);
        return b.status === 'completed' && 
               completedDate.getMonth() === currentMonth && 
               completedDate.getFullYear() === currentYear;
      })
      .reduce((sum, b) => sum + (b.amount || 0), 0);
  },

  // ======================= UTILITIES =======================
  clear() {
    // WARNING: Clears all data. Use for testing only
    Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
    console.warn('⚠️ HF_DB cleared');
  },

  export() {
    // Export all data for backup
    const data = {};
    Object.keys(this.KEYS).forEach(k => {
      const key = this.KEYS[k];
      data[key] = localStorage.getItem(key);
    });
    return JSON.stringify(data, null, 2);
  }
};

// Initialize on script load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => HF_DB.init());
} else {
  HF_DB.init();
}
