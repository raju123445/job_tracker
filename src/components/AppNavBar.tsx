import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/saved", label: "Saved" },
  { to: "/digest", label: "Digest" },
  { to: "/settings", label: "Settings" },
  { to: "/proof", label: "Proof" },
];

const AppNavBar = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <nav className="border-b border-border bg-background">
      <div className="flex items-center justify-between px-3 py-1.5">
        <span className="font-serif text-subheading font-semibold text-foreground tracking-tight">
          KodNest
        </span>

        {isMobile ? (
          <button
            onClick={() => setOpen(!open)}
            className="p-0.5 text-muted-foreground hover:text-foreground transition-default"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-small font-medium text-muted-foreground pb-0.5 border-b-2 border-transparent transition-default hover:text-foreground"
                activeClassName="text-foreground border-b-2 !border-primary"
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {isMobile && open && (
        <div className="flex flex-col border-t border-border px-3 py-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="py-1 text-small font-medium text-muted-foreground transition-default hover:text-foreground"
              activeClassName="text-foreground border-l-2 border-primary pl-1"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default AppNavBar;
