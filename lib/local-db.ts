export interface LocalUser {
    id: string
    email: string
    fullName: string
    avatarUrl?: string
    token: string
    first_name?: string
    last_name?: string
    bio?: string
    organization?: string
    avatar_url?: string
    subscription?: any
    created_at?: string
    user_type?: string
}

export const LocalDB = {
    USER_KEY: 'authentiq_user',
    LIMITS_KEY: 'authentiq_limits',

    saveUser: (user: LocalUser) => {
        localStorage.setItem(LocalDB.USER_KEY, JSON.stringify(user))
    },

    getUser: (): LocalUser | null => {
        if (typeof window === 'undefined') return null
        try {
            const data = localStorage.getItem(LocalDB.USER_KEY)
            return data ? JSON.parse(data) : null
        } catch {
            return null
        }
    },

    setUser: (user: LocalUser) => {
        LocalDB.saveUser(user)
    },

    getToken: (): string | null => {
        const user = LocalDB.getUser()
        return user ? user.token : null
    },

    getUserLimits: () => {
        const limits = LocalDB.getLimits()
        // Format to match API expectation or default to free limits
        return {
            plan: 'free',
            limits: { plagiarism: 500, humanizer: 500, bulk: 100 },
            usage: {
                plagiarism_words: limits.plagiarism || 0,
                humanize_words: limits.humanizer || 0,
                bulk_uploads: limits.bulk || 0
            }
        }
    },

    clearUser: () => {
        localStorage.removeItem(LocalDB.USER_KEY)
    },

    // Usage Limits Logic
    // Limits: Plagiarism (5/day), Humanizer (5/day), Bulk (1/day)
    checkLimit: (type: 'plagiarism' | 'humanizer' | 'bulk'): boolean => {
        if (typeof window === 'undefined') return false
        const today = new Date().toDateString()
        const limits = LocalDB.getLimits()

        // Reset if new day
        if (limits.date !== today) {
            limits.date = today
            limits.plagiarism = 0
            limits.humanizer = 0
            limits.bulk = 0
            LocalDB.saveLimits(limits)
        }

        const max = type === 'plagiarism' ? 500 : type === 'humanizer' ? 500 : 100
        return (limits[type] || 0) < max
    },

    incrementLimit: (type: 'plagiarism' | 'humanizer' | 'bulk') => {
        if (typeof window === 'undefined') return
        const limits = LocalDB.getLimits()
        limits[type] = (limits[type] || 0) + 1
        LocalDB.saveLimits(limits)
    },

    getLimits: () => {
        if (typeof window === 'undefined') return { date: new Date().toDateString(), plagiarism: 0, humanizer: 0, bulk: 0 }
        const data = localStorage.getItem(LocalDB.LIMITS_KEY)
        if (!data) return { date: new Date().toDateString(), plagiarism: 0, humanizer: 0, bulk: 0 }
        return JSON.parse(data)
    },

    saveLimits: (limits: any) => {
        localStorage.setItem(LocalDB.LIMITS_KEY, JSON.stringify(limits))
    },

    getStats: () => {
        // Safe fallback stats when API is not reachable
        const user = LocalDB.getUser()
        const limits = LocalDB.getLimits()
        const totalUsed = (limits.plagiarism || 0) + (limits.humanizer || 0)
        
        return {
            total_checks: totalUsed,
            avg_similarity: 0,
            high_risk_count: 0,
            remaining_quota: 500 - (limits.plagiarism || 0),
            usage_chart: [
                { name: "Mon", calls: 0 },
                { name: "Tue", calls: 0 },
                { name: "Wed", calls: 0 },
                { name: "Thu", calls: 0 },
                { name: "Fri", calls: 0 },
                { name: "Sat", calls: 0 },
                { name: "Sun", calls: totalUsed }
            ],
            recent_activity: [],
            user_name: user?.fullName || "User"
        }
    },

    logView: async (pageName: string) => {
        const user = LocalDB.getUser()
        if (!user?.token) return
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/log`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ action: 'page_view', details: { page: pageName, url: window.location.href } })
            })
        } catch { /* silent */ }
    }
}
