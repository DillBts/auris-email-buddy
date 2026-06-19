export const isNative = () => {
  try {
    return !!(window as any).Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
};

export const signInWithGoogleNative = async () => {
  const mod = await import("@capacitor-firebase/authentication");
  return mod.FirebaseAuthentication.signInWithGoogle();
};

export const addAppUrlOpenListener = async (handler: (data: { url: string }) => void) => {
  const mod = await import("@capacitor/app");
  return mod.App.addListener("appUrlOpen", handler);
};
