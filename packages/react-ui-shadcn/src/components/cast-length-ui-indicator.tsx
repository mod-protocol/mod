import { useTextLength } from "@mod-protocol/react-editor";

type Props = {
  getText: () => string;
};

export function CastLengthUIIndicator({ getText }: Props) {
  const { length, label, tailwindColor } = useTextLength({
    getText,
    maxByteLength: 320,
  });
  return <div className="my-2 ml-2 text-sm">{label}</div>;
}
