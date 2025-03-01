import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b border-b-gray-200 fixed w-full bg-background bg-gray-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-40">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-xl font-bold">TaskPilot</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 mt-20">
        <div className="container mx-auto py-12 max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: June 15, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p>
                TaskPilot (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
                respects your privacy and is committed to protecting your
                personal data. This privacy policy will inform you about how we
                look after your personal data when you visit our website and
                tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                The Data We Collect
              </h2>
              <p>
                We may collect, use, store and transfer different kinds of
                personal data about you which we have grouped together as
                follows:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  <strong>Identity Data</strong> includes first name, last name,
                  username or similar identifier.
                </li>
                <li>
                  <strong>Contact Data</strong> includes email address.
                </li>
                <li>
                  <strong>Technical Data</strong> includes internet protocol
                  (IP) address, browser type and version, time zone setting and
                  location, browser plug-in types and versions, operating system
                  and platform, and other technology on the devices you use to
                  access this website.
                </li>
                <li>
                  <strong>Usage Data</strong> includes information about how you
                  use our website and services.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                How We Use Your Data
              </h2>
              <p>
                We will only use your personal data when the law allows us to.
                Most commonly, we will use your personal data in the following
                circumstances:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>To register you as a new user.</li>
                <li>To provide and improve our services.</li>
                <li>To manage our relationship with you.</li>
                <li>To administer and protect our business and website.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent
                your personal data from being accidentally lost, used, or
                accessed in an unauthorized way, altered, or disclosed. In
                addition, we limit access to your personal data to those
                employees, agents, contractors, and other third parties who have
                a business need to know.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
              <p>
                We will only retain your personal data for as long as necessary
                to fulfill the purposes we collected it for, including for the
                purposes of satisfying any legal, accounting, or reporting
                requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Legal Rights</h2>
              <p>
                Under certain circumstances, you have rights under data
                protection laws in relation to your personal data, including the
                right to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Changes to This Privacy Policy
              </h2>
              <p>
                We may update our privacy policy from time to time. We will
                notify you of any changes by posting the new privacy policy on
                this page and updating the &quot;last updated&quot; date at the
                top of this privacy policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our
                privacy practices, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> arkar1712luffy@gmail.com
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            <p className="text-sm">© 2025 TaskPilot. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/privacy-policy"
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
            >
              Terms of Service
            </Link>
            <Link
              href="https://github.com/Kei-K23/task-pilot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
