import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/add-token" className="text-green-500">
        Proceed
      </Link>
    </div>
  );
}
