// hooks/use-auth.ts
import { useAuthStore } from '@/stores/auth-store'

export const useAuth = () => {
  const store = useAuthStore()

  return {
    // State
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    currentTab: store.currentTab,
    signinForm: store.signinForm,
    signupForm: store.signupForm,
    signinErrors: store.signinErrors,
    signupErrors: store.signupErrors,
    generalError: store.generalError,
    needsLocationPrompt: store.needsLocationPrompt,

    // Loading states
    isSigningIn: store.isSigningIn,
    isSigningUp: store.isSigningUp,
    isGoogleAuth: store.isGoogleAuth,
    isSigningOut: store.isSigningOut,

    // Actions
    signin: store.signin,
    signup: store.signup,
    googleAuth: store.googleAuth,
    signOut: store.signOut, // ADD this line
    updateUserData: store.updateUserData, // ADD this line
    setNeedsLocationPrompt: store.setNeedsLocationPrompt,
    setCurrentTab: store.setCurrentTab,
    updateSigninForm: store.updateSigninForm,
    updateSignupForm: store.updateSignupForm,
    clearErrors: store.clearErrors,
    clearForms: store.clearForms,
    validateSigninForm: store.validateSigninForm,
    validateSignupForm: store.validateSignupForm,
    validateSigninField: store.validateSigninField,
    validateSignupField: store.validateSignupField,
  }
}
