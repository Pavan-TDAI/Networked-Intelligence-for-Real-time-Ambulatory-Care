import { NavLink } from "react-router-dom";
import {
  Activity,
  CalendarClock,
  ClipboardList,
  LayoutDashboard,
  Languages,
  ShieldCheck,
  Sparkles,
  User2,
  Wrench,
  LogOut,
  Menu,
  X,
  Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "../ui/Button";
import { NiraLogo, NiraLogoMini } from "../ui/NiraLogo";
import { cn } from "../../lib/utils";
import { useDemoData } from "../../app/DemoDataProvider";
import { getCurrentProfile } from "../../features/shared/selectors";

function getNavLinks(role) {
  if (role === "patient") {
    return [
      { to: "/patient", label: "Home", icon: Activity },
      { to: "/patient/appointments", label: "Appointments", icon: ClipboardList },
      { to: "/patient/booking", label: "Booking", icon: CalendarClock },
      { to: "/patient/prescriptions", label: "Prescriptions", icon: ShieldCheck },
      { to: "/patient/tools", label: "AI Tools", icon: Wrench },
      { to: "/patient/profile", label: "Profile", icon: User2 }
    ];
  }

  if (role === "doctor") {
    return [
      { to: "/doctor", label: "Dashboard", icon: LayoutDashboard },
      { to: "/doctor/availability", label: "Availability", icon: CalendarClock },
      { to: "/doctor/tools", label: "AI Tools", icon: Wrench },
      { to: "/doctor/profile", label: "Profile", icon: User2 }
    ];
  }

  if (role === "admin") {
    return [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/doctors", label: "Doctors", icon: Activity },
      { to: "/admin/appointments", label: "Appointments", icon: CalendarClock },
      { to: "/admin/patients", label: "Patients", icon: User2 },
      { to: "/admin/tools", label: "AI Tools", icon: Wrench },
      { to: "/admin/profile", label: "Profile", icon: ShieldCheck }
    ];
  }

  return [{ to: "/auth", label: "Auth", icon: Sparkles }];
}

export function AppShell({ title, subtitle, actions, children, languageLabel = "English / Hindi" }) {
  const { state, actions: appActions } = useDemoData();
  const profile = state ? getCurrentProfile(state) : null;
  const navLinks = getNavLinks(state?.session?.role || null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-40 border-b border-line/50 backdrop-blur-2xl" style={{ background: "rgba(248,249,252,0.85)" }}>
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <NiraLogo className="h-9" />
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1.5 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to.split("/").length <= 2}
                className={({ isActive }) =>
                  isActive ? "nav-pill-active" : "nav-pill-inactive"
                }
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Language */}
            <div className="hidden items-center gap-1.5 rounded-lg border border-line/50 bg-white/60 px-3 py-1.5 text-[11px] font-semibold text-muted md:flex">
              <Languages className="h-3.5 w-3.5 text-brand-tide" />
              {languageLabel}
            </div>

            {/* Notifications bell */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 text-muted transition hover:bg-white hover:text-ink hover:shadow-sm">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-coral text-[9px] font-bold text-white">3</span>
            </button>

            {/* Profile chip */}
            {profile ? (
              <div className="hidden items-center gap-2 rounded-xl border border-line/50 bg-white/60 px-3 py-1.5 md:flex">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-midnight text-[10px] font-bold text-white">
                  {profile.fullName?.charAt(0) || "U"}
                </div>
                <span className="text-[12px] font-semibold text-ink">{profile.fullName}</span>
              </div>
            ) : null}

            {/* Logout */}
            {state?.session?.isAuthenticated ? (
              <button
                onClick={() => appActions.auth.logout()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 text-muted transition hover:bg-red-50 hover:text-brand-coral"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            ) : null}

            {/* Mobile toggle */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 text-ink lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-line/30 lg:hidden"
              style={{ background: "rgba(248,249,252,0.98)" }}
            >
              <div className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                        isActive
                          ? "bg-brand-midnight text-white"
                          : "text-muted hover:bg-white hover:text-ink"
                      )
                    }
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mb-8 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <div className="page-header-eyebrow mb-3">
              <Sparkles className="h-3 w-3" />
              {state?.session?.role ? `${state.session.role} workspace` : "NIRA Platform"}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted sm:text-base">{subtitle}</p>
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
        </motion.div>
        {children}
      </main>
    </div>
  );
}

export function FloatingAccent({ className }) {
  return (
    <div className={cn("pointer-events-none absolute -z-10 rounded-full bg-cyan-200/60 blur-3xl", className)} />
  );
}
