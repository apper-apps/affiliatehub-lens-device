const ADMIN_CREDENTIALS = {
  username: "User",
  password: "User354@"
}
const AUTH_TOKEN_KEY = "admin_auth_token"
const AUTH_SESSION_KEY = "admin_session"

class AuthenticationService {
  constructor() {
    this.isAuthenticatedState = this.checkStoredAuth()
  }

  async login(username, password) {
    try {
      // Simulate API delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Validate credentials
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Generate session token (simple implementation)
        const token = this.generateSessionToken()
        const sessionData = {
          token,
          username,
          loginTime: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        }
        
        // Store authentication data
        localStorage.setItem(AUTH_TOKEN_KEY, token)
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionData))
        
        this.isAuthenticatedState = true
        return true
      }
      
      return false
    } catch (error) {
      console.error("Authentication error:", error)
      return false
    }
  }

  logout() {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_SESSION_KEY)
      this.isAuthenticatedState = false
      return true
    } catch (error) {
      console.error("Logout error:", error)
      return false
    }
  }

  isAuthenticated() {
    if (!this.isAuthenticatedState) {
      return false
    }

    try {
      const sessionData = localStorage.getItem(AUTH_SESSION_KEY)
      if (!sessionData) {
        this.isAuthenticatedState = false
        return false
      }

      const session = JSON.parse(sessionData)
      const expiresAt = new Date(session.expiresAt)
      const now = new Date()

      if (now > expiresAt) {
        // Session expired
        this.logout()
        return false
      }

      return true
    } catch (error) {
      console.error("Auth check error:", error)
      this.logout()
      return false
    }
  }

  getSessionData() {
    try {
      const sessionData = localStorage.getItem(AUTH_SESSION_KEY)
      return sessionData ? JSON.parse(sessionData) : null
    } catch (error) {
      console.error("Session data error:", error)
      return null
    }
  }

  checkStoredAuth() {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY)
      const sessionData = localStorage.getItem(AUTH_SESSION_KEY)
      
      if (!token || !sessionData) {
        return false
      }

      const session = JSON.parse(sessionData)
      const expiresAt = new Date(session.expiresAt)
      const now = new Date()

      return now <= expiresAt
    } catch (error) {
      console.error("Stored auth check error:", error)
      return false
    }
  }

  generateSessionToken() {
    // Simple token generation for demo purposes
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2)
    return `admin_${timestamp}_${random}`
  }

  // Method to extend session if needed
  extendSession() {
    try {
      const sessionData = this.getSessionData()
      if (sessionData) {
        sessionData.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionData))
        return true
      }
      return false
    } catch (error) {
      console.error("Session extend error:", error)
      return false
    }
  }
}

// Export singleton instance
export const AuthService = new AuthenticationService()