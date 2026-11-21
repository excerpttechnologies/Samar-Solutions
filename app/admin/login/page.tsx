// import type { Metadata } from 'next'
// import Link from 'next/link'
// import { redirect } from 'next/navigation'
// import { ArrowLeft, ShieldCheck } from 'lucide-react'
// import { LoginForm } from '@/components/admin/login-form'
// import { Wordmark } from '@/components/wordmark'
// import { getAdminSession } from '@/lib/auth'

// export const dynamic = 'force-dynamic'

// export const metadata: Metadata = {
//   title: 'Admin Sign In',
//   robots: { index: false, follow: false },
// }

// export default async function AdminLoginPage() {
//   const session = await getAdminSession()
//   if (session) redirect('/admin/dashboard')

//   return (
//     <main className="grid min-h-dvh bg-background lg:grid-cols-2">
//       <section className="relative hidden flex-col justify-between overflow-hidden bg-ink p-10 text-ink-foreground lg:flex xl:p-14">
//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full border border-ink-foreground/10"
//         />
//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -bottom-32 -left-20 size-[28rem] rounded-full border border-accent/20"
//         />
//         <div className="relative">
//           <Wordmark tone="light" />
//         </div>
//         <div className="relative max-w-lg">
//           <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
//             <span aria-hidden="true" className="h-px w-8 bg-accent" />
//             Website management
//           </p>
//           <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] xl:text-5xl">
//             One secure place to manage every published project.
//           </h1>
//           <p className="mt-5 text-pretty text-base leading-relaxed text-ink-foreground/70">
//             Update project details, photography, categories, and website contact information.
//             Published changes appear on the public site immediately.
//           </p>
//           <p className="mt-8 inline-flex items-center gap-2 rounded-md border border-ink-foreground/15 px-3 py-2 text-xs text-ink-foreground/70">
//             <ShieldCheck aria-hidden="true" className="size-4 text-accent" />
//             Single administrator account · No public registration
//           </p>
//         </div>
//         <p className="relative text-xs text-ink-foreground/50">
//           © {new Date().getFullYear()} SAMAR SOLUTIONS INDIA PVT. LTD.
//         </p>
//       </section>

//       <section className="flex items-center justify-center px-4 py-12 sm:px-8">
//         <div className="w-full max-w-md">
//           <div className="mb-10 lg:hidden">
//             <Wordmark />
//           </div>
//           <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
//             Admin access
//           </p>
//           <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
//             Sign in to your dashboard
//           </h1>
//           <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
//             Enter the credentials for the authorized administrator account.
//           </p>
//           <div className="mt-8">
//             <LoginForm />
//           </div>
//           <Link
//             href="/"
//             className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
//           >
//             <ArrowLeft aria-hidden="true" className="size-4" />
//             Back to website
//           </Link>
//         </div>
//       </section>
//     </main>
//   )
// }
