// import { useEffect } from "react";

// export const useWarnIfUnsavedChanges = (
//   unsavedChanges: boolean,
//   callback: () => boolean
// ) => {
//   const router = useRouter();
//   useEffect(() => {
//     if (unsavedChanges) {
//       const routeChangeStart = (url: any, { shallow }: any) => {
//         if (url !== router.asPath) {
//           const ok = callback();
//           if (!ok) {
//             Router.events.emit("routeChangeError");
//             throw "Abort route change. Please ignore this error.";
//           }
//         }
//       };
//       Router.events.on("routeChangeStart", routeChangeStart);

//       return () => {
//         Router.events.off("routeChangeStart", routeChangeStart);
//       };
//     }
//   }, [unsavedChanges]);
// };

// useWarnIfUnsavedChanges(!editor?.isEmpty && !isSubmitting, warnOnNavigate);
