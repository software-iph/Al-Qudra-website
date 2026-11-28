import { Kicker } from "./Blocks";
import { Reveal } from "./Motion";
import { SmartVideo } from "./SmartVideo";

/** Real on-site film in a 4px frame, a dark base for the text and a play/pause control (IPH B6: moving content can be paused). */
export function VideoFeature({
  src,
  eyebrow,
  title,
  text,
  labels,
}: {
  src: string;
  eyebrow: string;
  title: string;
  text: string;
  labels: { play: string; pause: string };
}) {
  if (!src) return null;
  return (
    <section className="on-dark bg-basalt-900 py-16 sm:py-20">
      <div className="container-x">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-basalt-800 sm:aspect-video lg:aspect-[21/9]">
            <SmartVideo src={src} toggle labels={labels} className="absolute inset-0 size-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-basalt-950/90 via-basalt-950/20 to-transparent" aria-hidden />
            <div className="absolute inset-x-6 bottom-24 text-paper sm:inset-x-12 sm:bottom-12 sm:max-w-xl">
              <Kicker light>{eyebrow}</Kicker>
              <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-[-0.03em] sm:text-5xl rtl:leading-[1.35] rtl:tracking-normal">{title}</h2>
              <p className="mt-4 text-base leading-relaxed text-steel-200 sm:text-lg">{text}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
