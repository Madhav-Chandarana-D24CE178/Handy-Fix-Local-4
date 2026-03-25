import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  phone: string
  email?: string
  address: string
  pincode: string
  city: string
  avatar: string
  createdAt: string
  referralCode: string
  walletBalance: number
  subscriptionPlan: 'free' | 'plus'
}

interface Booking {
  id: string
  userId: string
  service: string
  serviceId: number
  provider: Provider
  date: string
  time: string
  address: string
  description: string
  status: 'confirmed' | 'accepted' | 'active' | 'completed' | 'cancelled'
  amount: number
  paymentMethod: 'online' | 'cash' | 'wallet'
  paymentStatus: 'paid' | 'pending'
  createdAt: string
  rating?: number
  review?: string
  couponApplied?: string
  discount?: number
}

interface Provider {
  id: number
  name: string
  initials: string
  service: string
  experience: string
  rating: number
  reviews: number
  distance: string
  eta: string
  rate: number
  available: boolean
  phone: string
  totalJobs: number
}

interface Notification {
  id: string
  type: 'booking' | 'provider' | 'payment' | 'promo' | 'system'
  title: string
  message: string
  time: string
  read: boolean
  action?: string
  actionLabel?: string
}

interface UserLocation {
  latitude: number
  longitude: number
  address: string
  city: string
  isEnabled: boolean
}

interface Service {
  id: number
  name: string
  pros: string
  price: string
  img: string
}

interface AppContextType {
  user: User | null
  isLoggedIn: boolean
  bookings: Booking[]
  notifications: Notification[]
  unreadCount: number
  selectedService: Service | null
  selectedProvider: Provider | null
  cartData: any
  userLocation: UserLocation | null
  setUserLocation: (location: UserLocation) => void
  clearUserLocation: () => void
  login: (user: User) => void
  logout: () => void
  addBooking: (booking: Booking) => void
  updateBooking: (id: string, updates: Partial<Booking>) => void
  markNotificationRead: (id: string) => void
  markAllRead: () => void
  clearNotifications: () => void
  setSelectedService: (s: Service | null) => void
  setSelectedProvider: (p: Provider | null) => void
  setCartData: (d: any) => void
  addNotification: (n: Notification) => void
}

const AppContext = createContext<AppContextType | null>(null)

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

// Sample demo data for first-time users
const DEMO_BOOKINGS: Booking[] = [
  {
    id: 'HF482931', userId: 'demo', service: 'AC Repair',
    serviceId: 1,
    provider: { id: 1, name: 'Ramesh Patel', initials: 'RP',
      service: 'AC Technician', experience: '7 yrs', rating: 4.9,
      reviews: 284, distance: '1.2 km', eta: '45 min', rate: 350,
      available: true, phone: '+91 98765 43210', totalJobs: 284 },
    date: new Date().toLocaleDateString('en-IN'),
    time: '2:30 PM', address: '12-B Sukhram Society, Petlad',
    description: 'AC not cooling properly', status: 'active',
    amount: 450, paymentMethod: 'online', paymentStatus: 'paid',
    createdAt: new Date().toISOString()
  },
  {
    id: 'HF481020', userId: 'demo', service: 'Plumber', serviceId: 2,
    provider: { id: 2, name: 'Sunil Mehta', initials: 'SM',
      service: 'Plumber', experience: '4 yrs', rating: 4.6,
      reviews: 156, distance: '2.8 km', eta: '60 min', rate: 300,
      available: true, phone: '+91 87654 32109', totalJobs: 156 },
    date: new Date(Date.now() - 5*86400000).toLocaleDateString('en-IN'),
    time: '11:00 AM', address: '12-B Sukhram Society, Petlad',
    description: 'Pipe leaking under sink', status: 'completed',
    amount: 300, paymentMethod: 'cash', paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 5*86400000).toISOString(),
    rating: 5, review: 'Very professional and quick!'
  },
  {
    id: 'HF479854', userId: 'demo', service: 'Electrician', serviceId: 3,
    provider: { id: 3, name: 'Karan Shah', initials: 'KS',
      service: 'Electrician', experience: '6 yrs', rating: 4.7,
      reviews: 198, distance: '1.5 km', eta: '40 min', rate: 380,
      available: true, phone: '+91 76543 21098', totalJobs: 198 },
    date: new Date(Date.now() + 86400000).toLocaleDateString('en-IN'),
    time: '10:00 AM', address: '12-B Sukhram Society, Petlad',
    description: 'Ceiling fan not working', status: 'confirmed',
    amount: 380, paymentMethod: 'online', paymentStatus: 'paid',
    createdAt: new Date().toISOString()
  }
]

