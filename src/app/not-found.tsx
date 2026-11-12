import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-28 text-center">
      <p className="tabular font-display text-6xl font-extrabold text-maroon-700">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-navy-900">This page could not be found</h1>
      <p className="mx-auto mt-3 max-w-[48ch] text-steel-600">The address may have changed. Use the menu above, or return to the home page.</p>
      <div className="mt-8 flex justify-center">
        <ButtonLink href="/">Back to home</ButtonLink>
      </div>
    </Container>
  );
}
