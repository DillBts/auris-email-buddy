export const isNative = () => {
  try {
    return !!(window as any).Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
};

export const signInWithGoogleNative = async () => {
  const { FirebaseAuthentication } = await import("@capacitor-firebase/authentication");
  return FirebaseAuthentication.signInWithGoogle();
};

export const addAppUrlOpenListener = async (handler: (data: { url: string }) => void) => {
  const { App } = await import("@capacitor/app");
  return App.addListener("appUrlOpen", handler);
};
