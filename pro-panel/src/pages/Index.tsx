import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    window.location.href = "/provider.html";
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">Redirecting to Provider Panel...</p>
    </div>
  );
};

export default Index;
