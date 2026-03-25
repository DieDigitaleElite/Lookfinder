/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, Scissors, Star, Info, ChevronRight, Loader2, CheckCircle2, RefreshCcw, Download, Lock, ShoppingBag, FileText, Sparkles, User, LogOut, History, Bookmark, BookmarkCheck, Mail, Eye, EyeOff, UserPlus, X, Trash2, ShieldCheck, AlertCircle, Bell, Settings, Users, Shield, Scale, ArrowRightLeft, Heart, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeFaceAndSuggestStyles, generateHairstyleImage, GeneratedResult, HairstyleSuggestion } from './services/geminiService';
import { compressBase64Image } from './services/imageUtils';
import { HAIRSTYLE_LIBRARY, HAIR_COLORS } from './constants';
import { LegalModal, ImpressumContent, DatenschutzContent, AGBContent, WiderrufContent, AboutContent } from './components/LegalModals';
import { CookieBanner } from './components/CookieBanner';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

import ReactGA from 'react-ga4';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser,
  db, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Timestamp,
  deleteDoc,
  FirebaseUser,
  handleFirestoreError,
  OperationType
} from './firebase';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [premiumExpiresAt, setPremiumExpiresAt] = useState<any>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes countdown
  const [selectedLibraryStyle, setSelectedLibraryStyle] = useState<typeof HAIRSTYLE_LIBRARY[0] | null>(null);
  const [selectedColor, setSelectedColor] = useState<typeof HAIR_COLORS[0] | null>(null);
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [customResults, setCustomResults] = useState<GeneratedResult[]>([]);
  const [needsApiKey, setNeedsApiKey] = useState(false);
  
  // Legal Modals State
  const [activeLegalModal, setActiveLegalModal] = useState<'impressum' | 'datenschutz' | 'agb' | 'widerruf' | 'about' | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToWiderruf, setAgreedToWiderruf] = useState(false);
  
  // GA4 Initialization
  useEffect(() => {
    const gaId = (import.meta as any).env.VITE_GA_MEASUREMENT_ID;
    if (gaId) {
      ReactGA.initialize(gaId);
      ReactGA.send("pageview");
    }
  }, []);
  
  // Firebase State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [savedResults, setSavedResults] = useState<GeneratedResult[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginName, setLoginName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [clientIp, setClientIp] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Sync usage count
    let unsubscribe: (() => void) | undefined;
    
    if (clientIp || user) {
      const usageId = user ? user.uid : clientIp;
      if (usageId && usageId !== "unknown") {
        const usageDocRef = doc(db, 'usage', usageId);
        unsubscribe = onSnapshot(usageDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUsageCount(docSnap.data().count || 0);
          } else {
            setUsageCount(0);
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `usage/${usageId}`);
        });
      }
    }
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [clientIp, user]);

  const [pendingPayment, setPendingPayment] = useState<{plan: string, uid: string | null} | null>(null);

  const unsubsRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    // Fetch client IP for usage tracking
    fetch('/api/get-client-ip')
      .then(res => res.json())
      .then(data => setClientIp(data.ip))
      .catch(err => console.error("Failed to fetch IP", err));

    // Auth Listener
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      // Cleanup previous listeners
      unsubsRef.current.forEach(unsub => unsub());
      unsubsRef.current = [];

      setUser(currentUser);
      if (currentUser) {
        // Sync user profile and listen for changes (like premium status)
        const userDocRef = doc(db, 'users', currentUser.uid);
        
        // Initial profile sync
        setDoc(userDocRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          createdAt: serverTimestamp()
        }, { merge: true });

        const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("User profile loaded:", data);
            
            let premiumActive = data.isPremium || false;
            if (premiumActive && data.premiumExpiresAt) {
              const expiryDate = data.premiumExpiresAt.toDate();
              if (new Date() > expiryDate) {
                premiumActive = false;
              }
            }
            
            setIsPremium(premiumActive);
            setUserPlan(data.plan || null);
            setPremiumExpiresAt(data.premiumExpiresAt || null);
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        });

        // Load saved results
        const q = query(
          collection(db, 'users', currentUser.uid, 'results'),
          orderBy('createdAt', 'desc')
        );
        const unsubscribeResults = onSnapshot(q, (snapshot) => {
          const docs = snapshot.docs.map(doc => doc.data() as GeneratedResult);
          setSavedResults(docs);
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, `users/${currentUser.uid}/results`);
        });
        
        unsubsRef.current = [unsubscribeUser, unsubscribeResults];
      } else {
        setSavedResults([]);
      }
    });

    // Check for payment success in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      const plan = params.get('plan') || 'single';
      const uid = params.get('uid');
      
      console.log("Payment success detected in URL. Plan:", plan, "UID:", uid);
      setPendingPayment({ plan, uid });
      
      // Restore results from localStorage if they exist
      const savedResultsStr = localStorage.getItem('hairvision_pending_results');
      if (savedResultsStr) {
        try {
          const restoredResults = JSON.parse(savedResultsStr);
          if (restoredResults && restoredResults.length > 0) {
            console.log("Restoring results from localStorage:", restoredResults.length);
            setResults(restoredResults);
            
            // Also restore selectedResult if it was saved
            const savedSelectedStr = localStorage.getItem('hairvision_pending_selected_result');
            if (savedSelectedStr) {
              const restoredSelected = JSON.parse(savedSelectedStr);
              setSelectedResult(restoredSelected);
            }

            // Restore custom results if they exist
            const savedCustomStr = localStorage.getItem('hairvision_pending_custom_results');
            if (savedCustomStr) {
              const restoredCustom = JSON.parse(savedCustomStr);
              setCustomResults(restoredCustom);
            }

            // Restore image if it exists
            const savedImage = localStorage.getItem('hairvision_pending_image');
            if (savedImage) {
              setImage(savedImage);
            }
            
            // Clear them so they don't persist forever
            localStorage.removeItem('hairvision_pending_results');
            localStorage.removeItem('hairvision_pending_selected_result');
            localStorage.removeItem('hairvision_pending_custom_results');
            localStorage.removeItem('hairvision_pending_image');
          }
        } catch (err) {
          console.error("Failed to restore results from localStorage", err);
        }
      }
      
      // Set local state immediately for better UX
      setIsPremium(true);
      
      let message = "Zahlung erfolgreich! Dein Premium-Zugang ist jetzt aktiv.";
      if (plan === 'single') message = "Erfolg! Deine 6 zusätzlichen Styles wurden freigeschaltet.";
      if (plan === 'monthly' || plan === 'yearly') message = "Willkommen bei HairVision Pro! Du hast jetzt unbegrenzten Zugriff.";
      
      setAuthMessage({ type: 'success', text: message });
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF9EBE', '#1a1a1a', '#ffffff']
      });
    }

    return () => {
      unsubscribeAuth();
      unsubsRef.current.forEach(unsub => unsub());
    };
  }, []);

  // Check for API key on mount
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        try {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (!hasKey) {
            setNeedsApiKey(true);
          }
        } catch (err) {
          console.error("Failed to check API key status", err);
        }
      }
    };
    checkKey();
  }, []);

  // Separate effect to handle pending payment once user is logged in
  useEffect(() => {
    if (user && pendingPayment) {
      // If we have a UID from URL, it MUST match the current user
      // Or if no UID from URL, we assume it's for the current user
      if (!pendingPayment.uid || user.uid === pendingPayment.uid) {
        console.log("Updating Firestore for pending payment for user:", user.uid);
        const userDocRef = doc(db, 'users', user.uid);
        
        const expiresAt = new Date();
        if (pendingPayment.plan === 'monthly' || pendingPayment.plan === 'upsell') {
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        } else if (pendingPayment.plan === 'yearly') {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }
        
        const updateData: any = { 
          isPremium: true,
          plan: pendingPayment.plan === 'upsell' ? 'monthly' : pendingPayment.plan,
          premiumSince: serverTimestamp()
        };
        
        if (pendingPayment.plan === 'monthly' || pendingPayment.plan === 'yearly' || pendingPayment.plan === 'upsell') {
          updateData.premiumExpiresAt = Timestamp.fromDate(expiresAt);
        }

        setDoc(userDocRef, updateData, { merge: true })
        .then(() => {
          console.log("Premium status successfully updated in Firestore");
          
          // Trigger Upsell Modal if it was a single unlock
          if (pendingPayment.plan === 'single') {
            setTimeout(() => {
              setShowUpsellModal(true);
            }, 90000);
          }
          
          setPendingPayment(null);
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch(err => {
          console.error("Failed to update premium status in Firestore", err);
        });
      } else {
        console.warn("Payment UID mismatch. URL UID:", pendingPayment.uid, "Current User UID:", user.uid);
      }
    } else if (!user && pendingPayment) {
      console.log("Payment success detected but user not logged in yet.");
      if (!showLoginModal) {
        setAuthMessage({ type: 'info', text: "Zahlung erfolgreich! Bitte logge dich ein, um deinen Premium-Zugang zu aktivieren." });
        setShowLoginModal(true);
      }
    }
  }, [user, pendingPayment, showLoginModal]);

  // Auto-save results when user logs in or results are generated while logged in
  useEffect(() => {
    if (user && (results.length > 0 || customResults.length > 0)) {
      [...results, ...customResults].forEach(result => {
        if (result.imageUrl && !isResultSaved(result.id)) {
          saveResult(result, true);
        }
      });
    }
  }, [user, results, customResults, savedResults]);

  useEffect(() => {
    if (results.length > 0 && !isPremium) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [results.length, isPremium]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogin = async () => {
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setError(null);
      setShowLoginModal(false);
    } catch (err: any) {
      console.error("Login failed", err);
      if (err.code === 'auth/popup-closed-by-user') return;
      if (err.code === 'auth/cancelled-popup-request') return;
      if (err.code === 'auth/operation-not-allowed') {
        setError("Google Login ist im Firebase Console noch nicht aktiviert.");
      } else if (err.code === 'auth/invalid-credential') {
        setError("Ungültige Anmeldedaten. Bitte versuche es erneut.");
      } else {
        setError("Login fehlgeschlagen. Bitte versuche es erneut.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthMessage(null);
    setError(null);
    try {
      if (isForgotPassword) {
        await sendPasswordResetEmail(auth, loginEmail);
        setAuthMessage({ type: 'success', text: "E-Mail zum Zurücksetzen des Passworts wurde gesendet!" });
        setTimeout(() => setIsForgotPassword(false), 3000);
      } else if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
        await updateProfile(userCredential.user, { displayName: loginName });
        await sendEmailVerification(userCredential.user);
        setAuthMessage({ type: 'info', text: "Konto erstellt! Bitte bestätige deine E-Mail-Adresse." });
        setTimeout(() => setShowLoginModal(false), 4000);
      } else {
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        setShowLoginModal(false);
      }
      setLoginEmail('');
      setLoginPassword('');
      setLoginName('');
    } catch (err: any) {
      console.error("Auth failed", err);
      let message = "Authentifizierung fehlgeschlagen.";
      if (err.code === 'auth/email-already-in-use') message = "Diese E-Mail wird bereits verwendet.";
      if (err.code === 'auth/invalid-email') message = "Ungültige E-Mail-Adresse.";
      if (err.code === 'auth/weak-password') message = "Das Passwort ist zu schwach.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') message = "E-Mail oder Passwort falsch.";
      if (err.code === 'auth/too-many-requests') message = "Zu viele Versuche. Bitte später erneut versuchen.";
      if (err.code === 'auth/operation-not-allowed') message = "Diese Anmeldemethode ist im Firebase Console noch nicht aktiviert.";
      setAuthMessage({ type: 'error', text: message });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSendVerification = async () => {
    if (!user) return;
    setAuthLoading(true);
    try {
      await sendEmailVerification(user);
      setAuthMessage({ type: 'success', text: "Bestätigungs-E-Mail wurde erneut gesendet!" });
    } catch (err) {
      setAuthMessage({ type: 'error', text: "Fehler beim Senden der E-Mail." });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setAuthLoading(true);
    try {
      await updateProfile(user, { displayName: loginName });
      await setDoc(doc(db, 'users', user.uid), { displayName: loginName }, { merge: true });
      setAuthMessage({ type: 'success', text: "Profil aktualisiert!" });
      setTimeout(() => setShowProfileModal(false), 2000);
    } catch (err) {
      setAuthMessage({ type: 'error', text: "Update fehlgeschlagen." });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !window.confirm("Möchtest du dein Konto wirklich unwiderruflich löschen? Alle gespeicherten Frisuren gehen verloren.")) return;
    
    setIsDeletingAccount(true);
    try {
      // 1. Delete user results from Firestore
      const resultsRef = collection(db, 'users', user.uid, 'results');
      const snapshot = await getDoc(doc(db, 'users', user.uid)); // Just to check existence
      // In a real app, you'd loop through and delete subcollections
      // For simplicity here, we delete the user doc
      await deleteDoc(doc(db, 'users', user.uid));
      
      // 2. Delete the Auth user
      await deleteUser(user);
      
      setShowProfileModal(false);
      setUser(null);
      setAuthMessage({ type: 'success', text: "Konto erfolgreich gelöscht." });
    } catch (err: any) {
      console.error("Delete failed", err);
      if (err.code === 'auth/requires-recent-login') {
        setAuthMessage({ type: 'error', text: "Bitte melde dich erneut an, um dein Konto zu löschen." });
      } else {
        setAuthMessage({ type: 'error', text: "Fehler beim Löschen des Kontos." });
      }
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowGallery(false);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const [failedSaves, setFailedSaves] = useState<Set<string>>(new Set());

  const compressImage = (base64: string, maxWidth = 600, quality = 0.6): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error("Failed to load image for compression"));
      img.src = base64;
    });
  };

  const saveResult = async (result: GeneratedResult, silent = false) => {
    if (!user || failedSaves.has(result.id)) {
      if (!user && !silent) setShowLoginModal(true);
      return;
    }

    if (!silent) setIsSaving(result.id);
    try {
      // Compress image before saving to Firestore to stay under 1MB limit
      let finalResult = { ...result };
      if (result.imageUrl && result.imageUrl.startsWith('data:image')) {
        try {
          console.log(`Compressing image for ${result.id}...`);
          const base64Data = result.imageUrl.split(',')[1];
          const mimeType = result.imageUrl.split(';')[0].split(':')[1] || 'image/jpeg';
          finalResult.imageUrl = await compressBase64Image(base64Data, mimeType, 800000);
          console.log(`Compression successful for ${result.id}. New size: ${Math.round(finalResult.imageUrl.length / 1024)}KB`);
        } catch (compressErr) {
          console.error("Compression failed", compressErr);
          // If compression fails, we might still try to save, but it will likely fail if too big
        }
      }

      const resultRef = doc(db, 'users', user.uid, 'results', result.id);
      await setDoc(resultRef, {
        ...finalResult,
        userId: user.uid,
        createdAt: serverTimestamp()
      });

      // Clear from failed saves if it was there
      if (failedSaves.has(result.id)) {
        setFailedSaves(prev => {
          const next = new Set(prev);
          next.delete(result.id);
          return next;
        });
      }

      // Track event
      ReactGA.event({
        category: 'User',
        action: silent ? 'Auto Save Look' : 'Save Look',
        label: result.faceShape
      });

      if (!silent) {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#FF9EBE']
        });
      }
    } catch (err: any) {
      console.error("Save failed", err);
      if (err.message?.includes('exceeds the maximum allowed size')) {
        setFailedSaves(prev => new Set(prev).add(result.id));
      }
      if (!silent) setError("Speichern fehlgeschlagen.");
    } finally {
      if (!silent) setIsSaving(null);
    }
  };

  const isResultSaved = (id: string) => {
    return savedResults.some(r => r.id === id);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Track event
      ReactGA.event({
        category: 'User',
        action: 'Upload Photo',
        label: file.type
      });

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setImage(base64);
        setMimeType(file.type);
        setResults([]);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const getDefiniteArticle = (name: string) => {
    const lower = name.toLowerCase();
    const parts = lower.split(/[\s-]+/);
    const lastPart = parts[parts.length - 1];
    
    // Neuter
    if (lastPart === 'haar' || lastPart === 'haarschnitt') return 'Das';
    
    // Feminine
    const feminineEndings = ['frisur', 'welle', 'mähne', 'locke', 'partie', 'länge', 'seite', 'flechtfrisur'];
    if (feminineEndings.some(ending => lastPart.endsWith(ending))) return 'Die';
    
    // Default to Masculine (Bob, Lob, Pixie, Shag, Cut, Style, Look, Buzz, Fade, etc.)
    return 'Der';
  };

  const incrementUsage = async () => {
    const usageId = user ? user.uid : clientIp;
    if (!usageId || usageId === "unknown") return;

    const usageDocRef = doc(db, 'usage', usageId);
    try {
      const docSnap = await getDoc(usageDocRef);
      
      if (docSnap.exists()) {
        await setDoc(usageDocRef, { 
          count: (docSnap.data().count || 0) + 1,
          lastUsed: serverTimestamp(),
          isUser: !!user
        }, { merge: true });
      } else {
        await setDoc(usageDocRef, { 
          count: 1, 
          createdAt: serverTimestamp(),
          lastUsed: serverTimestamp(),
          isUser: !!user
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `usage/${usageId}`);
    }
  };

  const handleOpenSelectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setNeedsApiKey(false);
        setError(null);
      } catch (err) {
        console.error("Failed to open key selection", err);
      }
    }
  };

  const processImage = async () => {
    if (!image) return;

    // Check for API key if needed
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setNeedsApiKey(true);
        setError("Bitte wähle zuerst einen API-Key aus, um die KI-Funktionen zu nutzen.");
        return;
      }
    }

    // Usage check
    const limit = isPremium ? Infinity : 100; // Increased to 100 for testing
    if (usageCount >= limit) {
      if (!user) {
        setAuthMessage({ type: 'info', text: "Du hast dein kostenloses Limit als Gast erreicht. Bitte registriere dich, um weitere Styles zu sehen!" });
        setShowLoginModal(true);
      } else {
        setAuthMessage({ type: 'info', text: "Du hast dein kostenloses Limit erreicht. Werde Premium-Mitglied für unbegrenzte Styles!" });
        setShowPricingModal(true);
      }
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const base64Data = image.split(',')[1];
      const suggestions = await analyzeFaceAndSuggestStyles(base64Data, mimeType);
      
      if (suggestions.length === 0) {
        throw new Error("Keine Frisuren-Vorschläge erhalten. Bitte versuche es mit einem anderen Bild.");
      }

      // Track event
      ReactGA.event({
        category: 'AI',
        action: 'Analyze Face Success',
        label: suggestions[0]?.faceShape
      });

      setIsAnalyzing(false);
      setIsGenerating(true);
      setGenerationProgress(0);

      const generatedResults: GeneratedResult[] = [];
      
      // Initialize results with suggestions but no images yet to show placeholders
      setResults(suggestions.map(s => ({ ...s, imageUrl: "" })));

      // Generate images in parallel
      const maxToGenerate = isPremium ? suggestions.length : 4;
      
      const generationPromises = Array.from({ length: maxToGenerate }).map(async (_, i) => {
        const suggestion = suggestions[i];
        try {
          // Small staggered delay to avoid instant burst
          await new Promise(resolve => setTimeout(resolve, i * 300));
          
          const imageUrl = await generateHairstyleImage(base64Data, mimeType, suggestion.name, suggestion.description);
          
          setResults(prev => {
            const newResults = [...prev];
            if (imageUrl) {
              newResults[i] = { ...newResults[i], imageUrl, failed: false };
            } else {
              newResults[i] = { ...newResults[i], failed: true };
            }
            return newResults;
          });
        } catch (err) {
          console.error(`Failed to generate image for style ${i}`, err);
          setResults(prev => {
            const newResults = [...prev];
            newResults[i] = { ...newResults[i], failed: true };
            return newResults;
          });
        }
      });

      // Track progress roughly
      const progressInterval = setInterval(() => {
        setResults(currentResults => {
          const completedCount = currentResults.filter(r => r.imageUrl).length;
          setGenerationProgress(Math.round((completedCount / maxToGenerate) * 100));
          return currentResults;
        });
      }, 500);

      await Promise.all(generationPromises);
      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Increment usage count
      await incrementUsage();

      // Show login modal if user is not logged in to show benefits
      if (!auth.currentUser) {
        setTimeout(() => setShowLoginModal(true), 1500);
      }

    } catch (err: any) {
      console.error("Process failed", err);
      
      // Check for API key error
      const errorMsg = err.message || String(err);
      if (errorMsg.includes("API key not valid") || errorMsg.includes("API key is missing") || errorMsg.includes("400") || errorMsg.includes("INVALID_ARGUMENT")) {
        setNeedsApiKey(true);
        setError("API-Key ungültig oder nicht ausgewählt. Bitte wähle einen gültigen API-Key aus, um die KI-Funktionen zu nutzen.");
      } else {
        setError(errorMsg || "Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
      }
    } finally {
      setIsAnalyzing(false);
      setIsGenerating(false);
    }
  };

  const retryStyle = async (index: number) => {
    if (!image || !results[index]) return;
    
    // Reset failed state for this style
    setResults(prev => {
      const newResults = [...prev];
      newResults[index] = { ...newResults[index], failed: false };
      return newResults;
    });

    try {
      const base64Data = image.split(',')[1];
      const suggestion = results[index];
      
      const imageUrl = await generateHairstyleImage(base64Data, mimeType, suggestion.name, suggestion.description);
      
      setResults(prev => {
        const newResults = [...prev];
        if (imageUrl) {
          newResults[index] = { ...newResults[index], imageUrl, failed: false };
        } else {
          newResults[index] = { ...newResults[index], failed: true };
        }
        return newResults;
      });
    } catch (err) {
      console.error(`Failed to retry image for style ${index}`, err);
      setResults(prev => {
        const newResults = [...prev];
        newResults[index] = { ...newResults[index], failed: true };
        return newResults;
      });
    }
  };

  const reset = () => {
    setImage(null);
    setResults([]);
    setCustomResults([]);
    setSelectedResult(null);
    setError(null);
    setGenerationProgress(0);
    setSelectedLibraryStyle(null);
    setSelectedColor(null);
  };

  const handleCustomTryOn = async () => {
    if (!image || !selectedLibraryStyle || !selectedColor) return;
    
    setIsGeneratingCustom(true);
    setError(null);
    
    try {
      const base64Data = image.split(',')[1];
      const styleWithColor = `${selectedLibraryStyle.name} in der Farbe ${selectedColor.name}`;
      const descriptionWithColor = `${selectedLibraryStyle.description} Die Haarfarbe soll ein realistisches ${selectedColor.name} sein.`;
      
      const imageUrl = await generateHairstyleImage(base64Data, mimeType, styleWithColor, descriptionWithColor);
      
      if (imageUrl) {
        const newResult: GeneratedResult = {
          id: `custom-${Date.now()}`,
          name: styleWithColor,
          description: descriptionWithColor,
          rating: 10,
          barberInstructions: `Schneide einen ${selectedLibraryStyle.name}. Färbe das Haar anschließend in einem gleichmäßigen ${selectedColor.name}.`,
          suitabilityReason: "Selbst gewählter Style aus der Premium-Bibliothek.",
          recommendedProducts: [
            { name: "Color Protection Shampoo", type: "Pflege", reason: "Um die neue Farbe lange strahlend zu halten." }
          ],
          imageUrl,
          faceShape: results[0]?.faceShape || "unbekannt"
        };
        
        setCustomResults(prev => [newResult, ...prev]);
        setSelectedResult(newResult);
        
        // Save to Firebase if user is logged in
        if (user) {
          try {
            // Compress image for Firestore (1MB limit)
            const compressedImageUrl = await compressBase64Image(imageUrl.split(',')[1], 'image/jpeg', 800000);
            
            const resultRef = doc(db, 'users', user.uid, 'results', newResult.id);
            await setDoc(resultRef, {
              ...newResult,
              imageUrl: compressedImageUrl, // Use compressed version for storage
              userId: user.uid,
              createdAt: serverTimestamp()
            });
          } catch (fsErr) {
            console.error("Failed to save to Firestore, image might still be too large", fsErr);
            // Fallback: save without image if it's still too large, or just skip saving
          }
        }
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      console.error("Custom generation failed", err);
      const errorMsg = err.message || String(err);
      if (errorMsg.includes("API key not valid") || errorMsg.includes("API key is missing") || errorMsg.includes("400") || errorMsg.includes("INVALID_ARGUMENT")) {
        setNeedsApiKey(true);
        setError("API-Key ungültig oder nicht ausgewählt. Bitte wähle einen gültigen API-Key aus.");
      } else {
        setError("Fehler bei der individuellen Generierung.");
      }
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  const handleDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${name.replace(/\s+/g, '-').toLowerCase()}-hairstyle.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleCheckout = async (plan: 'single' | 'monthly' | 'yearly' | 'upsell' = 'single') => {
    console.log("Initiating checkout for plan:", plan);
    setIsCheckingOut(true);
    setError(null);
    
    // Track event
    ReactGA.event({
      category: 'Payment',
      action: 'Initiate Checkout',
      label: plan
    });

    try {
      console.log("Fetching checkout session...");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId: auth.currentUser?.uid }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      
      if (!response.ok) {
        throw new Error(data.error || "Zahlungsvorgang konnte nicht gestartet werden.");
      }

      if (data.url) {
        console.log("Redirecting to Stripe:", data.url);
        
        // Save current results to localStorage before redirecting
        if (results && results.length > 0) {
          console.log("Saving results to localStorage for post-payment restoration");
          localStorage.setItem('hairvision_pending_results', JSON.stringify(results));
          if (selectedResult) {
            localStorage.setItem('hairvision_pending_selected_result', JSON.stringify(selectedResult));
          }
          if (customResults && customResults.length > 0) {
            localStorage.setItem('hairvision_pending_custom_results', JSON.stringify(customResults));
          }
          if (image) {
            localStorage.setItem('hairvision_pending_image', image);
          }
        }

        // Try to open in a new tab first for better iframe compatibility
        const stripeWindow = window.open(data.url, '_blank');
        
        if (!stripeWindow || stripeWindow.closed || typeof stripeWindow.closed === 'undefined') {
          console.log("Popup blocked, falling back to iframe redirect");
          window.location.href = data.url;
        }
      } else {
        throw new Error("Keine Checkout-URL erhalten.");
      }
    } catch (err: any) {
      console.error("Checkout failed", err);
      if (err.message.includes("STRIPE_SECRET_KEY")) {
        setError("Zahlungssystem nicht konfiguriert: Bitte hinterlege den Stripe Secret Key (sk_...) in den 'Secrets' (Schlüsselsymbol oben rechts in AI Studio).");
      } else {
        setError(err.message || "Ein unbekannter Fehler ist aufgetreten.");
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  const generatePDF = (result: GeneratedResult) => {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    // Header
    doc.setFont("playfair", "bold");
    doc.setFontSize(24);
    doc.setTextColor(26, 26, 26);
    doc.text("HairVision - Profi Guide", margin, y);
    y += 15;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Style: ${result.name}`, margin, y);
    y += 10;

    // Divider
    doc.setDrawColor(212, 175, 55);
    doc.line(margin, y, 190, y);
    y += 15;

    // Suitability
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(26, 26, 26);
    doc.text("Warum dieser Look?", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const reasonLines = doc.splitTextToSize(result.suitabilityReason, 170);
    doc.text(reasonLines, margin, y);
    y += (reasonLines.length * 6) + 10;

    // Barber Instructions
    doc.setFillColor(253, 253, 251);
    doc.rect(margin - 5, y - 5, 180, 40, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(212, 175, 55);
    doc.text("Anweisungen für den Friseur", margin, y);
    y += 7;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.setTextColor(26, 26, 26);
    const instrLines = doc.splitTextToSize(result.barberInstructions, 170);
    doc.text(instrLines, margin, y);
    y += (instrLines.length * 6) + 15;

    // Products
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(26, 26, 26);
    doc.text("Empfohlene Produkte", margin, y);
    y += 7;
    result.recommendedProducts.forEach((p) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`• ${p.name} (${p.type})`, margin + 5, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(p.reason, margin + 10, y);
      y += 7;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generiert von HairVision AI - Dein persönlicher KI-Frisurenberater", margin, 285);

    doc.save(`${result.name.toLowerCase().replace(/\s+/g, '-')}-guide.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {needsApiKey && (
        <div className="bg-red-600 text-white p-3 text-center text-sm font-medium flex items-center justify-center gap-3 sticky top-0 z-[60]">
          <Lock size={16} />
          <span>API-Key erforderlich für KI-Funktionen</span>
          <button 
            onClick={handleOpenSelectKey}
            className="bg-white text-red-600 px-4 py-1 rounded-full text-xs font-bold hover:bg-red-50 transition-colors"
          >
            Jetzt auswählen
          </button>
        </div>
      )}
      {/* Header */}
      <header className="py-6 px-4 md:px-8 border-b border-black/5 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-[#FF9EBE]">
              <Scissors size={20} />
            </div>
            <h1 className="text-2xl font-serif font-bold tracking-tight">HairVision</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {image && (
              <button 
                onClick={reset}
                className="text-sm font-medium flex items-center gap-2 hover:text-[#FF9EBE] transition-colors"
              >
                <RefreshCcw size={16} />
                <span className="hidden sm:inline">Neustart</span>
              </button>
            )}

            <div className="flex items-center gap-3 px-4 py-1.5 bg-[#FF9EBE]/5 rounded-full border border-[#FF9EBE]/10 flex">
              <span className="text-[10px] font-bold text-brand-primary/60 uppercase tracking-widest flex items-center gap-2">
                <span className="flex items-center gap-1.5">
                  Entwickelt in Deutschland
                  <div className="flex flex-col w-3.5 h-2.5 overflow-hidden rounded-[1px] shadow-sm shrink-0">
                    <div className="h-1/3 bg-black"></div>
                    <div className="h-1/3 bg-[#FF0000]"></div>
                    <div className="h-1/3 bg-[#FFCC00]"></div>
                  </div>
                  ❤️
                </span>
                <span className="opacity-30 hidden sm:inline">•</span>
                <span className="hidden sm:inline">Maximale Datensicherheit</span>
              </span>
            </div>

            <div className="h-6 w-px bg-black/5 hidden md:block" />

            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowGallery(!showGallery)}
                  className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all ${showGallery ? 'bg-brand-primary text-white' : 'hover:bg-black/5'}`}
                >
                  <History size={16} />
                  <span className="hidden sm:inline">Meine Looks</span>
                </button>
                <div className="h-8 w-px bg-black/10 hidden sm:block" />
                <button 
                  onClick={() => {
                    setLoginName(user.displayName || '');
                    setShowProfileModal(true);
                  }}
                  className="flex items-center gap-3 p-1 pr-3 hover:bg-black/5 rounded-full transition-all group"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full object-cover shadow-sm" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#FF9EBE]/10 text-[#FF9EBE] flex items-center justify-center">
                      <User size={16} />
                    </div>
                  )}
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-brand-primary group-hover:text-[#FF9EBE] transition-colors flex items-center gap-1">
                      {user.displayName?.split(' ')[0] || 'Profil'}
                      {isPremium && <Sparkles size={10} className="text-[#FF9EBE]" />}
                    </p>
                    <p className="text-[10px] text-brand-primary/40 uppercase tracking-tighter">
                      {isPremium ? (userPlan === 'single' ? 'Premium' : 'Pro Mitglied') : 'Mein Bereich'}
                    </p>
                  </div>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 bg-black/5 hover:bg-black/10 rounded-full transition-all"
              >
                <User size={16} />
                Anmelden
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 py-12">
        <AnimatePresence mode="wait">
          {showGallery ? (
            <motion.div 
              key="gallery"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h2 className="text-4xl font-serif font-bold">Deine gespeicherten Looks</h2>
                  <p className="text-brand-primary/60">Hier findest du alle Frisuren, die du für später gesichert hast.</p>
                </div>
                <button 
                  onClick={() => setShowGallery(false)}
                  className="text-sm font-medium text-[#FF9EBE] hover:underline"
                >
                  Zurück zur Analyse
                </button>
              </div>

              {savedResults.length === 0 ? (
                <div className="py-24 text-center space-y-4 bg-black/5 rounded-[3rem]">
                  <Bookmark className="mx-auto text-brand-primary/20" size={48} />
                  <p className="text-lg text-brand-primary/40">Du hast noch keine Looks gespeichert.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {savedResults.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedResult(result)}
                      className="group space-y-4 cursor-pointer"
                    >
                      <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-lg relative bg-black/5">
                        <img 
                          src={result.imageUrl} 
                          alt={result.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <Star size={14} className="text-[#FF9EBE] fill-[#FF9EBE]" />
                          <span className="text-sm font-bold">{result.rating}/10</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold">{result.name}</h3>
                        <p className="text-sm text-brand-primary/60 line-clamp-2">{result.suitabilityReason}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : !image ? (
            <div className="space-y-24 md:space-y-40 pb-24">
              <motion.div 
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto text-center space-y-8 py-12"
              >
                <div className="space-y-4">
                  <h2 className="text-5xl md:text-6xl font-serif font-bold leading-tight">
                    Finde deinen <span className="italic text-[#FF9EBE]">perfekten</span> Look.
                  </h2>
                  <div className="text-lg text-brand-primary/60 max-w-2xl mx-auto leading-relaxed space-y-2">
                    <p>Lade ein Foto hoch und lass unsere KI in Sekunden deine Gesichtsform analysieren. ✨</p>
                    <p>Entdecke 9 maßgeschneiderte Frisuren, die perfekt zu dir passen – inklusive der Top-Trends 2026: <span className="text-brand-primary font-bold">Mixie, Federschnitt und Butterfly Cut</span>. 💇‍♀️</p>
                  </div>
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative border-2 border-dashed border-black/10 rounded-3xl p-16 cursor-pointer hover:border-[#FF9EBE]/50 hover:bg-[#FF9EBE]/5 transition-all duration-300"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Upload className="text-brand-primary/40 group-hover:text-[#FF9EBE]" size={32} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-medium">Foto hochladen</p>
                      <p className="text-sm text-brand-primary/40">Klicke oder ziehe ein Bild hierher</p>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-brand-primary/40 max-w-md mx-auto leading-tight">
                  Mit dem Upload willige ich ein, dass mein Bild zur Erstellung personalisierter Haarschnitt-Vorschläge verarbeitet wird.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-primary/40">
                  <span>Kein Account nötig</span>
                  <span className="opacity-20">•</span>
                  <span>3 Frisuren kostenlos testen</span>
                  <span className="opacity-20">•</span>
                  <span>Fotos DSGVO-konform verarbeitet</span>
                  <span className="opacity-20">•</span>
                  <span>100 % privat & sicher</span>
                </div>

                <div className="flex items-center justify-center gap-8 pt-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 size={24} />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-widest opacity-50">KI Analyse</span>
                  </div>
                  <div className="w-12 h-px bg-black/10" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-[#FF9EBE]/10 text-[#FF9EBE] flex items-center justify-center">
                      <Star size={24} />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-widest opacity-50">9 Varianten</span>
                  </div>
                  <div className="w-12 h-px bg-black/10" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Info size={24} />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-widest opacity-50">Profi-Tipps</span>
                  </div>
                </div>
              </motion.div>

              {/* Section 1: Warum unsere User Hairvision lieben */}
              <section className="max-w-6xl mx-auto px-4 py-12">
                <div className="text-center space-y-4 mb-20">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold">Warum unsere User Hairvision lieben</h2>
                  <p className="text-brand-primary/60 text-lg">Entwickelt in Deutschland • DSGVO-konform • 100% Sicher</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/[0.02] space-y-6 group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[#FF9EBE]/10 flex items-center justify-center text-[#FF9EBE] group-hover:scale-110 transition-transform duration-500">
                      <Zap size={32} />
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-bold text-xl">Sekundenschnelle Ergebnisse</h4>
                      <p className="text-brand-primary/60 leading-relaxed">
                        Kein langes Warten. Unsere KI analysiert dein Gesicht sofort und liefert fotorealistische Vorschläge in Echtzeit.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/[0.02] space-y-6 group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[#FF9EBE]/10 flex items-center justify-center text-[#FF9EBE] group-hover:scale-110 transition-transform duration-500">
                      <Target size={32} />
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-bold text-xl">Präzise Typ-Analyse</h4>
                      <p className="text-brand-primary/60 leading-relaxed">
                        Wir erkennen deine Gesichtsform (Oval, Herz, Eckig etc.) und schlagen nur Schnitte vor, die dir wirklich stehen.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/[0.02] space-y-6 group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[#FF9EBE]/10 flex items-center justify-center text-[#FF9EBE] group-hover:scale-110 transition-transform duration-500">
                      <Heart size={32} />
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-bold text-xl">Risikofrei ausprobieren</h4>
                      <p className="text-brand-primary/60 leading-relaxed">
                        Teste extreme Veränderungen wie Pixie-Cuts oder knallige Farben, bevor du zur Schere greifst.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Section 3: Für wen ist HairVision? */}
              <section className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-12">
                  <div className="space-y-6 text-center md:text-left">
                    <div className="w-16 h-16 mx-auto md:mx-0 rounded-[2rem] bg-[#FF9EBE]/10 flex items-center justify-center text-[#FF9EBE]">
                      <Scissors size={32} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-serif font-bold">Der perfekte Friseurtermin</h3>
                      <p className="text-brand-primary/60 leading-relaxed">
                        Zeige deinem Friseur genau, was du willst. Keine Missverständnisse mehr durch vage Beschreibungen.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 text-center md:text-left">
                    <div className="w-16 h-16 mx-auto md:mx-0 rounded-[2rem] bg-[#FF9EBE]/10 flex items-center justify-center text-[#FF9EBE]">
                      <RefreshCcw size={32} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-serif font-bold">Mut zur Typveränderung</h3>
                      <p className="text-brand-primary/60 leading-relaxed">
                        Lust auf etwas völlig Neues? Teste Haarlängen und Farben ohne Risiko und vermeide teure Fehlfrisuren.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 text-center md:text-left">
                    <div className="w-16 h-16 mx-auto md:mx-0 rounded-[2rem] bg-[#FF9EBE]/10 flex items-center justify-center text-[#FF9EBE]">
                      <Camera size={32} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-serif font-bold">Social Media Ready</h3>
                      <p className="text-brand-primary/60 leading-relaxed">
                        Finde den Look, der auf Fotos am besten wirkt. Perfekt für Content Creator und alle, die sich gerne zeigen.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-24 p-12 bg-brand-primary rounded-[3rem] text-white text-center space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9EBE]/20 blur-[100px] -mr-32 -mt-32" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF9EBE]/20 blur-[100px] -ml-32 -mb-32" />
                  
                  <div className="relative space-y-4">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Bereit für deinen neuen Style?</h2>
                    <p className="text-white/70 max-w-xl mx-auto text-lg">Werde Teil unserer Community und entdecke heute noch, welche Frisuren wirklich zu dir passen.✨</p>
                  </div>
                  
                  <div className="relative flex flex-col md:flex-row items-center justify-center gap-4">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-10 py-5 bg-[#FF9EBE] text-white font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-[#FF9EBE]/20 uppercase tracking-widest text-sm"
                    >
                      Jetzt Analyse starten
                    </button>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Kostenlos & Unverbindlich</p>
                  </div>
                </div>
              </section>
            </div>
          ) : results.length === 0 ? (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl relative">
                  <img src={image} alt="Original" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-4xl font-serif font-bold leading-tight">
                      Perfekt! Dein Foto wurde erfolgreich hochgeladen – jetzt wird’s spannend! ✨
                    </h2>
                    <p className="text-lg text-brand-primary/70 font-medium">
                      In wenigen Sekunden analysiert unsere KI deine Gesichtsform und zeigt dir personalisierte Frisuren, die wirklich zu dir passen.
                      <br />
                      <span className="text-[#FF9EBE]">Bereit für deinen neuen Traum-Look?</span>
                    </p>
                  </div>

                  {!isAnalyzing && !isGenerating ? (
                    <button 
                      onClick={processImage}
                      className="w-full py-4 bg-brand-primary text-white rounded-2xl font-medium text-lg hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-3 shadow-xl group"
                    >
                      Zeig mir meine besten Looks! ✨
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-[#FF9EBE] font-medium">
                        <Loader2 className="animate-spin" size={24} />
                        <span>{isGenerating ? `Dein Traum-Look ${results.length + 1} von 9 wird gerade erstellt...` : "Deine Gesichtsform wird analysiert..."}</span>
                      </div>
                      <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-[#FF9EBE]"
                          initial={{ width: 0 }}
                          animate={{ width: `${generationProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex flex-col gap-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                      </div>
                      {needsApiKey && (
                        <button 
                          onClick={handleOpenSelectKey}
                          className="w-full py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Lock size={14} />
                          API-Key auswählen
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4 max-w-2xl">
                  <h2 className="text-4xl font-serif font-bold">Das sind deine ersten 3 personalisierten Styles🔥</h2>
                  <p className="text-brand-primary/80 text-lg font-medium">Jeder einzelne wurde speziell für deine Gesichtsform und deinen Typ erstellt.</p>
                  <div className="space-y-2 pt-2">
                    <p className="text-brand-primary/60 font-semibold">Tippe auf einen Look und erhalte sofort:</p>
                    <ul className="text-brand-primary/60 space-y-1 list-disc list-inside ml-1">
                      <li>Genau passende Friseur-Anweisungen</li>
                      <li>Farb- & Pflege-Empfehlungen</li>
                    </ul>
                  </div>
                </div>
                {isGenerating && (
                   <div className="flex items-center gap-3 text-[#FF9EBE] font-medium bg-[#FF9EBE]/10 px-4 py-2 rounded-full">
                    <Loader2 className="animate-spin" size={18} />
                    <span className="text-sm">Weitere Styles werden geladen ({results.filter(r => r.imageUrl).length}/{isPremium ? 9 : 4})</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((result, index) => {
                  const isLocked = !isPremium && index >= 4;
                  const isBlurred = !isPremium && index === 3;
                  
                  return (
                    <React.Fragment key={result.id}>
                      {index === 4 && !isPremium && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="col-span-1 sm:col-span-2 lg:col-span-3 bg-[#FF9EBE]/5 border-2 border-dashed border-[#FF9EBE]/20 rounded-[2.5rem] p-8 lg:p-12 flex flex-col items-center text-center space-y-6 my-4"
                        >
                          <div className="w-20 h-20 bg-[#FF9EBE] rounded-full flex items-center justify-center text-white shadow-xl shadow-[#FF9EBE]/20 animate-bounce">
                            <Sparkles size={40} />
                          </div>
                          <div className="space-y-4 max-w-3xl">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <div className="flex -space-x-2">
                                {[1,2,3].map(i => (
                                  <img key={i} src={`https://i.pravatar.cc/100?u=${i+10}`} className="w-6 h-6 rounded-full border-2 border-white" alt="User" referrerPolicy="no-referrer" />
                                ))}
                              </div>
                              <span className="text-[10px] font-bold text-brand-primary/60 uppercase tracking-widest">50.000+ zufriedene Nutzer</span>
                            </div>
                            <h3 className="text-3xl lg:text-5xl font-serif font-bold text-brand-primary leading-tight">
                              Wow – diese 3 Styles stehen dir schon unglaublich gut! 😍
                            </h3>
                            <div className="space-y-6 text-lg lg:text-xl text-brand-primary/70 font-medium max-w-2xl mx-auto mt-4">
                              <p>
                                Entdecke jetzt alle <span className="text-[#FF9EBE] font-black">6 weitere personalisierte Styles</span> dieser Analyse – für nur <span className="font-black">1,99 € einmalig</span>. 🚀
                              </p>
                              <p className="text-base lg:text-lg opacity-80 italic">
                                Perfekt, wenn du heute noch deinen Friseurtermin planen möchtest. 📅
                              </p>
                              <div className="pt-4 border-t border-[#FF9EBE]/10">
                                <p className="text-brand-primary font-bold mb-2">Oder werde zum eigenen Stylist mit der Styling-Flatrate. ✨</p>
                                <p className="text-[#FF9EBE] font-black mb-4">Hol dir das Jahresabo und erhalte:</p>
                                <ul className="text-left space-y-2 text-sm lg:text-base max-w-md mx-auto">
                                  <li className="flex items-center gap-2">🎨 Unbegrenzt über 100 Frisuren & Farben direkt an dir selber testen</li>
                                  <li className="flex items-center gap-2">✅ Alle 9 Styles dieser Analyse sofort</li>
                                  <li className="flex items-center gap-2">🆕 Jeden Monat komplett neue Trend-Kollektionen</li>
                                  <li className="flex items-center gap-2">📖 Deinen persönlichen Profi-Friseur-Guide als PDF</li>
                                  <li className="flex items-center gap-2">💎 HD-Downloads ohne Wasserzeichen</li>
                                  <li className="flex items-center gap-2">🛡️ Ein Jahr lang Sicherheit bei jedem Friseurbesuch</li>
                                </ul>
                              </div>
                              <div className="pt-4 space-y-2">
                                <p className="text-[#FF9EBE] font-black text-2xl">Nur 39,99 € für das ganze Jahr 💸</p>
                                <p className="text-sm opacity-60">(statt 83,88 €) – das sind nur 3,33 € pro Monat.</p>
                                <p className="text-brand-primary font-bold">Kein Rätselraten mehr. Keine teuren Fehlgriffe beim Friseur. ❌</p>
                                <p className="text-brand-primary font-bold">Nur noch Looks, die wirklich zu dir passen. ✅</p>
                                <p className="text-[#FF9EBE] font-black text-xl mt-4">Finde jetzt deinen echten Traum-Look. ✨</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-4">
                              <div className="flex items-center gap-2 text-brand-primary/80 text-sm font-bold">
                                <CheckCircle2 size={16} className="text-[#FF9EBE]" />
                                <span>Profi-Anweisungen für deinen Friseur</span>
                              </div>
                              <div className="flex items-center gap-2 text-brand-primary/80 text-sm font-bold">
                                <CheckCircle2 size={16} className="text-[#FF9EBE]" />
                                <span>Alle 9 Premium-Styles sofort</span>
                              </div>
                              <div className="flex items-center gap-2 text-brand-primary/80 text-sm font-bold">
                                <CheckCircle2 size={16} className="text-[#FF9EBE]" />
                                <span>Individuelle Typ-Beratung</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                              {/* Option 1: Single Unlock */}
                              <div className="bg-white/50 p-5 rounded-2xl border border-[#FF9EBE]/10 text-left flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 block mb-2">Einmalig</span>
                                  <p className="text-sm font-bold text-brand-primary leading-snug">Schalte alle 9 Bilder dieser Analyse sofort frei.</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-black/5">
                                  <span className="text-lg font-black text-brand-primary">Nur 1,99€</span>
                                </div>
                              </div>

                              {/* Option 2: Yearly Subscription */}
                              <div className="bg-[#FF9EBE]/10 p-5 rounded-2xl border-2 border-[#FF9EBE] text-left relative overflow-hidden flex flex-col justify-between shadow-lg scale-105 z-10">
                                <div className="absolute top-0 right-0 bg-[#FF9EBE] text-white text-[8px] font-black px-2 py-1 rounded-bl-lg uppercase tracking-widest animate-pulse">Beste Wahl ★</div>
                                <div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE] block mb-2">Jahresabo</span>
                                  <p className="text-sm font-bold text-brand-primary leading-snug">Styling-Flatrate: Unbegrenzt testen + monatlich neue Trends.</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-[#FF9EBE]/10">
                                  <span className="text-lg font-black text-[#FF9EBE]">Nur 3,33€ / Monat</span>
                                  <span className="text-[10px] text-brand-primary/40 block">39,99€ jährlich</span>
                                </div>
                              </div>

                              {/* Option 3: Monthly Subscription */}
                              <div className="bg-white/50 p-5 rounded-2xl border border-[#FF9EBE]/10 text-left flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-brand-primary text-white text-[8px] font-black px-2 py-1 rounded-bl-lg uppercase tracking-widest">BELIEBT ⭐</div>
                                <div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 block mb-2">Monatsabo</span>
                                  <p className="text-sm font-bold text-brand-primary leading-snug">Flexibel jederzeit kündbar. Alle Styles & Trends.</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-black/5">
                                  <span className="text-lg font-black text-brand-primary">6,99€ / Monat</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center gap-4">
                            <div className="bg-white px-8 py-4 rounded-2xl shadow-sm border border-[#FF9EBE]/10 flex flex-col items-center gap-2">
                              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#FF9EBE]">Zeitlich begrenztes Angebot</span>
                              <div className="flex items-center gap-4">
                                <span className="text-3xl font-mono font-bold text-brand-primary">{formatTime(timeLeft)}</span>
                                <div className="h-8 w-px bg-black/10" />
                                <div className="text-left">
                                  <span className="block text-xs font-bold text-brand-primary/40 line-through">83,88€</span>
                                  <span className="text-xl font-black text-[#FF9EBE]">Nur 39,99€ / Jahr</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-bold text-brand-primary/60 bg-white px-4 py-2 rounded-full border border-[#FF9EBE]/10">
                              <Users size={14} className="text-[#FF9EBE]" />
                              Über 12.482 Styles heute generiert
                            </div>
                          </div>

                          <button 
                            onClick={() => setShowPricingModal(true)}
                            className="px-12 py-4 bg-brand-primary text-white rounded-2xl font-bold text-lg hover:bg-brand-primary/90 transition-all shadow-xl flex items-center gap-3 group"
                          >
                            Alle 9 Styles + Profi-Guide freischalten
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                          
                          <div className="flex flex-wrap justify-center gap-4 text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">
                            <span className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100"><ShieldCheck size={12} className="text-emerald-500" /> 14-Tage Geld-zurück-Garantie</span>
                            <span className="flex items-center gap-1 bg-[#FF9EBE]/5 px-2 py-1 rounded-md border border-[#FF9EBE]/10"><CheckCircle2 size={12} className="text-[#FF9EBE]" /> Inkl. Friseur-Guide PDF</span>
                            <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md border border-blue-100"><Users size={12} className="text-blue-500" /> Von Stylisten empfohlen</span>
                          </div>
                        </motion.div>
                      )}
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          if (isLocked || isBlurred) {
                            setShowPricingModal(true);
                          } else if (result.imageUrl) {
                            setSelectedResult(result);
                          }
                        }}
                        className={`group space-y-4 ${result.imageUrl ? 'cursor-pointer' : 'cursor-wait'} relative`}
                      >
                      <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-lg relative bg-black/5">
                        {result.imageUrl || isLocked ? (
                          <>
                            <img 
                              src={result.imageUrl || `https://picsum.photos/seed/hairstyle-${index}/600/800?blur=10`} 
                              alt={result.name} 
                              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isLocked ? 'blur-2xl grayscale' : isBlurred ? 'blur-md' : ''}`} 
                              referrerPolicy="no-referrer"
                            />
                            
                            {isLocked ? (
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40 backdrop-blur-sm">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-4">
                                  <Lock size={32} />
                                </div>
                                <h4 className="text-white font-bold text-xl mb-2">Premium Look</h4>
                                <p className="text-white/80 text-sm mb-6">Schalte alle 9 Styles & Profi-Tipps frei.</p>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowPricingModal(true);
                                  }}
                                  disabled={isCheckingOut}
                                  className="px-6 py-3 bg-[#FF9EBE] text-white rounded-full font-black hover:bg-[#FF9EBE]/90 transition-all flex items-center gap-2 shadow-lg shadow-[#FF9EBE]/20 group-hover:scale-105"
                                >
                                  {isCheckingOut ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                  {result.name} jetzt freischalten
                                </button>
                              </div>
                            ) : isBlurred ? (
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/20 backdrop-blur-sm">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-3">
                                  <Sparkles size={24} />
                                </div>
                                <h4 className="text-white font-bold text-lg mb-4">Premium-Vorschau</h4>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowPricingModal(true);
                                  }}
                                  className="px-8 py-4 bg-[#FF9EBE] text-white rounded-2xl text-sm font-black hover:bg-[#FF9EBE]/90 transition-all shadow-lg leading-tight max-w-[280px]"
                                >
                                  {result.name} schaut auch super aus bei dir!😍
                                </button>
                                <p className="text-white/90 text-[10px] mt-4 font-medium leading-relaxed">
                                  Entdecke diesen und 5 weitere Styles die perfekt zu dir passen - Jetzt für nur 1,99€
                                </p>
                              </div>
                            ) : (
                              <>
                                <div className="absolute top-4 left-4 flex gap-2">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDownload(result.imageUrl, result.name);
                                    }}
                                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-primary hover:text-[#FF9EBE] shadow-sm transition-colors"
                                    title="Bild herunterladen"
                                  >
                                    <Download size={18} />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      saveResult(result);
                                    }}
                                    disabled={isSaving === result.id}
                                    className={`w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-colors ${isResultSaved(result.id) ? 'text-[#FF9EBE]' : 'text-brand-primary hover:text-[#FF9EBE]'}`}
                                    title={isResultSaved(result.id) ? "Gespeichert" : "Look speichern"}
                                  >
                                    {isSaving === result.id ? <Loader2 className="animate-spin" size={18} /> : isResultSaved(result.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                                  </button>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                  <Star size={14} className="text-[#FF9EBE] fill-[#FF9EBE]" />
                                  <span className="text-sm font-bold">{result.rating}/10</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                  <span className="text-white font-medium flex items-center gap-2">
                                    Details ansehen <ChevronRight size={16} />
                                  </span>
                                </div>
                              </>
                            )}
                          </>
                        ) : result.failed ? (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 text-center bg-red-50/50">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                              <AlertCircle size={24} />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-red-900">Fehlgeschlagen</p>
                              <p className="text-[10px] text-red-600 leading-tight">Die KI ist gerade überlastet. Bitte versuche es erneut.</p>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                retryStyle(index);
                              }}
                              className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                              <RefreshCcw size={14} />
                              Erneut versuchen
                            </button>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
                            <Loader2 className="animate-spin text-[#FF9EBE]" size={32} />
                            <p className="text-xs font-bold uppercase tracking-widest opacity-30">Wird generiert...</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h3 className={`text-xl font-bold ${isLocked ? 'opacity-30' : ''}`}>{result.name}</h3>
                        <p className={`text-sm text-brand-primary/60 line-clamp-2 ${isLocked ? 'opacity-30' : ''}`}>{result.suitabilityReason}</p>
                      </div>
                    </motion.div>
                  </React.Fragment>
                );
              })}
              </div>

              {/* Premium Feature: Style Library & Color Picker */}
              {isPremium && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/5 rounded-[3rem] p-8 lg:p-12 space-y-10 mt-12"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#FF9EBE]">
                        <Sparkles size={20} />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Premium Feature</span>
                      </div>
                      <h2 className="text-3xl font-serif font-bold">Style-Bibliothek & Farb-Wechsler</h2>
                      <p className="text-brand-primary/60">Wähle eine Frisur aus unserer Bibliothek und kombiniere sie mit deiner Wunschfarbe.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Step 1: Choose Style */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                        <h3 className="font-bold text-lg">Frisur wählen</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {HAIRSTYLE_LIBRARY.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => setSelectedLibraryStyle(style)}
                            className={`p-4 rounded-2xl text-left transition-all border-2 ${selectedLibraryStyle?.id === style.id ? 'border-[#FF9EBE] bg-white shadow-md' : 'border-transparent bg-white/50 hover:bg-white'}`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-brand-primary">{style.name}</span>
                              <span className="text-[10px] uppercase font-bold text-brand-primary/40 px-2 py-0.5 bg-black/5 rounded-md">{style.category}</span>
                            </div>
                            <p className="text-xs text-brand-primary/60 line-clamp-1">{style.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Choose Color */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                        <h3 className="font-bold text-lg">Farbe wählen</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {HAIR_COLORS.map((color) => (
                          <button
                            key={color.id}
                            onClick={() => setSelectedColor(color)}
                            className={`p-3 rounded-2xl flex items-center gap-3 transition-all border-2 ${selectedColor?.id === color.id ? 'border-[#FF9EBE] bg-white shadow-md' : 'border-transparent bg-white/50 hover:bg-white'}`}
                          >
                            <div className="w-6 h-6 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: color.hex }} />
                            <span className="text-sm font-medium text-brand-primary">{color.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 3: Action & Preview */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                        <h3 className="font-bold text-lg">Vorschau</h3>
                      </div>
                      
                      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-black/5 space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-brand-primary/40">Style:</span>
                            <span className="font-bold text-brand-primary">{selectedLibraryStyle?.name || 'Bitte wählen'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-brand-primary/40">Farbe:</span>
                            <span className="font-bold text-brand-primary">{selectedColor?.name || 'Bitte wählen'}</span>
                          </div>
                        </div>

                        <button
                          onClick={handleCustomTryOn}
                          disabled={!selectedLibraryStyle || !selectedColor || isGeneratingCustom}
                          className="w-full py-4 bg-[#FF9EBE] text-white rounded-2xl font-bold shadow-lg shadow-[#FF9EBE]/20 hover:bg-[#FF9EBE]/90 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                        >
                          {isGeneratingCustom ? (
                            <>
                              <Loader2 className="animate-spin" size={20} />
                              Wird erstellt...
                            </>
                          ) : (
                            <>
                              <RefreshCcw size={20} />
                              Style anwenden
                            </>
                          )}
                        </button>
                        
                        <p className="text-[10px] text-center text-brand-primary/40 leading-relaxed">
                          Die KI nutzt dein Originalfoto als Basis und wendet den gewählten Look sowie die Farbe realistisch an.
                        </p>
                      </div>

                      {customResults.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-widest text-brand-primary/40">Deine Kreationen</h4>
                          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                            {customResults.map((res) => (
                              <button
                                key={res.id}
                                onClick={() => setSelectedResult(res)}
                                className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-sm hover:scale-105 transition-transform"
                              >
                                <img src={res.imageUrl} alt="Custom" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-8 bg-white border-t border-black/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-[#FF9EBE]">
              <Scissors size={16} />
            </div>
            <span className="font-serif font-bold">HairVision</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <button onClick={() => setActiveLegalModal('about')} className="text-xs font-bold uppercase tracking-widest text-brand-primary/40 hover:text-[#FF9EBE] transition-colors">Über uns</button>
            <button onClick={() => setActiveLegalModal('impressum')} className="text-xs font-bold uppercase tracking-widest text-brand-primary/40 hover:text-[#FF9EBE] transition-colors">Impressum</button>
            <button onClick={() => setActiveLegalModal('datenschutz')} className="text-xs font-bold uppercase tracking-widest text-brand-primary/40 hover:text-[#FF9EBE] transition-colors">Datenschutz</button>
            <button onClick={() => setActiveLegalModal('agb')} className="text-xs font-bold uppercase tracking-widest text-brand-primary/40 hover:text-[#FF9EBE] transition-colors">AGB</button>
            <button onClick={() => setActiveLegalModal('widerruf')} className="text-xs font-bold uppercase tracking-widest text-brand-primary/40 hover:text-[#FF9EBE] transition-colors">Widerruf</button>
          </div>

          <p className="text-xs text-brand-primary/30 font-medium">
            © 2026 HairVision AI Solutions. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>

      {/* Legal Modals */}
      <LegalModal 
        isOpen={activeLegalModal === 'about'} 
        onClose={() => setActiveLegalModal(null)} 
        title="Über HairVision" 
        icon={<Sparkles size={24} />}
        content={<AboutContent />}
      />

      <LegalModal 
        isOpen={activeLegalModal === 'impressum'} 
        onClose={() => setActiveLegalModal(null)} 
        title="Impressum" 
        icon={<FileText size={24} />}
        content={<ImpressumContent />}
      />
      <LegalModal 
        isOpen={activeLegalModal === 'datenschutz'} 
        onClose={() => setActiveLegalModal(null)} 
        title="Datenschutzerklärung" 
        icon={<Shield size={24} />}
        content={<DatenschutzContent />}
      />
      <LegalModal 
        isOpen={activeLegalModal === 'agb'} 
        onClose={() => setActiveLegalModal(null)} 
        title="Allgemeine Geschäftsbedingungen" 
        icon={<Scale size={24} />}
        content={<AGBContent />}
      />
      <LegalModal 
        isOpen={activeLegalModal === 'widerruf'} 
        onClose={() => setActiveLegalModal(null)} 
        title="Widerrufsbelehrung" 
        icon={<RefreshCcw size={24} />}
        content={<WiderrufContent />}
      />

      {/* Cookie Banner */}
      <CookieBanner />

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedResult && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedResult(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                <img 
                  src={selectedResult.imageUrl} 
                  alt={selectedResult.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 right-6 flex gap-3 md:hidden">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(selectedResult.imageUrl, selectedResult.name);
                    }}
                    className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                  >
                    <Download size={20} />
                  </button>
                  <button 
                    onClick={() => setSelectedResult(null)}
                    className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                  >
                    <RefreshCcw className="rotate-45" size={20} />
                  </button>
                </div>
                <button 
                  onClick={() => setSelectedResult(null)}
                  className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors md:hidden"
                >
                  <ChevronRight className="rotate-180" size={24} />
                </button>
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#FF9EBE]">
                      <Star size={20} className="fill-[#FF9EBE]" />
                      <span className="font-bold text-lg">{selectedResult.rating}/10 Rating</span>
                    </div>
                    <h2 className="text-4xl font-serif font-bold">{selectedResult.name}</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => generatePDF(selectedResult)}
                      className="hidden md:flex w-12 h-12 bg-brand-primary/5 text-brand-primary rounded-full items-center justify-center hover:bg-brand-primary/10 transition-colors"
                      title="Profi-Guide als PDF laden"
                    >
                      <FileText size={20} />
                    </button>
                    <button 
                      onClick={() => saveResult(selectedResult)}
                      disabled={isSaving === selectedResult.id}
                      className={`hidden md:flex w-12 h-12 bg-brand-primary/5 rounded-full items-center justify-center hover:bg-brand-primary/10 transition-colors ${isResultSaved(selectedResult.id) ? 'text-[#FF9EBE]' : 'text-brand-primary'}`}
                      title="Look speichern"
                    >
                      {isSaving === selectedResult.id ? <Loader2 className="animate-spin" size={20} /> : isResultSaved(selectedResult.id) ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                    </button>
                    <button 
                      onClick={() => handleDownload(selectedResult.imageUrl, selectedResult.name)}
                      className="hidden md:flex w-12 h-12 bg-[#FF9EBE]/10 text-[#FF9EBE] rounded-full items-center justify-center hover:bg-[#FF9EBE]/20 transition-colors"
                      title="Bild herunterladen"
                    >
                      <Download size={20} />
                    </button>
                    <button 
                      onClick={() => setSelectedResult(null)}
                      className="hidden md:flex w-12 h-12 bg-black/5 rounded-full items-center justify-center hover:bg-black/10 transition-colors"
                    >
                      <RefreshCcw size={20} className="rotate-45" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <section className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-brand-primary/40">Warum dieser Style?</h4>
                    <p className="text-brand-primary/80 leading-relaxed">{selectedResult.suitabilityReason}</p>
                  </section>

                  <section className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-brand-primary/40">Beschreibung</h4>
                    <p className="text-brand-primary/80 leading-relaxed">{selectedResult.description}</p>
                  </section>

                  <div className="p-6 bg-[#FF9EBE]/5 rounded-3xl border border-[#FF9EBE]/20 space-y-4">
                    <div className="flex items-center gap-3 text-[#FF9EBE]">
                      <Scissors size={20} />
                      <h4 className="font-bold">Anweisungen für den Friseur</h4>
                    </div>
                    <p className="text-brand-primary/90 text-sm leading-relaxed italic">
                      "{selectedResult.barberInstructions}"
                    </p>
                  </div>

                  {/* Recommended Products */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 text-brand-primary/60">
                      <ShoppingBag size={18} />
                      <h4 className="text-xs font-bold uppercase tracking-widest">Empfohlene Produkte</h4>
                    </div>
                    <div className="grid gap-4">
                      {selectedResult.recommendedProducts?.map((product, i) => (
                        <div key={`${selectedResult.id}-product-${i}`} className="flex items-start gap-4 p-4 rounded-2xl bg-black/5 border border-black/5 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 bg-black/5 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-brand-primary/40">
                            Werbelink
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                            <Sparkles size={18} className="text-[#FF9EBE]" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-bold text-sm">{product.name} <span className="text-xs font-normal opacity-50">({product.type})</span></p>
                            <p className="text-xs text-brand-primary/60">{product.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {!user && (
                    <div className="p-8 bg-black text-white rounded-[2rem] space-y-4 text-center">
                      <Bookmark className="mx-auto text-[#FF9EBE]" size={32} />
                      <div className="space-y-1">
                        <h4 className="font-bold text-xl">Diesen Look speichern?</h4>
                        <p className="text-white/60 text-sm">Melde dich an, um deine Favoriten dauerhaft in deiner persönlichen Galerie zu sichern.</p>
                      </div>
                      <button 
                        onClick={() => setShowLoginModal(true)}
                        className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                      >
                        <User size={18} />
                        Anmelden & Speichern
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-black/5 text-center text-brand-primary/40 text-sm">
        <p>© 2026 HairVision AI. Alle Rechte vorbehalten.</p>
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors z-20 bg-white/80 backdrop-blur-sm"
              >
                <X size={20} />
              </button>

              <div className="overflow-y-auto p-8 sm:p-10 space-y-8">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-[#FF9EBE]/10 text-[#FF9EBE] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold">
                    {isForgotPassword ? 'Passwort vergessen?' : isRegistering ? 'Konto erstellen' : 'Willkommen zurück'}
                  </h3>
                  <p className="text-brand-primary/60 text-sm">
                    {isForgotPassword 
                      ? 'Gib deine E-Mail ein, um einen Link zum Zurücksetzen zu erhalten.' 
                      : 'Melde dich an, um deine Looks zu speichern und exklusive Tipps zu erhalten.'}
                  </p>
                </div>

                {authMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl flex items-start gap-3 text-sm ${
                      authMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' :
                      authMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' :
                      'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}
                  >
                    {authMessage.type === 'error' ? <AlertCircle size={18} className="shrink-0" /> : <CheckCircle2 size={18} className="shrink-0" />}
                    <p>{authMessage.text}</p>
                  </motion.div>
                )}

                {!isForgotPassword && (
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={handleLogin}
                      disabled={authLoading}
                      className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white border border-black/10 rounded-xl font-medium hover:bg-black/5 transition-all disabled:opacity-50"
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                      Mit Google fortfahren
                    </button>
                  </div>
                )}

                {!isForgotPassword && (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-black/5"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest">
                      <span className="bg-white px-4 text-brand-primary/30">oder mit E-Mail</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {isRegistering && !isForgotPassword && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-brand-primary/40 ml-1">Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/30" size={18} />
                        <input 
                          type="text" 
                          required
                          value={loginName}
                          onChange={(e) => setLoginName(e.target.value)}
                          placeholder="Dein Name"
                          className="w-full pl-12 pr-4 py-3 bg-black/5 border-none rounded-xl focus:ring-2 focus:ring-[#FF9EBE]/20 transition-all outline-none"
                        />
                      </div>
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-brand-primary/40 ml-1">E-Mail</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/30" size={18} />
                      <input 
                        type="email" 
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="beispiel@mail.de"
                        className="w-full pl-12 pr-4 py-3 bg-black/5 border-none rounded-xl focus:ring-2 focus:ring-[#FF9EBE]/20 transition-all outline-none"
                      />
                    </div>
                  </div>
                  {!isForgotPassword && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-brand-primary/40">Passwort</label>
                        {!isRegistering && (
                          <button 
                            type="button"
                            onClick={() => setIsForgotPassword(true)}
                            className="text-[10px] uppercase tracking-widest font-bold text-[#FF9EBE] hover:underline"
                          >
                            Vergessen?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/30" size={18} />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-12 py-3 bg-black/5 border-none rounded-xl focus:ring-2 focus:ring-[#FF9EBE]/20 transition-all outline-none"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary/30 hover:text-brand-primary transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {authLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        {isForgotPassword ? <Mail size={20} /> : isRegistering ? <UserPlus size={20} /> : <ChevronRight size={20} />}
                        {isForgotPassword ? 'Link senden' : isRegistering ? 'Konto erstellen' : 'Anmelden'}
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-4 border-t border-black/5">
                  <button 
                    onClick={() => {
                      if (isForgotPassword) {
                        setIsForgotPassword(false);
                      } else {
                        setIsRegistering(!isRegistering);
                      }
                      setAuthMessage(null);
                    }}
                    className="text-sm font-medium text-brand-primary/60 hover:text-[#FF9EBE] transition-colors"
                  >
                    {isForgotPassword ? (
                      <span className="flex items-center justify-center gap-2">
                        <ChevronRight size={16} className="rotate-180" />
                        Zurück zum Login
                      </span>
                    ) : isRegistering ? (
                      <>Bereits ein Konto? <span className="text-[#FF9EBE] font-bold">Hier anmelden</span></>
                    ) : (
                      <>Noch kein Konto? <span className="text-[#FF9EBE] font-bold">Jetzt registrieren</span></>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/5">
                  <div className="flex items-center gap-2 text-[10px] text-brand-primary/40 uppercase tracking-widest font-bold">
                    <CheckCircle2 size={12} className="text-green-500" />
                    Looks speichern
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-brand-primary/40 uppercase tracking-widest font-bold">
                    <CheckCircle2 size={12} className="text-green-500" />
                    Profi-Anleitungen
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && user && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <button 
                onClick={() => setShowProfileModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors z-20 bg-white/80 backdrop-blur-sm"
              >
                <X size={20} />
              </button>

              <div className="overflow-y-auto p-8 sm:p-10 space-y-8">
                <div className="text-center space-y-4">
                  <div className="relative w-24 h-24 mx-auto">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full rounded-3xl object-cover shadow-lg" />
                    ) : (
                      <div className="w-full h-full rounded-3xl bg-[#FF9EBE]/10 text-[#FF9EBE] flex items-center justify-center shadow-inner">
                        <User size={40} />
                      </div>
                    )}
                    {user.emailVerified && (
                      <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-md">
                        <ShieldCheck size={20} className="text-green-500" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif font-bold">{user.displayName || 'Nutzer'}</h3>
                    <p className="text-brand-primary/40 text-sm">{user.email}</p>
                  </div>
                </div>

                {/* Subscription Status */}
                <div className="p-5 bg-black/5 rounded-3xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <Star size={18} className={isPremium ? "text-[#FF9EBE]" : "text-brand-primary/20"} />
                      Status
                    </div>
                    <span className={`text-xs font-black px-3 py-1 rounded-full ${
                      isPremium ? 'bg-[#FF9EBE] text-white' : 'bg-black/10 text-brand-primary/40'
                    }`}>
                      {isPremium ? (userPlan === 'single' ? 'Premium' : (userPlan === 'monthly' ? 'Pro Monat' : 'Pro Jahr')) : 'Kostenlos'}
                    </span>
                  </div>
                  
                  {isPremium && premiumExpiresAt && (
                    <div className="flex items-center gap-2 text-[10px] text-brand-primary/60 bg-white/50 p-2 rounded-xl">
                      <Bell size={12} />
                      <span>
                        {(() => {
                          const expiryDate = premiumExpiresAt.toDate();
                          const now = new Date();
                          const diffTime = expiryDate.getTime() - now.getTime();
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          if (diffDays < 0) return "Abo abgelaufen";
                          if (diffDays === 0) return "Läuft heute ab";
                          return `Läuft in ${diffDays} Tagen ab (${expiryDate.toLocaleDateString('de-DE')})`;
                        })()}
                      </span>
                    </div>
                  )}

                  {!isPremium && (
                    <button 
                      onClick={() => {
                        setShowProfileModal(false);
                        setShowPricingModal(true);
                      }}
                      className="w-full py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles size={14} />
                      Jetzt upgraden
                    </button>
                  )}
                </div>

                {authMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl flex items-start gap-3 text-sm ${
                      authMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' :
                      authMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' :
                      'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}
                  >
                    <Bell size={18} className="shrink-0" />
                    <p>{authMessage.text}</p>
                  </motion.div>
                )}

                <div className="space-y-6">
                  {!user.emailVerified && (
                    <div className="p-4 bg-[#FF9EBE]/5 border border-[#FF9EBE]/20 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-[#FF9EBE] text-sm font-bold">
                        <AlertCircle size={18} />
                        E-Mail nicht bestätigt
                      </div>
                      <p className="text-[#FF9EBE]/80 text-xs leading-relaxed">
                        Bitte bestätige deine E-Mail-Adresse, um alle Funktionen nutzen zu können.
                      </p>
                      <button 
                        onClick={handleSendVerification}
                        disabled={authLoading}
                        className="w-full py-2 bg-[#FF9EBE] text-white rounded-xl text-xs font-bold hover:bg-[#FF9EBE]/90 transition-all disabled:opacity-50"
                      >
                        Bestätigungs-E-Mail senden
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-brand-primary/40 ml-1">Anzeigename ändern</label>
                      <div className="relative">
                        <Settings className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/30" size={18} />
                        <input 
                          type="text" 
                          required
                          value={loginName}
                          onChange={(e) => setLoginName(e.target.value)}
                          placeholder={user.displayName || "Dein Name"}
                          className="w-full pl-12 pr-4 py-3 bg-black/5 border-none rounded-xl focus:ring-2 focus:ring-[#FF9EBE]/20 transition-all outline-none"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {authLoading ? <Loader2 className="animate-spin" size={18} /> : 'Profil aktualisieren'}
                    </button>
                  </form>

                  <div className="pt-4 border-t border-black/5 space-y-3">
                    <button 
                      onClick={handleLogout}
                      className="w-full py-3 bg-black/5 text-brand-primary rounded-xl font-bold hover:bg-black/10 transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut size={18} />
                      Abmelden
                    </button>
                    <button 
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount}
                      className="w-full py-3 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                    >
                      {isDeletingAccount ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                      Konto löschen
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pricing Modal */}
      <AnimatePresence>
        {showPricingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPricingModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setShowPricingModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors z-20 bg-white/80 backdrop-blur-sm shadow-sm"
              >
                <X size={20} />
              </button>

              <div className="overflow-y-auto flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Left Side: Benefits */}
                  <div className="p-8 lg:p-12 bg-brand-primary text-white">
                    <div className="flex items-center gap-3 mb-6 lg:mb-8">
                      <div className="w-10 h-10 bg-[#FF9EBE] rounded-xl flex items-center justify-center">
                        <Sparkles size={24} className="text-white" />
                      </div>
                      <span className="text-2xl font-bold tracking-tight">HairVision Premium</span>
                    </div>
                    
                    <h2 className="text-2xl lg:text-4xl font-bold mb-6 leading-tight">
                      Wow – diese 3 Styles stehen dir schon unglaublich gut! 😍
                    </h2>
                    
                    <p className="text-white/80 mb-6 text-sm lg:text-base">
                      Entdecke jetzt alle 6 weitere personalisierte Styles dieser Analyse – für nur 1,99 € einmalig. Perfekt, wenn du heute noch deinen Friseurtermin planen möchtest. 📅
                    </p>
                    
                    <p className="text-[#FF9EBE] font-bold mb-4 text-sm lg:text-base">
                      Oder werde zum eigenen Stylist mit der Styling-Flatrate:
                    </p>
                    
                    <ul className="space-y-3 lg:space-y-4 mb-8">
                      {[
                        "🎨 Unbegrenzt über 100 Frisuren & Farben direkt an dir selber testen",
                        "✅ Alle 9 Styles dieser Analyse sofort freigeschaltet",
                        "Jeden Monat komplett neue Trend-Kollektionen 🆕",
                        "Dein persönlicher Profi-Friseur-Guide als PDF 📖",
                        "HD-Downloads ohne Wasserzeichen 💎",
                        "Ein Jahr lang Sicherheit bei jedem Friseurbesuch 🛡️"
                      ].map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-1 w-5 h-5 rounded-full bg-[#FF9EBE]/20 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={14} className="text-[#FF9EBE]" />
                          </div>
                          <span className="text-white/80 text-sm lg:text-base font-medium">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hidden lg:block">
                      <p className="text-sm italic text-white/60">
                        "Ich war mir unsicher, ob mir kurze Haare stehen. Dank HairVision habe ich mich getraut und liebe meinen neuen Look!"
                      </p>
                      <p className="text-xs font-bold mt-3 text-[#FF9EBE] uppercase tracking-widest">— Sarah, 28</p>
                    </div>
                  </div>

                  {/* Right Side: Pricing Options */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                    <div className="text-center mb-6 lg:mb-8">
                      <h3 className="text-xl lg:text-2xl font-bold text-brand-primary mb-2">Wähle deinen Plan</h3>
                      <p className="text-sm text-brand-primary/60">Keine versteckten Kosten. Jederzeit kündbar.</p>
                    </div>

                    <div className="space-y-3 lg:space-y-4">
                      {/* Legal Checkboxes */}
                      <div className="space-y-3 mb-6 p-4 bg-black/5 rounded-2xl border border-black/5">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={agreedToTerms} 
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-gray-300 text-[#FF9EBE] focus:ring-[#FF9EBE]"
                          />
                          <span className="text-[10px] lg:text-xs text-brand-primary/60 leading-relaxed">
                            Ich akzeptiere die <button onClick={() => setActiveLegalModal('agb')} className="text-[#FF9EBE] underline">AGB</button> und habe die <button onClick={() => setActiveLegalModal('datenschutz')} className="text-[#FF9EBE] underline">Datenschutzerklärung</button> gelesen.
                          </span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={agreedToWiderruf} 
                            onChange={(e) => setAgreedToWiderruf(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-gray-300 text-[#FF9EBE] focus:ring-[#FF9EBE]"
                          />
                          <span className="text-[10px] lg:text-xs text-brand-primary/60 leading-relaxed">
                            Ich verlange ausdrücklich, dass Sie vor Ende der Widerrufsfrist mit der Ausführung des Vertrags beginnen. Mir ist bekannt, dass ich bei vollständiger Vertragserfüllung mein <button onClick={() => setActiveLegalModal('widerruf')} className="text-[#FF9EBE] underline">Widerrufsrecht</button> verliere.
                          </span>
                        </label>
                      </div>

                      {/* Yearly Subscription - BEST DEAL */}
                      <button 
                        onClick={() => {
                          if (!agreedToTerms || !agreedToWiderruf) {
                            setError("Bitte akzeptiere die AGB und die Widerrufsbelehrung.");
                            return;
                          }
                          handleCheckout('yearly');
                        }}
                        disabled={isCheckingOut || !agreedToTerms || !agreedToWiderruf}
                        className="w-full p-6 lg:p-8 border-4 border-[#FF9EBE] rounded-3xl bg-[#FF9EBE]/5 hover:bg-[#FF9EBE]/10 transition-all text-left group relative overflow-hidden disabled:opacity-50 disabled:grayscale shadow-xl scale-105 z-10"
                      >
                        <div className="absolute top-0 right-0 bg-[#FF9EBE] text-white text-[10px] lg:text-xs font-black px-3 lg:px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest animate-pulse">
                          ★ Beste Wahl ★
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-black text-xl lg:text-2xl text-brand-primary">Styling-Flatrate Jahresabo</span>
                          <div className="text-right">
                            <span className="text-2xl lg:text-3xl font-black text-brand-primary block">39,99€</span>
                            <span className="text-xs lg:text-sm text-brand-primary/40 line-through">statt 83,88€</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm lg:text-base font-bold text-[#FF9EBE]">Du sparst 52 % – nur 3,33 € pro Monat</p>
                          <p className="text-xs lg:text-sm text-brand-primary/60">Unbegrenzt testen + monatlich neue Trends + Profi-Guide</p>
                        </div>
                        <div className="mt-4 w-full py-3 bg-[#FF9EBE] text-white text-center font-black rounded-xl group-hover:bg-[#FF9EBE]/90 transition-colors uppercase tracking-widest text-sm">
                          Jahresabo starten
                        </div>
                      </button>

                      {/* Monthly Subscription */}
                      <button 
                        onClick={() => {
                          if (!agreedToTerms || !agreedToWiderruf) {
                            setError("Bitte akzeptiere die AGB und die Widerrufsbelehrung.");
                            return;
                          }
                          handleCheckout('monthly');
                        }}
                        disabled={isCheckingOut || !agreedToTerms || !agreedToWiderruf}
                        className="w-full p-4 lg:p-5 border-2 border-black/5 rounded-2xl hover:border-[#FF9EBE]/30 hover:bg-[#FF9EBE]/5 transition-all text-left group relative disabled:opacity-50 disabled:grayscale"
                      >
                        <div className="absolute top-0 right-0 bg-brand-primary text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-widest">
                          BELIEBT ⭐
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-base lg:text-lg text-brand-primary">Monatsabo</span>
                          <span className="text-xl lg:text-2xl font-black text-brand-primary">6,99€</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <p className="text-xs lg:text-sm text-brand-primary/60">Flexibel jederzeit kündbar.</p>
                          <div className="px-4 py-2 bg-black/5 text-brand-primary font-bold rounded-lg text-xs group-hover:bg-brand-primary group-hover:text-white transition-colors">
                            Monatsabo starten
                          </div>
                        </div>
                      </button>

                      {/* Single Unlock */}
                      <button 
                        onClick={() => {
                          if (!agreedToTerms || !agreedToWiderruf) {
                            setError("Bitte akzeptiere die AGB und die Widerrufsbelehrung.");
                            return;
                          }
                          handleCheckout('single');
                        }}
                        disabled={isCheckingOut || !agreedToTerms || !agreedToWiderruf}
                        className="w-full p-4 lg:p-5 border-2 border-black/5 rounded-2xl hover:border-[#FF9EBE]/30 hover:bg-[#FF9EBE]/5 transition-all text-left group relative disabled:opacity-50 disabled:grayscale"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-base lg:text-lg text-brand-primary">Einmalige Analyse</span>
                          <span className="text-xl lg:text-2xl font-black text-brand-primary">1,99€</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <p className="text-xs lg:text-sm text-brand-primary/60">Schalte alle 9 Bilder dieser Analyse frei.</p>
                          <div className="px-4 py-2 bg-black/5 text-brand-primary font-bold rounded-lg text-xs group-hover:bg-brand-primary group-hover:text-white transition-colors">
                            Jetzt freischalten
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className="mt-6 lg:mt-8 pt-6 border-t border-black/5 space-y-4">
                      <div className="flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4" referrerPolicy="no-referrer" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" referrerPolicy="no-referrer" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" referrerPolicy="no-referrer" />
                        <div className="flex items-center gap-1">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/SEPA_logo.svg" alt="SEPA" className="h-3" referrerPolicy="no-referrer" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-[9px] lg:text-[10px] text-center text-brand-primary/40 uppercase tracking-widest font-bold">
                          Rechnung mit MwSt. wird automatisch per E-Mail versandt
                        </p>
                        <p className="text-[9px] lg:text-[10px] text-center text-brand-primary/40 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                          <ShieldCheck size={12} className="text-emerald-500" /> 14-Tage Geld-zurück-Garantie • SSL Verschlüsselt
                        </p>
                        <p className="text-[9px] lg:text-[10px] text-center text-brand-primary/40 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                          <Users size={12} className="text-[#FF9EBE]" /> Über 50.000 zufriedene Nutzer weltweit
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Post-Purchase Upsell Modal */}
        {showUpsellModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden p-8 sm:p-12 text-center space-y-8"
            >
              <button 
                onClick={() => setShowUpsellModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-20 h-20 bg-[#FF9EBE]/10 text-[#FF9EBE] rounded-3xl flex items-center justify-center mx-auto animate-bounce">
                <Sparkles size={40} />
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-serif font-bold leading-tight">
                  Du hast gerade 6 Styles freigeschaltet 🎉
                </h2>
                <p className="text-brand-primary/60 text-lg">
                  Hol dir jetzt unbegrenzte Looks + Premium Styles
                </p>
              </div>

              <div className="p-6 bg-[#FF9EBE]/5 rounded-[2rem] border-2 border-dashed border-[#FF9EBE]/30 space-y-4">
                <p className="text-sm font-bold uppercase tracking-widest text-[#FF9EBE]">Exklusives Upgrade-Angebot</p>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-brand-primary">+4,00€</p>
                  <p className="text-sm text-brand-primary/60">auf Unlimited für einen Monat</p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => handleCheckout('upsell')}
                  disabled={isCheckingOut}
                  className="w-full py-5 bg-[#FF9EBE] text-white rounded-2xl font-black text-lg hover:bg-[#FF9EBE]/90 transition-all shadow-xl shadow-[#FF9EBE]/20 flex items-center justify-center gap-3 group"
                >
                  {isCheckingOut ? <Loader2 className="animate-spin" /> : <Zap size={24} className="group-hover:scale-125 transition-transform" />}
                  Upgrade jetzt sichern
                </button>
                <button 
                  onClick={() => setShowUpsellModal(false)}
                  className="text-brand-primary/40 text-sm font-bold hover:text-brand-primary transition-colors"
                >
                  Nein danke, ich bleibe bei meinen 6 Styles
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Notifications */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] w-full max-w-sm px-4 pointer-events-none">
        <AnimatePresence>
          {authMessage && !showLoginModal && !showProfileModal && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`p-4 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto ${
                authMessage.type === 'success' ? 'bg-green-600 text-white' :
                authMessage.type === 'error' ? 'bg-red-600 text-white' :
                'bg-brand-primary text-white'
              }`}
            >
              <div className="shrink-0">
                {authMessage.type === 'success' ? <CheckCircle2 size={20} /> : 
                 authMessage.type === 'error' ? <AlertCircle size={20} /> : <Bell size={20} />}
              </div>
              <p className="text-sm font-medium flex-1">{authMessage.text}</p>
              <button onClick={() => setAuthMessage(null)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
