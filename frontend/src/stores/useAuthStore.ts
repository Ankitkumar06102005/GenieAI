export interface AuthUser {
  name: string;
  email: string;
  major: string;
  streakDays: number;
  isAuthenticated: boolean;
}

const STORAGE_KEY = 'contexta_user_session';

export const getStoredUser = (): AuthUser => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('Failed to parse stored user:', err);
  }
  // Default guest student session if not yet logged in
  return {
    name: 'Student Learner',
    email: 'learner@university.edu',
    major: 'Computer Science & AI',
    streakDays: 1,
    isAuthenticated: false,
  };
};

export const saveUser = (user: AuthUser) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn('Failed to save user:', err);
  }
};

export const clearUser = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear user:', err);
  }
};
