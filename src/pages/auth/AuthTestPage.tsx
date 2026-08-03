import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Logo, Button } from '../../components/ui';
import { Check, X, AlertCircle, User, Database, Shield, RefreshCw } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

export function AuthTestPage() {
  const { user, session, loading: authLoading, signUp, signIn, signOut } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState(`test${Date.now()}@example.com`);
  const [testPassword, setTestPassword] = useState('Test123456!');
  const [testName, setTestName] = useState('Test User');
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);

  const addResult = (name: string, status: 'pending' | 'success' | 'error', message: string, details?: any) => {
    setResults(prev => [...prev.filter(r => r.name !== name), { name, status, message, details }]);
  };

  const clearResults = () => setResults([]);

  const testConnection = async () => {
    addResult('Supabase Connection', 'pending', 'Testing...');
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) {
        addResult('Supabase Connection', 'error', `Failed: ${error.message}`, error);
        return false;
      }
      addResult('Supabase Connection', 'success', 'Connected to Supabase successfully');
      return true;
    } catch (error: any) {
      addResult('Supabase Connection', 'error', `Exception: ${error.message}`, error);
      return false;
    }
  };

  const testSession = async () => {
    addResult('Session Check', 'pending', 'Checking...');
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (currentSession) {
        addResult('Session Check', 'success', `Active session for: ${currentSession.user.email}`, {
          userId: currentSession.user.id,
          email: currentSession.user.email
        });
      } else {
        addResult('Session Check', 'success', 'No active session (user not logged in)');
      }
      return true;
    } catch (error: any) {
      addResult('Session Check', 'error', `Failed: ${error.message}`, error);
      return false;
    }
  };

  const testSignUp = async () => {
    addResult('Sign Up Test', 'pending', `Creating user: ${testEmail}`);
    try {
      console.log('[AuthTest] Testing signup for:', testEmail);

      const result = await signUp(testEmail, testPassword, testName);

      console.log('[AuthTest] SignUp result:', result);

      if (result.error) {
        addResult('Sign Up Test', 'error', `Sign up failed: ${result.error.message}`, result.error);
        return false;
      }

      if (result.data?.user) {
        setCreatedUserId(result.data.user.id);

        if (result.data.session) {
          addResult('Sign Up Test', 'success',
            `User created and logged in!\nUser ID: ${result.data.user.id}\nEmail: ${result.data.user.email}`,
            result.data
          );
        } else if (result.data.needsEmailConfirmation) {
          addResult('Sign Up Test', 'success',
            `User created but needs email confirmation.\nUser ID: ${result.data.user.id}\nEmail: ${result.data.user.email}`,
            result.data
          );
        } else {
          addResult('Sign Up Test', 'success',
            `User created.\nUser ID: ${result.data.user.id}`,
            result.data
          );
        }
        return true;
      } else {
        addResult('Sign Up Test', 'error', 'No user returned from signup', result);
        return false;
      }
    } catch (error: any) {
      console.error('[AuthTest] SignUp exception:', error);
      addResult('Sign Up Test', 'error', `Exception: ${error.message}`, error);
      return false;
    }
  };

  const testDirectSignUp = async () => {
    addResult('Direct Supabase SignUp', 'pending', 'Calling supabase.auth.signUp directly...');
    try {
      const uniqueEmail = `direct${Date.now()}@example.com`;
      console.log('[AuthTest] Direct signup for:', uniqueEmail);

      const { data, error } = await supabase.auth.signUp({
        email: uniqueEmail,
        password: 'Test123456!',
        options: {
          data: { full_name: 'Direct Test User' }
        }
      });

      console.log('[AuthTest] Direct signUp response:', { data, error });

      if (error) {
        addResult('Direct Supabase SignUp', 'error',
          `Error: ${error.message}\nStatus: ${error.status}\nName: ${error.name}`,
          error
        );
        return false;
      }

      if (data.user) {
        addResult('Direct Supabase SignUp', 'success',
          `User created!\nID: ${data.user.id}\nEmail: ${data.user.email}\nSession exists: ${!!data.session}`,
          { userId: data.user.id, hasSession: !!data.session }
        );
        return true;
      } else {
        addResult('Direct Supabase SignUp', 'error', 'No user in response', data);
        return false;
      }
    } catch (error: any) {
      console.error('[AuthTest] Direct signUp exception:', error);
      addResult('Direct Supabase SignUp', 'error', `Exception: ${error.message}`, error);
      return false;
    }
  };

  const testVerifyUserInDb = async () => {
    addResult('Database Verification', 'pending', 'Checking if user exists in database...');
    try {
      // Wait a moment for the trigger to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        addResult('Database Verification', 'error', `Query failed: ${error.message}`, error);
        return false;
      }

      if (users && users.length > 0) {
        addResult('Database Verification', 'success',
          `Found ${users.length} profile(s)\nLatest: ${users[0].full_name || users[0].id}`,
          users
        );
        return true;
      } else {
        addResult('Database Verification', 'error', 'No profiles found in database', users);
        return false;
      }
    } catch (error: any) {
      addResult('Database Verification', 'error', `Exception: ${error.message}`, error);
      return false;
    }
  };

  const testSignIn = async () => {
    addResult('Sign In Test', 'pending', `Attempting login for: ${testEmail}`);
    try {
      console.log('[AuthTest] Testing signin for:', testEmail);

      const result = await signIn(testEmail, testPassword);

      console.log('[AuthTest] SignIn result:', result);

      if (result.error) {
        addResult('Sign In Test', 'error', `Sign in failed: ${result.error.message}`, result.error);
        return false;
      }

      if (result.data?.session) {
        addResult('Sign In Test', 'success',
          `Login successful!\nUser: ${result.data.user?.email}\nSession expires: ${result.data.session.expires_at}`,
          result.data
        );
        return true;
      } else {
        addResult('Sign In Test', 'error', 'No session returned', result);
        return false;
      }
    } catch (error: any) {
      console.error('[AuthTest] SignIn exception:', error);
      addResult('Sign In Test', 'error', `Exception: ${error.message}`, error);
      return false;
    }
  };

  const runFullTest = async () => {
    setTesting(true);
    clearResults();

    await testConnection();
    await testSession();
    await testDirectSignUp();
    await testVerifyUserInDb();

    setTesting(false);
  };

  const testCompleteFlow = async () => {
    setTesting(true);
    clearResults();

    const email = `flow${Date.now()}@example.com`;
    setTestEmail(email);

    addResult('Full Flow Test', 'pending', `Starting complete auth flow test...\nEmail: ${email}`);

    // Step 1: Connection
    const connected = await testConnection();
    if (!connected) {
      addResult('Full Flow Test', 'error', 'Failed at connection step');
      setTesting(false);
      return;
    }

    // Step 2: Sign up
    addResult('Full Flow Test', 'pending', 'Step 1: Signing up...');
    const signupResult = await signUp(email, testPassword, 'Flow Test User');

    if (signupResult.error) {
      addResult('Full Flow Test', 'error', `Signup failed: ${signupResult.error.message}`);
      setTesting(false);
      return;
    }

    // Step 3: Check if we got a session
    if (signupResult.data?.session) {
      // User was auto-logged in
      addResult('Full Flow Test', 'success',
        `SUCCESS! User was automatically logged in after signup.\nEmail: ${email}`);
      setTesting(false);
      return;
    }

    // Step 4: If no session, try to login
    if (signupResult.data?.needsEmailConfirmation) {
      addResult('Full Flow Test', 'pending',
        `Email confirmation required. Trying to login anyway...`);

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));

      const signinResult = await signIn(email, testPassword);

      if (signinResult.error) {
        if (signinResult.error.message.includes('Email not confirmed')) {
          addResult('Full Flow Test', 'error',
            `Email confirmation IS REQUIRED for login.\nThis is a Supabase configuration setting.\n` +
            `Go to Supabase Dashboard > Authentication > Providers > Email\n` +
            `and DISABLE "Confirm email" to allow immediate login.`, signinResult.error);
        } else {
          addResult('Full Flow Test', 'error', `Login failed: ${signinResult.error.message}`);
        }
      } else {
        addResult('Full Flow Test', 'success', `SUCCESS! Login worked after confirmation.`);
      }
    } else {
      addResult('Full Flow Test', 'pending', `Unexpected state after signup`, signupResult);
    }

    setTesting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-luxury-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-3xl"
      >
        <div className="card-luxury p-8">
          <div className="text-center mb-8">
            <Logo size="lg" className="justify-center mb-6" />
            <h1 className="text-2xl font-display font-bold mb-2">Auth Diagnostics</h1>
            <p className="text-luxury-silver">Test and verify authentication configuration</p>
          </div>

          {/* Current Auth State */}
          <div className="mb-8 p-4 rounded-xl bg-luxury-charcoal/50 border border-gold-500/10">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Shield size={18} className="text-gold-400" />
              Current Auth State
            </h3>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-luxury-silver">Status:</span>
                <span className={authLoading ? 'text-yellow-400' : user ? 'text-green-400' : 'text-red-400'}>
                  {authLoading ? 'Loading...' : user ? 'Authenticated' : 'Not authenticated'}
                </span>
              </div>
              {user && (
                <>
                  <div className="flex justify-between">
                    <span className="text-luxury-silver">Email:</span>
                    <span className="text-luxury-pearl">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-luxury-silver">ID:</span>
                    <span className="text-luxury-pearl text-xs">{user.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-luxury-silver">Confirmed:</span>
                    <span className={user.email_confirmed_at ? 'text-green-400' : 'text-yellow-400'}>
                      {user.email_confirmed_at ? 'Yes' : 'No'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Test User Form */}
          <div className="mb-8 p-4 rounded-xl bg-luxury-charcoal/50 border border-gold-500/10">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User size={18} className="text-gold-400" />
              Test User
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-luxury-silver mb-1">Email</label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="input-luxury w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-luxury-silver mb-1">Password</label>
                <input
                  type="text"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="input-luxury w-full"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-8 grid grid-cols-2 gap-3">
            <Button onClick={runFullTest} loading={testing} disabled={testing} variant="secondary">
              Run Diagnostics
            </Button>
            <Button onClick={testCompleteFlow} loading={testing} disabled={testing} variant="primary">
              Test Full Auth Flow
            </Button>
          </div>

          {/* Test Results */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Database size={18} className="text-gold-400" />
              Test Results
            </h3>
            {results.length === 0 ? (
              <p className="text-sm text-luxury-silver">Click a button above to run tests</p>
            ) : (
              results.map((result, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg ${
                    result.status === 'success' ? 'bg-green-500/10 border border-green-500/20' :
                    result.status === 'error' ? 'bg-red-500/10 border border-red-500/20' :
                    'bg-yellow-500/10 border border-yellow-500/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.status === 'success' ? (
                      <Check size={18} className="text-green-400 mt-0.5 shrink-0" />
                    ) : result.status === 'error' ? (
                      <X size={18} className="text-red-400 mt-0.5 shrink-0" />
                    ) : (
                      <RefreshCw size={18} className="text-yellow-400 mt-0.5 shrink-0 animate-spin" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-luxury-pearl">{result.name}</p>
                      <pre className="text-xs text-luxury-silver whitespace-pre-wrap mt-1 break-words">
                        {result.message}
                      </pre>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-gold-400 hover:text-gold-300 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
