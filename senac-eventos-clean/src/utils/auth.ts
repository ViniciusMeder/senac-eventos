export function login(username: string, password: string) {
  // Login do gestor
  if (username === "gestor" && password === "1234") {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userType", "gestor");
    return "gestor";
  }

  // Login do aluno
  if (username === "aluno" && password === "1234") {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userType", "aluno");
    return "aluno";
  }

  // Login inválido
  return null;
}

export function isAuthenticated() {
  return localStorage.getItem("isAuthenticated") === "true";
}

export function getUserType() {
  return localStorage.getItem("userType");
}

export function logout() {
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("userType");
}