import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/App";
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

// Themed Select Components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ThemedSelect = Select;
export const ThemedSelectValue = SelectValue;

export const ThemedSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  React.ComponentPropsWithoutRef<typeof SelectTrigger>
>(({ className, ...props }, ref) => {
  return (
    <SelectTrigger 
      className={cn("bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-2xl focus:bg-white/10 focus:border-white/20", className)}
      ref={ref} 
      {...props} 
    />
  );
});
ThemedSelectTrigger.displayName = "ThemedSelectTrigger";

export const ThemedSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectContent>,
  React.ComponentPropsWithoutRef<typeof SelectContent>
>(({ className, ...props }, ref) => {
  return (
    <SelectContent 
      className={cn("bg-black/95 backdrop-blur-xl border border-white/20 text-white shadow-2xl max-h-[300px]", className)}
      ref={ref} 
      {...props} 
    />
  );
});
ThemedSelectContent.displayName = "ThemedSelectContent";

export const ThemedSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectItem>,
  React.ComponentPropsWithoutRef<typeof SelectItem>
>(({ className, ...props }, ref) => {
  return (
    <SelectItem 
      className={cn("text-white focus:bg-white/10 focus:text-white", className)}
      ref={ref} 
      {...props} 
    />
  );
});
ThemedSelectItem.displayName = "ThemedSelectItem";

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
  const { navigateTo } = useNavigation();

  const handleBack = () => {
    if (customBackAction) {
      customBackAction();
    } else {
      // Navigate to home as default back action for SPA
      navigateTo("home");
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
  // For pages with video backgrounds, don't apply solid backgrounds
  const hasVideoBackground = pageType === 'information' || pageType === 'shop';
  
  // Different background styles based on page type
  const bgClasses = {
    default: "bg-background text-foreground",
    theater: "bg-gradient-to-br from-black to-amber-950",
    shop: hasVideoBackground ? "text-white" : "bg-gradient-to-br from-black to-blue-950",
    activities: "bg-gradient-to-br from-black to-green-950",
    information: hasVideoBackground ? "text-white" : "bg-gradient-to-br from-black to-purple-950"
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
