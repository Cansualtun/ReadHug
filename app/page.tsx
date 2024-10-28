import ClientHome from "@/components/home/home";


export default function Home() {

  return (
    <section className="flex flex-col items-center justify-center gap-4 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <p>Selam</p>
        <ClientHome />
      </div>
    </section>
  );
}
