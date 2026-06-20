export const isNative = () => {
  try {
    return !!(window as any).Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
};

export const signInWithGoogleNative = async () => {
  const mod = await import(/* @vite-ignore */ "@capacitor-firebase/authentication");
  return mod.FirebaseAuthentication.signInWithGoogle();
};

export const addAppUrlOpenListener = async (handler: (data: { url: string }) => void) => {
  console.log("addAppUrlOpenListener called");
  const mod = await import(/* @vite-ignore */ "@capacitor/app");
  return mod.App.addListener("appUrlOpen", (data: { url: string }) => {
    console.log("appUrlOpen received url:", data.url);
    handler(data);
  });
};
