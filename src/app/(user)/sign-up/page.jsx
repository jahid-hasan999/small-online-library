'use client';


import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { toast } from 'react-toastify';

import { authClient } from '@/lib/auth-client';

export default function SignUpPage() {
  const router = useRouter();

 const handleSignup = async e => {
   e.preventDefault();

   const formData = new FormData(e.currentTarget);

   const name = formData.get('name');
   const imageUrl = formData.get('image');
   const image = imageUrl?.trim() || undefined;
   const email = formData.get('email');
   const password = formData.get('password');

   if (password.length < 6) {
     toast.error('Password must be at least 6 characters!');
     return;
   }

   if (!/[A-Z]/.test(password)) {
     toast.error('Password must contain an uppercase letter!');
     return;
   }

   if (!/[a-z]/.test(password)) {
     toast.error('Password must contain a lowercase letter!');
     return;
   }

   const { data, error } = await authClient.signUp.email({
     name,
     image,
     email,
     password,
   });

   if (error) {
     console.log(error.message);
     return;
   }

   if (data) {
     router.push('/');
   }
 };

  const handleGoogleSignup = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto my-10 px-4">
      <Card>
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold">Create Account</h1>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignup}>
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleSignup}
                >
                  Sign In with Google
                </Button>
              </Field>

              <FieldSeparator>Or continue with email</FieldSeparator>

              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="image">Image URL</FieldLabel>
                <Input
                  id="image"
                  type="url"
                  name="image"
                  placeholder="Image URL"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  minLength={6}
                  required
                />
              </Field>

              <Field>
                <Button type="submit">Sign Up</Button>

                <FieldDescription className="text-center">
                  Have an account?{' '}
                  <Link href="/sign-in" className="underline">
                    Login
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
