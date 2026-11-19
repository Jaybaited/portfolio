import Image from "next/image";
import type { Project } from "@/lib/content";

/** A project screenshot with the browser bar cropped off the top. */
export function Shot({
  image,
  sizes,
  className = "",
  color = false,
}: {
  image: NonNullable<Project["image"]>;
  sizes: string;
  className?: string;
  color?: boolean;
}) {
  const crop = image.cropTop ?? 0;
  const visibleH = image.h - crop;
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: `${image.w} / ${visibleH}` }}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.w}
        height={image.h}
        sizes={sizes}
        className={`absolute left-0 w-full max-w-none transition-[filter,transform] duration-700 ease-out ${
          color ? "" : "saturate-[0.85] group-hover:saturate-100"
        }`}
        style={{ top: `-${(crop / visibleH) * 100}%`, height: "auto" }}
      />
    </div>
  );
}
