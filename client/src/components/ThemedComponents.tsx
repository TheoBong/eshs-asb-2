import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import React from "react";

// Themed Button variants
export const PrimaryButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  return (
    <Button 
      className={cn("btn-primary", className)} 
      ref={ref} 
      {...props} 
    />
  );
});
PrimaryButton.displayName = "PrimaryButton";

export const SecondaryButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  return (
    <Button 
      className={cn("btn-secondary", className)} 
      ref={ref} 
      {...props} 
    />
  );
});
SecondaryButton.displayName = "SecondaryButton";

export const OutlineButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  return (
    <Button 
      variant="outline"
      className={cn("btn-outline", className)} 
      ref={ref} 
      {...props} 
    />
  );
});
OutlineButton.displayName = "OutlineButton";

// Themed Card
export const ThemedCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Card>
>(({ className, ...props }, ref) => {
  return (
    <Card 
      className={cn("card-themed backdrop-blur-md", className)} 
      ref={ref} 
      {...props} 
    />
  );
});
ThemedCard.displayName = "ThemedCard";

// Theater-specific components
export const TheaterCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Card>
>(({ className, ...props }, ref) => {
  return (
    <Card 
      className={cn("card-themed backdrop-blur-md", className)} 
      ref={ref} 
      {...props} 
    />
  );
});
TheaterCard.displayName = "TheaterCard";

export const TheaterButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  return (
    <Button 
      className={cn("theater-action", className)} 
      ref={ref} 
      {...props} 
    />
  );
});
TheaterButton.displayName = "TheaterButton";

// Themed Input
export const ThemedInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input 
      className={cn("input-themed", className)} 
      ref={ref} 
      {...props} 
    />
  );
});
ThemedInput.displayName = "ThemedInput";

// Themed Tabs
export const ThemedTabs = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Tabs>
>(({ className, ...props }, ref) => {
  return (
    <Tabs 
      className={cn("tabs-themed", className)} 
      ref={ref} 
      {...props} 
    />
  );
});
ThemedTabs.displayName = "ThemedTabs";

// Themed Top Bar for navigation
export const ThemedTopBar: React.FC<{
  title: string;
  showBackButton?: boolean;
  customBackAction?: () => void;
}> = ({ title, showBackButton = true, customBackAction }) => {
  const [, navigate] = useLocation(); // useLocation returns [path, navigate]

  const handleBack = () => {
    if (customBackAction) {
      customBackAction();
    } else {
      // wouter doesn't have a direct equivalent of navigate(-1)
      // Using window.history.back() is a common approach
      window.history.back();
    }
  };

  return (
    <div className="themed-top-bar">
      {showBackButton ? (
        <button onClick={handleBack} className="themed-back-button" aria-label="Go back">
          <i className="fas fa-arrow-left"></i>
        </button>
      ) : (
        <div className="themed-top-bar-placeholder" />
      )}
      <h1 className="themed-top-bar-title">{title}</h1>
      {/* Placeholder to balance the title if a right-side action button might be added later */}
      <div className="themed-top-bar-placeholder" />
    </div>
  );
};
// Themed page wrapper to apply consistent background styling
export const ThemedPageWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  pageType?: 'default' | 'theater' | 'shop' | 'activities' | 'information';
}> = ({ children, className, pageType = 'default' }) => {
  // Different background styles based on page type
  const bgClasses = {
    default: "bg-background text-foreground",
    theater: "bg-gradient-to-br from-black to-amber-950",
    shop: "bg-gradient-to-br from-black to-blue-950",
    activities: "bg-gradient-to-br from-black to-green-950",
    information: "bg-gradient-to-br from-black to-purple-950"
  };

  return (
    <div className={cn(
      "min-h-screen w-full",
      bgClasses[pageType],
      className
    )}>
      {children}
    </div>
  );
};
