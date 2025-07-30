import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.com/api' 
    : 'http://localhost:5000/api';

// Supabase configuration
const SUPABASE_URL = 'https://znznwbgkunolapkepmjx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuem53YmdrdW5vbGFwa2VwbWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4Mjg2NTMsImV4cCI6MjA2OTQwNDY1M30.pXKZEctrhVd74oVY-wQQCGoAC1-xNjqBCjTxNxSOMvQ';

class API {
    static async request(endpoint, options = {}) {
        const token = Cookies.get('token');
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };

        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication
    static async requestOTP(email) {
        return this.request('/auth/request-otp', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    static async verifyOTP(email, otp, name = null, goal = null) {
        const body = { email, otp };
        if (name) body.name = name;
        if (goal) body.goal = goal;

        return this.request('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    static async getCurrentUser() {
        return this.request('/auth/me');
    }

    static async logout() {
        return this.request('/auth/logout', {
            method: 'POST',
        });
    }

    // Profiles
    static async getProfiles() {
        return this.request('/profiles');
    }

    static async createProfile(profileData) {
        return this.request('/profiles', {
            method: 'POST',
            body: JSON.stringify(profileData),
        });
    }

    static async updateProfile(profileId, profileData) {
        return this.request(`/profiles/${profileId}`, {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    static async deleteProfile(profileId) {
        return this.request(`/profiles/${profileId}`, {
            method: 'DELETE',
        });
    }

    // Workouts
    static async getWorkoutPlans() {
        return this.request('/workouts/plans');
    }

    static async getWorkoutHistory() {
        return this.request('/workouts/history');
    }

    static async completeWorkout(workoutData) {
        return this.request('/workouts/complete', {
            method: 'POST',
            body: JSON.stringify(workoutData),
        });
    }

    static async getWorkoutForDate(date) {
        return this.request(`/workouts/date/${date}`);
    }

    // Calendar
    static async getMonthlyCalendar(year, month) {
        return this.request(`/calendar/month/${year}/${month}`);
    }

    static async getWeeklyCalories(year, month, week) {
        return this.request(`/calendar/weekly-calories/${year}/${month}/${week}`);
    }

    // Health checks
    static async healthCheck() {
        return this.request('/health');
    }

    static async emailHealthCheck() {
        return this.request('/email/health');
    }

    // File upload
    static async uploadFile(file, onProgress = null) {
        const token = Cookies.get('token');
        const formData = new FormData();
        formData.append('file', file);

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            if (onProgress) {
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const progress = (event.loaded / event.total) * 100;
                        onProgress(progress);
                    }
                });
            }

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (error) {
                        reject(new Error('Invalid response format'));
                    }
                } else {
                    reject(new Error(`Upload failed: ${xhr.status}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed'));
            });

            xhr.open('POST', `${API_BASE_URL}/upload`);
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }
            xhr.send(formData);
        });
    }

    // Utility methods
    static setToken(token) {
        Cookies.set('token', token, { expires: 30 });
    }

    static removeToken() {
        Cookies.remove('token');
    }

    static getToken() {
        return Cookies.get('token');
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    // Supabase direct methods (for client-side operations)
    static async supabaseRequest(table, operation, data = null) {
        const token = this.getToken();
        
        const headers = {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const url = `${SUPABASE_URL}/rest/v1/${table}`;
        
        const config = {
            method: operation === 'GET' ? 'GET' : 
                     operation === 'POST' ? 'POST' :
                     operation === 'PUT' ? 'PUT' :
                     operation === 'DELETE' ? 'DELETE' : 'GET',
            headers,
        };

        if (data && operation !== 'GET') {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, config);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Supabase request failed');
            }

            return result;
        } catch (error) {
            console.error('Supabase Error:', error);
            throw error;
        }
    }
}

export { API };
