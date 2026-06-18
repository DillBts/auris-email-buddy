export const isNative = () => {
  try {
    return !!(window as any).Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
};

export const signInWithGoogleNative = async () => {
  try {
    console.log("[capacitor] signInWithGoogleNative: reached, importing package");
    const pkg = "@capacitor-firebase/authentication";
    const { FirebaseAuthentication } = await import(/* @vite-ignore */ pkg);
    return FirebaseAuthentication.signInWithGoogle();
  } catch (err) {
    console.error("[capacitor] signInWithGoogleNative failed:", err);
    throw err;
  }
};

export const addAppUrlOpenListener = async (handler: (data: { url: string }) => void) => {
  const pkg = "@capacitor/app";
  const { App } = await import(/* @vite-ignore */ pkg);
  return App.addListener("appUrlOpen", handler);
};
