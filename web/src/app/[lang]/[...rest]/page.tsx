import { notFound } from "next/navigation";

/** Any unknown address inside a language (e.g. /en/old-page) shows the branded 404 within the site layout. */
export default function UnknownPage() {
  notFound();
}
