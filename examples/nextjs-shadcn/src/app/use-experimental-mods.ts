import { useSearchParams } from "next/navigation";

export const useExperimentalMods = (): boolean => {
  const searchParams = useSearchParams();

  const EXPERIMENTAL_MODS =
    process.env.NEXT_PUBLIC_EXPERIMENTAL_MODS === "true" ||
    searchParams.get("experimental") === "true";

  return EXPERIMENTAL_MODS;
};
