import { existsSync } from "node:fs";
import path from "node:path";
import { About } from "@/components/About";
import { Certificates } from "@/components/Certificates";
import { Contact } from "@/components/Contact";
import { Cursor } from "@/components/Cursor";
import { Hero } from "@/components/Hero";
import { Internship } from "@/components/Internship";
import { LeaveConfirm } from "@/components/LeaveConfirm";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";
import { Reflection } from "@/components/Reflection";
import { SkillsKeyboard } from "@/components/SkillsKeyboard";
import { SoftSkills } from "@/components/SoftSkills";
import { TypingGame } from "@/components/TypingGame";

export default function Home() {
  // Drop a resume.pdf into /public and the download link appears by itself.
  const hasResume = existsSync(path.join(process.cwd(), "public", "resume.pdf"));
  return (
    <>
      <Cursor />
      <div className="grain" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Projects />
        <SkillsKeyboard />
        <SoftSkills />
        <TypingGame />
        <About />
        <Certificates />
        <Internship />
        <Reflection />
      </main>
      <Contact hasResume={hasResume} />
      <LeaveConfirm />
    </>
  );
}
