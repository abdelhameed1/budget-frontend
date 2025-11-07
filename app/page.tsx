import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  // Get saved locale from cookie
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get('NEXT_LOCALE')?.value;
  
  // Redirect to saved locale or default to Arabic
  const locale = savedLocale && ['ar', 'en'].includes(savedLocale) ? savedLocale : 'ar';
  redirect(`/${locale}`);
}