const DEMO_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'provider', title: 'Pro is on the way!',
    message: 'Ramesh Patel accepted your booking and is heading to you.',
    time: '2 min ago', read: false, action: '/tracking', actionLabel: 'Track Live' },
  { id: 'n2', type: 'booking', title: 'Booking Confirmed ✓',
    message: 'Your AC Repair booking #HF482931 is confirmed for today 2:30 PM.',
    time: '10 min ago', read: false },
  { id: 'n3', type: 'payment', title: 'Payment Received',
    message: '₹300 payment confirmed for Plumber service. Transaction: TXN8492.',
    time: 'Yesterday', read: true },
  { id: 'n4', type: 'promo', title: '🎉 First service FREE!',
    message: 'Use code FIRST50 to get ₹50 off your next booking.',
    time: '2 days ago', read: true },
  { id: 'n5', type: 'system', title: 'Rate your experience',
    message: 'How was your Plumber service with Sunil Mehta? Share your feedback.',
    time: '5 days ago', read: true, action: '/my-bookings', actionLabel: 'Rate Now' }
]

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [cartData, setCartData] = useState<any>({})
  const [userLocation, setUserLocationState] = useState<UserLocation | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('hf-user')
    const savedBookings = localStorage.getItem('hf-bookings')
    const savedNotifs = localStorage.getItem('hf-notifications')
    const savedLocation = localStorage.getItem('hf-user-location')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsLoggedIn(true)
      setBookings(savedBookings ? JSON.parse(savedBookings) : DEMO_BOOKINGS)
      setNotifications(savedNotifs ? JSON.parse(savedNotifs) : DEMO_NOTIFICATIONS)
    }
    if (savedLocation) {
      setUserLocationState(JSON.parse(savedLocation))
    }
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem('hf-user', JSON.stringify(userData))
    const existingBookings = localStorage.getItem('hf-bookings')
    const bookingsToSet = existingBookings ? JSON.parse(existingBookings) : DEMO_BOOKINGS
    setBookings(bookingsToSet)
    localStorage.setItem('hf-bookings', JSON.stringify(bookingsToSet))
    setNotifications(DEMO_NOTIFICATIONS)
    localStorage.setItem('hf-notifications', JSON.stringify(DEMO_NOTIFICATIONS))
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    setBookings([])
    setNotifications([])
    localStorage.removeItem('hf-user')
    localStorage.removeItem('hf-bookings')
    localStorage.removeItem('hf-notifications')
  }

  const addBooking = (booking: Booking) => {
    const updated = [booking, ...bookings]
    setBookings(updated)
    localStorage.setItem('hf-bookings', JSON.stringify(updated))
  }

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    const updated = bookings.map(b => b.id === id ? { ...b, ...updates } : b)
    setBookings(updated)
    localStorage.setItem('hf-bookings', JSON.stringify(updated))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const markNotificationRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n)
    setNotifications(updated)
    localStorage.setItem('hf-notifications', JSON.stringify(updated))
  }

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    localStorage.setItem('hf-notifications', JSON.stringify(updated))
  }

  const clearNotifications = () => {
    setNotifications([])
    localStorage.setItem('hf-notifications', JSON.stringify([]))
  }

  const addNotification = (n: Notification) => {
    const updated = [n, ...notifications]
    setNotifications(updated)
    localStorage.setItem('hf-notifications', JSON.stringify(updated))
  }

  const setUserLocation = (location: UserLocation) => {
    setUserLocationState(location)
    localStorage.setItem('hf-user-location', JSON.stringify(location))
  }

  const clearUserLocation = () => {
    setUserLocationState(null)
    localStorage.removeItem('hf-user-location')
  }

  return (
    <AppContext.Provider value={{
      user, isLoggedIn, bookings, notifications, unreadCount,
      selectedService, selectedProvider, cartData, userLocation,
      login, logout, addBooking, updateBooking,
      markNotificationRead, markAllRead, clearNotifications,
      setSelectedService, setSelectedProvider, setCartData, addNotification,
      setUserLocation, clearUserLocation
    }}>
      {children}
    </AppContext.Provider>
  )
}
