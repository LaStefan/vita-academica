import AuthAwareNavbar from "./AuthAwareNavbar";

/**
 * Navbar component
 * 
 * This is a wrapper around the AuthAwareNavbar component that provides
 * navigation functionality. This abstraction allows for easy swapping
 * of navbar implementations in the future if needed.
 */
const Navbar = () => {
  return <AuthAwareNavbar />;
};

export default Navbar;
