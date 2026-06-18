let FirebaseAuthentication: any = null;
let CapacitorApp: any = null;

try {
  // These are statically imported but only work in native context
  const fa = require("@capacitor-firebase/authentication");
  FirebaseAuthentication = fa.FirebaseAuthentication;
  const ca = require("@capacitor/app");
  CapacitorApp = ca.App;
} catch (e) {
  // Running in web context - native plugins not available
}

export const isNative = () => {
  try {
    return !!(window as any).Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
};

export const signInWithGoogleNative = async () => {
  if (!FirebaseAuthentication) throw new Error("Native auth not available");
  return FirebaseAuthentication.signInWithGoogle();
};

export const addAppUrlOpenListener = async (handler: (data: { url: string }) => void) => {
  if (!CapacitorApp) throw new Error("Native app not available");
  return CapacitorApp.addListener("appUrlOpen", handler);
};
