 //Verifica se tem o token
export function isUserLogged(): boolean {
  const token = localStorage.getItem("jwtToken");
  return !!token;
}

// Atualiza os links de navegação (login/perfil) conforme se está logado ou não
export function updateAuthLinks(): void {
  const loggedIn = isUserLogged();

  const loginLink = document.getElementById("ident0") as HTMLElement;
  const perfilLink = document.getElementById("ident1") as HTMLElement;
  const logoutBtn = document.getElementById("logout") as HTMLElement;

  if (!loginLink && !perfilLink && !logoutBtn) return;

  if (loggedIn) {
    loginLink?.classList.replace('flex', 'hidden');
    perfilLink?.classList.replace('hidden', 'flex');
    logoutBtn?.classList.replace('hidden', 'flex');
  } else {
    loginLink?.classList.replace('hidden', 'flex');
    perfilLink?.classList.replace('flex', 'hidden');
    logoutBtn?.classList.replace('flex', 'hidden');
  }
}

// Funçao de logout
export function logout(): void {
  localStorage.removeItem("jwtToken");
  window.location.href = "./index.html";
}

window.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout") as HTMLElement | null;
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }

  updateAuthLinks();
});