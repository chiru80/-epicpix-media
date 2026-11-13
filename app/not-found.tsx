import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <h1 className="text-4xl font-display mb-4 text-foreground">Page Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Go Home
      </Link>
    </main>
  );
}
