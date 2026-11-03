
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignInPage() {
  const router = useRouter();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const email = formData.get('email') 
    const password = formData.get('password') 

    const { data, error: signInError } =
      await authClient.signIn.email({
        email,
        password,
      });

    if (signInError) {
      setError(
        signInError.message || 'Invalid email or password.'
      );
      setLoading(false);
      return;
    }

    if (data) {
      router.push('/');
      router.refresh();
    }

    setLoading(false);
  };

 const handleGoogleSignin = async () => {
   setError(null);

   await authClient.signIn.social({
     provider: 'google',
     callbackURL: '/',
   });
 };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto my-10 px-4">
      <Card>
        <CardContent>
          <form onSubmit={handleSignIn}>
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleSignin}
                >
                  Login with Google
                </Button>
              </Field>

              <FieldSeparator>
                Or continue with email
              </FieldSeparator>

              <Field>
                <FieldLabel htmlFor="email">
                  Email
                </FieldLabel>

                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">
                  Password
                </FieldLabel>

                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  minLength={6}
                  required
                />
              </Field>

              {error && (
                <p className="text-sm text-red-500">
                  {error}
                </p>
              )}

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>

                <FieldDescription className="text-center">
                  Don't have an account?{' '}
                  <Link href="/sign-up" className="underline">
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
