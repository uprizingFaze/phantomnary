"use client"

import * as React from "react"

import { LayoutGroup, motion } from "framer-motion"
import { IconHamburger } from "justd-icons"
import type { LinkProps } from "react-aria-components"
import { Link } from "react-aria-components"
import { tv } from "tailwind-variants"

import { Button } from "./button"
import { Container } from "./container"
import { cn, cr, useMediaQuery } from "./primitive"
import { Sheet } from "./sheet"

type NavbarOptions = {
  side?: "left" | "right"
  isSticky?: boolean
  intent?: "navbar" | "floating" | "inset"
}

type NavbarContextProps = {
  open: boolean
  setOpen: (open: boolean) => void
  openCompact: boolean
  setOpenCompact: (open: boolean) => void
  isCompact: boolean
  toggleNavbar: () => void
} & NavbarOptions

const NavbarContext = React.createContext<NavbarContextProps | null>(null)

function useNavbar() {
  const context = React.useContext(NavbarContext)
  if (!context) {
    throw new Error("useNavbar must be used within a Navbar.")
  }

  return context
}

interface NavbarProviderProps extends React.ComponentProps<"header">, NavbarOptions {
  defaultOpen?: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const navbarStyles = tv({
  base: "relative isolate flex w-full min-h-svh flex-col",
  variants: {
    intent: {
      floating: "pt-2 px-2",
      navbar: "",
      inset: "bg-secondary dark:bg-bg"
    }
  }
})

const Navbar = ({
  children,
  isOpen: openProp,
  onOpenChange: setOpenProp,
  defaultOpen = false,
  className,
  side = "left",
  isSticky = false,
  intent = "navbar",
  ...props
}: NavbarProviderProps) => {
  const [openCompact, setOpenCompact] = React.useState(false)
  const isCompact = useMediaQuery("(max-width: 600px)")
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open

  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      if (setOpenProp) {
        return setOpenProp?.(typeof value === "function" ? value(open) : value)
      }

      _setOpen(value)
    },
    [setOpenProp, open]
  )

  const toggleNavbar = React.useCallback(() => {
    return isCompact ? setOpenCompact((open) => !open) : setOpen((open) => !open)
  }, [isCompact, setOpen, setOpenCompact])
  const contextValue = React.useMemo<NavbarContextProps>(
    () => ({
      open,
      setOpen,
      isCompact,
      openCompact,
      setOpenCompact,
      toggleNavbar,
      intent,
      isSticky,
      side
    }),
    [open, setOpen, isCompact, openCompact, setOpenCompact, toggleNavbar, intent, isSticky, side]
  )
  return (
    <NavbarContext.Provider value={contextValue}>
      <header data-intent={intent} className={navbarStyles({ intent, className })} {...props}>
        {children}
      </header>
    </NavbarContext.Provider>
  )
}

const navStyles = tv({
  base: "hidden h-[--navbar-height] [--navbar-height:3.5rem] px-4 group peer lg:flex items-center w-full max-w-screen-2xl mx-auto",
  variants: {
    isSticky: {
      true: "sticky top-0"
    },
    intent: {
      floating: "bg-tertiary shadow-sm border rounded-xl sm:px-4",
      navbar: "bg-tertiary shadow-sm border-b sm:px-6",
      inset: "bg-secondary dark:bg-bg sm:px-6"
    }
  }
})

interface NavbarProps extends React.ComponentProps<"div"> {
  intent?: "navbar" | "floating" | "inset"
  isSticky?: boolean
  side?: "left" | "right"
}

const Nav = ({ className, ...props }: NavbarProps) => {
  const { isCompact, side, intent, isSticky, openCompact, setOpenCompact } = useNavbar()

  if (isCompact) {
    return (
      <Sheet isOpen={openCompact} onOpenChange={setOpenCompact} {...props}>
        <Sheet.Content
          side={side}
          aria-label="Compact Navbar"
          data-navbar="compact"
          classNames={{
            content: "text-fg [&>button]:hidden"
          }}
          isStack={intent === "floating"}
        >
          <Sheet.Body className="px-2">{props.children}</Sheet.Body>
        </Sheet.Content>
      </Sheet>
    )
  }

  return (
    <div className={navStyles({ isSticky, intent, className })} {...props}>
      {props.children}
    </div>
  )
}

