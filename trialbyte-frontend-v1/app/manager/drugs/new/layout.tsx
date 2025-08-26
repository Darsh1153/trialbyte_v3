import { DrugFormProvider } from "./context/drug-form-context";

export default function DrugNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DrugFormProvider>{children}</DrugFormProvider>;
}
