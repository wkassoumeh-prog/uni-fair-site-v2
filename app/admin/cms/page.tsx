"use client";

import Link from "next/link";

export default function CmsHome() {
  const items = [
    {
      title: "About section",
      desc: "Edit the About paragraph text.",
      href: "/admin/cms/about",
    },
    {
      title: "Sponsors section",
      desc: "Manage sponsor logos, names, and links.",
      href: "/admin/cms/sponsors",
    },
    {
      title: "FAQ section",
      desc: "Add/edit/reorder/publish FAQs.",
      href: "/admin/cms/faq",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">CMS</h1>
        <p className="text-sm opacity-70">Choose a section to edit.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((x) => (
          <Link
            key={x.href}
            href={x.href}
            className="rounded-xl border bg-white p-4 hover:shadow-sm transition"
          >
            <div className="font-semibold">{x.title}</div>
            <div className="text-sm opacity-70 mt-1">{x.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
