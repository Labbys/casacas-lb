import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, CheckCircle2, ImagePlus, Settings2, Tags } from "lucide-react";
import { Link, useLocation } from "wouter";

const content = { categories: { kicker: "ORGANIZACIÓN / CATEGORÍAS", title: "Ordená el catálogo.", description: "Las categorías iniciales ya están previstas: Indumentaria, Accesorios, UV & Vinilo y Banderas.", icon: Tags, items: ["Indumentaria", "Accesorios", "UV & Vinilo", "Banderas"] }, settings: { kicker: "NEGOCIO / CONFIGURACIÓN", title: "Tu información.", description: "Acá vas a poder actualizar WhatsApp, Instagram, horarios, dirección y textos del inicio.", icon: Settings2, items: ["Instagram oficial: @casacaslb", "WhatsApp: +54 9 3735 549290", "Local: Av. General Jones, Las Breñas", "Logo real de CASACAS LB"] } } as const;

export default function AdminPlaceholder() {
  const [location] = useLocation();
  const key = location.includes("categories") ? "categories" : "settings";
  const section = content[key];
  const Icon = section.icon;
  return <DashboardLayout><div className="mx-auto max-w-[1100px]"><Link href="/admin" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#81796e] transition hover:text-[#f33825]"><ArrowLeft className="h-4 w-4" /> Volver al resumen</Link><div className="mt-8 rounded-[30px] border border-[#d9d1c5] bg-[#f8f5ef] p-7 shadow-[0_16px_50px_rgba(40,34,27,.06)] sm:p-10"><div className="flex h-14 w-14 rotate-[-6deg] items-center justify-center rounded-2xl bg-[#f33825] text-white"><Icon /></div><p className="casacas-kicker mt-8">{section.kicker}</p><h1 className="mt-3 font-display text-7xl leading-[.8] text-[#211f1c]">{section.title}</h1><p className="mt-6 max-w-2xl text-sm leading-7 text-[#706a62]">{section.description}</p><div className="mt-10 grid gap-3 sm:grid-cols-2">{section.items.map(item => <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#d9d1c5] bg-[#eee9df] p-4 text-sm font-semibold text-[#211f1c]"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#f33825]" />{item}</div>)}</div><div className="mt-10 flex items-center gap-3 border-t border-[#d9d1c5] pt-6 text-xs text-[#81796e]"><ImagePlus className="h-4 w-4 text-[#f33825]" /> Módulo de edición en la siguiente iteración del panel.</div></div></div></DashboardLayout>;
}
