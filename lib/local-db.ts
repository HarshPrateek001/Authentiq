export interface LocalUser {
    id: string
    email: string
    fullName: string
    avatarUrl?: string
    token: string
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

        const max = type === 'plagiarism' ? 5 : type === 'humanizer' ? 5 : 1
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
