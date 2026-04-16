import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  // Pure CSS: This forces the div to take up the exact width and height of the screen,
  // and uses flexbox to lock the Clerk widget in the absolute dead center.
  const centerScreenStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020617', // Dark slate color to match your Landing Page
    zIndex: 9999, // Puts it on top of absolutely everything
    margin: 0,
    padding: 0
  };

  return (
    <div style={centerScreenStyle}>
      <SignIn forceRedirectUrl="/dashboard" />
    </div>
  );
}