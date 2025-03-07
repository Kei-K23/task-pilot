import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b border-b-gray-200 dark:border-b-gray-800 fixed w-full bg-background bg-gray-300 dark:bg-gray-900 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-40 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Link href={"/"} className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-xl font-bold">TaskPilot</span>
          </Link>
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
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: June 15, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                Welcome to TaskPilot (&quot;Company&quot;, &quot;we&quot;,
                &quot;our&quot;, &quot;us&quot;)! These Terms of Service
                (&quot;Terms&quot;, &quot;Terms of Service&quot;) govern your
                use of our website and software application TaskPilot (together
                or individually &quot;Service&quot;) operated by TaskPilot.
              </p>
              <p className="mt-2">
                Our Privacy Policy also governs your use of our Service and
                explains how we collect, safeguard and disclose information that
                results from your use of our web pages. Your agreement with us
                includes these Terms and our Privacy Policy
                (&quot;Agreements&quot;). You acknowledge that you have read and
                understood Agreements, and agree to be bound by them.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Communications</h2>
              <p>
                By using our Service, you agree to subscribe to newsletters,
                marketing or promotional materials and other information we may
                send. However, you may opt out of receiving any, or all, of
                these communications from us by following the unsubscribe link
                or by emailing us at support@taskpilot.dev.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Purchases</h2>
              <p>
                If you wish to purchase any product or service made available
                through the Service (&quot;Purchase&quot;), you may be asked to
                supply certain information relevant to your Purchase including
                your credit card number, the expiration date of your credit
                card, your billing address, and your shipping information.
              </p>
              <p className="mt-2">
                You represent and warrant that: (i) you have the legal right to
                use any credit card(s) or other payment method(s) in connection
                with any Purchase; and that (ii) the information you supply to
                us is true, correct and complete.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Content</h2>
              <p>
                Our Service allows you to post, link, store, share and otherwise
                make available certain information, text, graphics, videos, or
                other material (&quot;Content&quot;). You are responsible for
                the Content that you post on or through the Service, including
                its legality, reliability, and appropriateness.
              </p>
              <p className="mt-2">
                By posting Content on or through the Service, You represent and
                warrant that: (i) the Content is yours (you own it) and/or you
                have the right to use it and the right to grant us the rights
                and license as provided in these Terms, and (ii) that the
                posting of your Content on or through the Service does not
                violate the privacy rights, publicity rights, copyrights,
                contract rights or any other rights of any person or entity.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                5. Prohibited Uses
              </h2>
              <p>
                You may use the Service only for lawful purposes and in
                accordance with Terms. You agree not to use the Service:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  In any way that violates any applicable national or
                  international law or regulation.
                </li>
                <li>
                  For the purpose of exploiting, harming, or attempting to
                  exploit or harm minors in any way.
                </li>
                <li>
                  To transmit, or procure the sending of, any advertising or
                  promotional material, including any &quot;junk mail&quot;,
                  &quot;chain letter,&quot; &quot;spam,&quot; or any other
                  similar solicitation.
                </li>
                <li>
                  To impersonate or attempt to impersonate Company, a Company
                  employee, another user, or any other person or entity.
                </li>
                <li>
                  In any way that infringes upon the rights of others, or in any
                  way is illegal, threatening, fraudulent, or harmful, or in
                  connection with any unlawful, illegal, fraudulent, or harmful
                  purpose or activity.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                6. Intellectual Property
              </h2>
              <p>
                The Service and its original content (excluding Content provided
                by users), features and functionality are and will remain the
                exclusive property of TaskPilot and its licensors. The Service
                is protected by copyright, trademark, and other laws of both the
                United States and foreign countries. Our trademarks and trade
                dress may not be used in connection with any product or service
                without the prior written consent of TaskPilot.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                7. Open Source License
              </h2>
              <p>
                TaskPilot is provided under the MIT License. You are free to
                use, modify, and distribute the software according to the terms
                of this license.
              </p>
              <p className="mt-2">
                The MIT License grants permission, free of charge, to any person
                obtaining a copy of this software and associated documentation
                files, to deal in the Software without restriction, including
                without limitation the rights to use, copy, modify, merge,
                publish, distribute, sublicense, and/or sell copies of the
                Software.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the
                Service immediately, without prior notice or liability, under
                our sole discretion, for any reason whatsoever and without
                limitation, including but not limited to a breach of the Terms.
              </p>
              <p className="mt-2">
                If you wish to terminate your account, you may simply
                discontinue using the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                9. Limitation of Liability
              </h2>
              <p>
                In no event shall TaskPilot, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses, resulting from (i)
                your access to or use of or inability to access or use the
                Service; (ii) any conduct or content of any third party on the
                Service; (iii) any content obtained from the Service; and (iv)
                unauthorized access, use or alteration of your transmissions or
                content, whether based on warranty, contract, tort (including
                negligence) or any other legal theory, whether or not we have
                been informed of the possibility of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                10. Changes to Terms
              </h2>
              <p>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material we
                will provide at least 30 days&apos; notice prior to any new
                terms taking effect. What constitutes a material change will be
                determined at our sole discretion.
              </p>
              <p className="mt-2">
                By continuing to access or use our Service after any revisions
                become effective, you agree to be bound by the revised terms. If
                you do not agree to the new terms, you are no longer authorized
                to use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us
                at:
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
