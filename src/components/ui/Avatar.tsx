import Image from "next/image";

type AvatarProps = {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeMap = { sm: 32, md: 40, lg: 56, xl: 80 };
const textSizeMap = { sm: "text-sm", md: "text-base", lg: "text-xl", xl: "text-2xl" };

export function Avatar({ src, name, size = "md" }: AvatarProps) {
  const px = sizeMap[size];
  const initials = name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "?";

  return (
    <div
      className="rounded-full overflow-hidden bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center shrink-0"
      style={{ width: px, height: px }}
    >
      {src ? (
        <Image
          src={src}
          alt={name ?? "avatar"}
          width={px}
          height={px}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className={`text-white font-bold ${textSizeMap[size]}`}>{initials}</span>
      )}
    </div>
  );
}
