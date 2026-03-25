import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:5000/api'

type Screen = 'phone' | 'otp' | 'register'

export default function LoginPage() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState<Screen>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['','','','','',''])
  const [devOtp, setDevOtp] = useState('')
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [pincode, setPincode] = useState('')
  const [regStep, setRegStep] = useState(1)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (localStorage.getItem('hf-token')) navigate('/')
  }, [])

  useEffect(() => {
    if (screen !== 'otp') return
    setTimer(30)
    setCanResend(false)
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(interval); setCanResend(true); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [screen])

  const handleSendOTP = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      const data = await res.json()
      if (data.success) {
        if (data.devOtp) setDevOtp(data.devOtp)
        setScreen('otp')
      } else {
        setError(data.message || 'Failed to send OTP')
      }
    } catch {
      setError('Server not connected. Using demo mode.')
      const demoOtp = String(Math.floor(100000 + Math.random() * 900000))
      setDevOtp(demoOtp)
      localStorage.setItem(`demo-otp-${phone}`, demoOtp)
      setScreen('otp')
    }
    setLoading(false)
  }

  const handleVerifyOTP = async () => {
    const enteredOtp = otp.join('')
    if (enteredOtp.length !== 6) { setError('Enter all 6 digits'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: enteredOtp })
      })
      const data = await res.json()
      if (data.success) {
        if (data.isNewUser) {
          setScreen('register')
        } else {
          localStorage.setItem('hf-token', data.token)
          localStorage.setItem('hf-user', JSON.stringify(data.user))
          navigate('/')
        }
      } else {
        setError('Wrong OTP. Try again.')
        setOtp(['','','','','',''])
        otpRefs.current[0]?.focus()
      }
    } catch {
      const demo = localStorage.getItem(`demo-otp-${phone}`)
      if (enteredOtp === demo || enteredOtp === '123456') {
        setScreen('register')
      } else {
        setError('Wrong OTP. Use 123456 in demo mode.')
        setOtp(['','','','','',''])
      }
    }
    setLoading(false)
  }

  const handleRegister = async () => {
    if (name.trim().length < 2) { setError('Enter your full name'); return }
    if (address.trim().length < 5) { setError('Enter your complete address'); return }
    if (!/^\d{6}$/.test(pincode)) { setError('Enter valid 6-digit pincode'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, email, address, pincode })
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('hf-token', data.token)
        localStorage.setItem('hf-user', JSON.stringify(data.user))
        localStorage.setItem('hf-show-welcome', data.user.name)
        navigate('/')
      } else {
        setError(data.message)
      }
    } catch {
      const user = {
        id: 'U' + Date.now(), name, phone, email, address, pincode,
        city: pincode === '388150' ? 'Petlad' : 'Gujarat',
        avatar: name.slice(0,2).toUpperCase(),
        walletBalance: 50, subscriptionPlan: 'free',
        referralCode: 'HF' + name.replace(/\s/g,'').toUpperCase().slice(0,4) + '1234',
        totalBookings: 0, createdAt: new Date().toISOString()
      }
      localStorage.setItem('hf-token', 'demo-' + Date.now())
      localStorage.setItem('hf-user', JSON.stringify(user))
      localStorage.setItem('hf-show-welcome', user.name)
      navigate('/')
    }
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px',
    padding: '14px 16px', color: '#E4E6EB',
    fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
    outline: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '11px', fontWeight: 600,
    color: '#8892A0', marginBottom: '8px',
    textTransform: 'uppercase', letterSpacing: '0.5px',
    fontFamily: 'DM Sans, sans-serif',
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0F1419',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(230,192,74,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(76,175,130,0.05) 0%, transparent 50%)',
        pointerEvents: 'none',
      }}/>

      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px', padding: '40px',
        position: 'relative', zIndex: 1,
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}>
        
        {['top-left','top-right','bottom-left','bottom-right'].map((pos) => (
          <div key={pos} style={{
            position: 'absolute',
            top: pos.includes('top') ? '16px' : 'auto',
            bottom: pos.includes('bottom') ? '16px' : 'auto',
            left: pos.includes('left') ? '16px' : 'auto',
            right: pos.includes('right') ? '16px' : 'auto',
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#FFC107', opacity: 0.3,
          }}/>
        ))}

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <svg width="52" height="52" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <rect width="64" height="64" rx="14" fill="#FFC107"/>
              <path d="M8 52L8 30L32 14L56 30L56 52" fill="none" stroke="#0F1419" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="23" y="37" width="14" height="15" rx="3" fill="#0F1419"/>
              <path d="M47 22L54 15" stroke="#0F1419" strokeWidth="3.5" strokeLinecap="round"/>
              <circle cx="57" cy="12" r="4.5" fill="none" stroke="#0F1419" strokeWidth="3.5"/>
            </svg>
          </div>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: '22px', color: '#E4E6EB', letterSpacing: '-0.4px',
          }}>HandyFix</div>
        </div>

        {screen === 'phone' && (
          <div>
            <h2 className="title-2" style={{ marginBottom: '6px', textAlign: 'center' }}>Welcome back 👋</h2>
            <p className="caption-text" style={{ textAlign: 'center', marginBottom: '28px' }}>
              Enter your mobile number to continue
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Mobile Number</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{
                  background: '#0F1419', border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px', padding: '14px 16px',
                  color: '#E4E6EB', fontSize: '14px', fontWeight: 600,
                  flexShrink: 0,
                }}>+91</div>
                <input
                  type="tel" maxLength={10} value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g,''))
                    setError('')
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                  placeholder="98765 43210"
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#FFC107'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(224,90,78,0.1)', border: '1px solid rgba(224,90,78,0.3)',
                borderRadius: '8px', padding: '10px 14px', color: '#E05A4E',
                fontSize: '12px', marginBottom: '16px',
              }}>{error}</div>
            )}

            <button
              onClick={handleSendOTP}
              disabled={loading || phone.length !== 10}
              style={{
                width: '100%', height: '52px',
                background: phone.length === 10 ? '#FFC107' : 'rgba(255, 255, 255, 0.1)',
                color: phone.length === 10 ? '#0F1419' : '#8892A0',
                border: 'none', borderRadius: '12px',
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                fontSize: '15px', cursor: phone.length === 10 ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2"
                       style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Sending OTP...
                </>
              ) : 'Send OTP →'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <span style={{ fontSize: '13px', color: '#8892A0' }}>
                Are you a service provider?{' '}
              </span>
              <a href="/provider" style={{
                fontSize: '13px', color: '#FFC107',
                fontWeight: 600, textDecoration: 'none',
              }}>Join as Pro →</a>
            </div>
          </div>
        )}

        {screen === 'otp' && (
          <div>
            <button
              onClick={() => { setScreen('phone'); setOtp(['','','','','','']); setError('') }}
              style={{
                background: 'none', border: 'none', color: '#8892A0',
                cursor: 'pointer', fontSize: '20px', marginBottom: '16px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >← Back</button>

            <h2 className="title-2" style={{ marginBottom: '6px' }}>Verify your number</h2>
            <p className="caption-text" style={{ marginBottom: '8px' }}>
              6-digit code sent to{' '}
              <span style={{ color: '#FFC107', fontWeight: 600 }}>+91 {phone}</span>
            </p>
            
            {devOtp && (
              <div style={{
                background: 'rgba(230,192,74,0.08)', border: '1px solid rgba(230,192,74,0.2)',
                borderRadius: '8px', padding: '10px 14px', marginBottom: '20px',
                fontSize: '12px', color: '#FFC107',
              }}>
                Demo OTP: <strong style={{ fontSize: '16px' }}>{devOtp}</strong>
                {' '}(or use 123456)
              </div>
            )}

            <div style={{
              display: 'flex', gap: '10px',
              justifyContent: 'center', marginBottom: '24px',
            }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => otpRefs.current[i] = el}
                  type="tel" maxLength={1} value={digit}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g,'')
                    const newOtp = [...otp]
                    newOtp[i] = val.slice(-1)
                    setOtp(newOtp)
                    setError('')
                    if (val && i < 5) otpRefs.current[i+1]?.focus()
                    if (newOtp.every(d => d) && val) {
                      setTimeout(handleVerifyOTP, 200)
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !digit && i > 0) {
                      otpRefs.current[i-1]?.focus()
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault()
                    const paste = e.clipboardData.getData('text')
                      .replace(/\D/g,'').slice(0,6)
                    const newOtp = [...otp]
                    paste.split('').forEach((d, j) => {
                      if (j < 6) newOtp[j] = d
                    })
                    setOtp(newOtp)
                    if (paste.length === 6) setTimeout(handleVerifyOTP, 200)
                  }}
                  style={{
                    width: '48px', height: '58px',
                    background: '#0F1419',
                    border: `1.5px solid ${digit ? '#FFC107' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '12px',
                    fontFamily: 'Syne, sans-serif', fontWeight: 800,
                    fontSize: '24px', textAlign: 'center',
                    color: '#FFC107', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#FFC107'}
                  onBlur={(e) => e.currentTarget.style.borderColor = otp[i] ? '#FFC107' : 'rgba(255, 255, 255, 0.1)'}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {error && (
              <div style={{
                background: 'rgba(224,90,78,0.1)', border: '1px solid rgba(224,90,78,0.3)',
                borderRadius: '8px', padding: '10px 14px', color: '#E05A4E',
                fontSize: '12px', marginBottom: '16px', textAlign: 'center',
              }}>{error}</div>
            )}

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.join('').length !== 6}
              style={{
                width: '100%', height: '52px',
                background: otp.join('').length === 6 ? '#FFC107' : 'rgba(255, 255, 255, 0.1)',
                color: otp.join('').length === 6 ? '#0F1419' : '#8892A0',
                border: 'none', borderRadius: '12px',
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                fontSize: '15px', cursor: 'pointer', marginBottom: '16px',
              }}
            >
              {loading ? 'Verifying...' : 'Verify & Continue →'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '13px', color: '#8892A0' }}>
              {canResend ? (
                <button
                  onClick={handleSendOTP}
                  style={{ background: 'none', border: 'none', color: '#FFC107',
                           fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
                >Resend OTP</button>
              ) : (
                <span>Resend OTP in <strong style={{ color: '#E4E6EB' }}>{timer}s</strong></span>
              )}
            </div>
          </div>
        )}

        {screen === 'register' && (
          <div>
            <h2 className="title-2" style={{ marginBottom: '4px' }}>Create your account</h2>
            <p className="caption-text" style={{ marginBottom: '24px' }}>
              Just a few details to get you started
            </p>

            <div style={{
              display: 'flex', alignItems: 'center',
              gap: '8px', marginBottom: '24px',
            }}>
              {[1,2].map(step => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: regStep >= step ? '#FFC107' : 'rgba(255, 255, 255, 0.1)',
                    color: regStep >= step ? '#0F1419' : '#8892A0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '12px',
                    flexShrink: 0,
                  }}>
                    {regStep > step ? '✓' : step}
                  </div>
                  {step < 2 && (
                    <div style={{
                      flex: 1, height: '2px',
                      background: regStep > step ? '#FFC107' : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '1px',
                    }}/>
                  )}
                </div>
              ))}
            </div>

            {regStep === 1 && (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    type="text" value={name}
                    onChange={(e) => { setName(e.target.value); setError('') }}
                    placeholder="e.g. Rahul Sharma"
                    style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#FFC107'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                    autoFocus
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="tel" value={'+91 ' + phone}
                    disabled
                    style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }}
                  />
                  <div style={{
                    marginTop: '6px', fontSize: '11px', color: '#4CAF82',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    ✓ Verified
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Email (Optional)</label>
                  <input
                    type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#FFC107'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  />
                </div>
                {error && (
                  <div style={{
                    background: 'rgba(224,90,78,0.1)',
                    border: '1px solid rgba(224,90,78,0.3)',
                    borderRadius: '8px', padding: '10px 14px',
                    color: '#E05A4E', fontSize: '12px', marginBottom: '16px',
                  }}>{error}</div>
                )}
                <button
                  onClick={() => {
                    if (name.trim().length < 2) { setError('Enter your full name'); return }
                    setError(''); setRegStep(2)
                  }}
                  style={{
                    width: '100%', height: '52px',
                    background: 'linear-gradient(135deg, #FFC107 0%, #FFB300 100%)',
                    color: '#0F1419', border: 'none', borderRadius: '12px',
                    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px',
                    cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 8px 24px rgba(255, 193, 7, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 193, 7, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 193, 7, 0.3)';
                  }}
                >Next →</button>
              </div>
            )}

            {regStep === 2 && (
              <div>
                <button
                  onClick={() => setRegStep(1)}
                  style={{
                    background: 'none', border: 'none', color: '#8892A0',
                    cursor: 'pointer', fontSize: '18px', marginBottom: '16px',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >← Back</button>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Full Address *</label>
                  <textarea
                    value={address}
                    onChange={(e) => { setAddress(e.target.value); setError('') }}
                    placeholder="House no., Street, Area, City"
                    rows={3}
                    style={{
                      ...inputStyle, resize: 'none',
                      height: 'auto', paddingTop: '14px',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#FFC107'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Pincode *</label>
                  <input
                    type="tel" maxLength={6} value={pincode}
                    onChange={(e) => { setPincode(e.target.value.replace(/\D/g,'')); setError('') }}
                    placeholder="388150"
                    style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#FFC107'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  />
                  {pincode.length === 6 && (
                    <div style={{
                      marginTop: '6px', fontSize: '11px',
                      color: '#4CAF82', display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      📍 {pincode === '388150' ? 'Petlad, Gujarat' : 'Area detected'}
                    </div>
                  )}
                </div>
                {error && (
                  <div style={{
                    background: 'rgba(224,90,78,0.1)',
                    border: '1px solid rgba(224,90,78,0.3)',
                    borderRadius: '8px', padding: '10px 14px',
                    color: '#E05A4E', fontSize: '12px', marginBottom: '16px',
                  }}>{error}</div>
                )}
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  style={{
                    width: '100%', height: '52px', background: '#FFC107',
                    color: '#0F1419', border: 'none', borderRadius: '12px',
                    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px',
                    cursor: 'pointer', opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Creating Account...' : 'Create Account 🎉'}
                </button>
                <p style={{
                  textAlign: 'center', fontSize: '11px',
                  color: '#8892A0', marginTop: '12px',
                }}>
                  By creating an account you agree to our Terms of Service
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
