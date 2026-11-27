import type { Metadata } from "next";
import { enAlternates } from "@/data/en";
import VisitBlock from "@/components/en/VisitBlock";

export const metadata: Metadata = {
  title: "Visit us – Knud Pedersen, Skt. Clemens Torv 6, Aarhus",
  description: "Opening hours, address and appointments at Knud Pedersen, Skt. Clemens Torv 6, 8000 Aarhus C, Denmark. Phone +45 86 12 17 99.",
  alternates: enAlternates("/en/visit"),
};

export default function VisitEn() {
  return (
    <>
      <section className="container page-head jw-head">
        <span className="label">Visit us</span>
        <h1>Opening hours and appointments</h1>
        <p className="lead">You are always welcome to drop in for a chat. If you would like to see something specific, book an appointment and we will have it ready for you.</p>
      </section>
      <VisitBlock />
    </>
  );
}