const Trigger = ({ className, onPress, ...props }: React.ComponentProps<typeof Button>) => {
  const { toggleNavbar } = useNavbar()
  return (
    <Button
      data-sidebar="trigger"
      appearance="plain"
      aria-label={props["aria-label"] || "Toggle Navbar"}
      size="square-petite"
      className={className}
      onPress={(event) => {
        onPress?.(event)
        toggleNavbar()
      }}
      {...props}
    >
      <IconHamburger />
      <span className="sr-only">Toggle Navbar</span>
    </Button>
  )
}

const Section = ({ className, ...props }: React.ComponentProps<"div">) => {
  const isCompact = useMediaQuery("(max-width: 600px)")
  const id = React.useId()
  return (
    <LayoutGroup id={id}>
      <div
        data-slot="navbar-section"
        className={cn(
          "flex",
          isCompact ? "flex-col gap-y-4" : "flex-row gap-x-3 items-center",
          className
        )}
        {...props}
      >
        {props.children}
      </div>
    </LayoutGroup>
  )
}

const linkStyles = tv({
  base: [
    "relative text-sm px-2 flex items-center gap-x-2 [&>[data-slot=icon]]:-mx-0.5 text-muted-fg outline-none forced-colors:disabled:text-[GrayText] transition-colors",
    "disabled:opacity-60 disabled:cursor-default",
    "current:text-fg hover:text-fg focus:text-fg pressed:text-fg focus-visible:outline-1 focus-visible:outline-primary"
  ],
  variants: {
    isCurrent: {
      true: "text-fg"
    }
  }
})

interface ItemProps extends LinkProps {
  isCurrent?: boolean
}

const Item = ({ className, isCurrent, ...props }: ItemProps) => {
  const { intent, isCompact } = useNavbar()
  return (
    <Link
      slot="navbar-item"
      aria-current={isCurrent ? "page" : undefined}
      className={cr(className, (className, ...renderProps) =>
        linkStyles({ ...renderProps, isCurrent, className })
      )}
      {...props}
    >
      {(values) => (
        <>
          {typeof props.children === "function" ? props.children(values) : props.children}

          {(isCurrent || values.isCurrent) && !isCompact && intent !== "floating" && (
            <motion.span
              layoutId="current-indicator"
              className="absolute inset-x-2 bottom-[calc(var(--navbar-height)*-0.33)] h-0.5 rounded-full bg-fg"
            />
          )}
        </>
      )}
    </Link>
  )
}

const Logo = ({ className, ...props }: LinkProps) => {
  return (
    <Link
      className={cn(
        "lg:mr-4 focus:outline-none flex items-center gap-x-2 focus-visible:outline-1 focus-visible:outline-primary px-2 py-4 lg:px-0 lg:py-0 text-fg",
        className
      )}
      {...props}
    />
  )
}

const Flex = ({ className, ...props }: React.ComponentProps<"div">) => {
  return <div className={cn("flex items-center gap-3", className)} {...props} />
}

const compactStyles = tv({
  base: "lg:hidden flex peer-has-[[data-intent=floating]]:border bg-tertiary justify-between",
  variants: {
    intent: {
      floating: "border h-12 rounded-lg px-3.5",
      inset: "h-14 px-4",
      navbar: "h-14 border-b px-4"
    }
  }
})

const Compact = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { intent } = useNavbar()
  return <div className={compactStyles({ intent, className })} {...props} />
}

const insetStyles = tv({
  base: "grow p-4 lg:py-10",
  variants: {
    intent: {
      floating: "",
      inset:
        "bg-tertiary lg:rounded-lg lg:shadow-sm lg:ring-1 lg:ring-dark/5 lg:dark:ring-light/10",
      navbar: ""
    }
  }
})

const Inset = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { intent } = useNavbar()
  return (
    <main
      data-intent={intent}
      className={cn("flex flex-1 flex-col", intent === "inset" && "pb-2 lg:px-2", className)}
    >
      <div className={insetStyles({ intent, className })}>
        <Container>{props.children}</Container>
      </div>
    </main>
  )
}

Navbar.Nav = Nav
Navbar.Inset = Inset
Navbar.Compact = Compact
Navbar.Flex = Flex
Navbar.Trigger = Trigger
Navbar.Logo = Logo
Navbar.Item = Item
Navbar.Section = Section

export { Navbar }
