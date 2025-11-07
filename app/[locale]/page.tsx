import { redirect } from 'next/navigation';

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Redirect to dashboard
  redirect(`/${locale}/dashboard`);
}
