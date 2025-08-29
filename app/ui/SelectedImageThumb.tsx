import Image from "next/image";

interface Props {
  src?: string;
}

const SelectedImageThumb = ({ src }: Props) => {
  if (!src) return null;

  return (
    <div className="w-20 h-20 relative">
      <Image
        src={src}
        alt="product"
        fill
        sizes="w-20 h-20"
        className="object-fill rounded bg-blue-gray-200"
        priority={true}
      />
    </div>
  );
};

export default SelectedImageThumb;
