// app/admin/page.tsx
'use client';
import AdminPanel from '@/components/AdminPanel';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }
    console.log(session?.user.isAdmin);
    if (session?.user && !session.user.isAdmin) {
      redirect('/');
    }
    
    if (session?.user?.isAdmin) {
      setIsAdmin(true);
    }
  }, [status, session]);

  if (status === 'loading') return <div>Loading...</div>;
  
  return isAdmin ? <AdminPanel /> : null;
}