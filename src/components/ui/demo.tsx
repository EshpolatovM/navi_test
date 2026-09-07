import TopoField from "@/components/ui/topo-field";

export default function TopoFieldDemo() {
  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-xl bg-[#dbe4f7]">
      <TopoField className="absolute inset-0" mode="light" />
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <p className="px-6 text-center text-2xl font-light tracking-tight text-blue-900">
          Animated topographic background
        </p>
      </div>
    </div>
  );
}