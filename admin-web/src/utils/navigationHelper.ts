import type { NavigateFunction } from "react-router-dom";

/**
 * Helper untuk handle navigasi dengan animasi/menu close
 * @param navigate - fungsi navigate dari react-router
 * @param to - tujuan halaman
 * @param setMenuOpen - fungsi untuk menutup menu (optional)
 * @param setLoading - fungsi untuk set loading state (optional)
 * @param useWindow - pakai window.location.href atau navigate (default: false)
 * @param replace - gunakan replace agar tidak menambah history (default: false)
 */
export const handleNavigate = (
  navigate: NavigateFunction,
  to: string,
  setMenuOpen?: (open: boolean) => void,
  setLoading?: (loading: boolean) => void,
  useWindow: boolean = false,
  replace: boolean = false
) => {
  if (setMenuOpen) setMenuOpen(false);
  if (setLoading) setLoading(true);

  setTimeout(() => {
    if (useWindow) {
      if (replace) {
        window.location.replace(to);
      } else {
        window.location.href = to;
      }
    } else {
      navigate(to, { replace });
    }
    if (setLoading) setLoading(false);
  }, 1500);
};
